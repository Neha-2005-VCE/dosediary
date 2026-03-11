import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey: string;
  private readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = localStorage.getItem('GROK_API_KEY') || '';
  }

  async extractMedicationDetails(imageBase64: string): Promise<any> {
    const prompt = `
      Analyze this image of a prescription or medication label. 
      Extract the following details if visible:
      - Medication Name
      - Dosage (e.g., 500mg)
      - Frequency (e.g., twice daily)
      - Instructions (e.g., take with food)
      - Total Quantity
      
      Return ONLY a JSON object with keys: name, dosage, frequency, instructions, quantity.
    `;

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                },
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return JSON.parse(data.choices[0].message.content);
      }
      return null;
    } catch (error) {
      console.error('Grok extraction error', error);
      throw error;
    }
  }

  async chat(message: string, history: any[] = []): Promise<string> {
    if (!this.apiKey) {
      // Re-read in case it was set after construction
      this.apiKey = localStorage.getItem('GROK_API_KEY') || '';
    }

    if (!this.apiKey) {
      return "API key not configured. Please set your Grok API key in Settings (localStorage key: 'GROK_API_KEY').";
    }

    try {
      const chatHistory = history
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful and empathetic medical assistant. You provide general information about medications, side effects, and health tracking. Do not provide specific medical diagnoses. Always advise consulting a doctor for serious issues.'
            },
            ...chatHistory
          ],
          temperature: 0.7,
          stream: false
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      return "I couldn't process that request. Please try again.";
    } catch (error) {
      console.error('Grok chat error', error);
      return "I'm having trouble connecting right now. Please try again.";
    }
  }
}