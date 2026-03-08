import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private client: any;

  constructor() {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
    // The new @google/genai SDK uses GoogleGenAI
    this.client = new GoogleGenAI({ apiKey });
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
      
      Return ONLY a JSON object.
    `;

    try {
      const result = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64
                }
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dosage: { type: Type.STRING },
              frequency: { type: Type.STRING },
              instructions: { type: Type.STRING },
              quantity: { type: Type.STRING }
            }
          }
        }
      });

      const response = result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini extraction error', error);
      throw error;
    }
  }

  async chat(message: string, history: any[] = []): Promise<string> {
    try {
      const chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // In @google/genai, chat session is created differently or managed manually
      const result = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: 'You are a helpful and empathetic medical assistant. You provide general information about medications, side effects, and health tracking. Do not provide specific medical diagnoses. Always advise consulting a doctor for serious issues.',
        }
      });

      return result.response.text();
    } catch (error) {
      console.error('Gemini chat error', error);
      return "I'm having trouble connecting right now. Please try again.";
    }
  }
}