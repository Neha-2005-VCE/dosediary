export type UserRole = 'PATIENT' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
  token?: string; // JWT token
  medicalLicenseNumber?: string; // For doctors
  specialization?: string; // For doctors
  pharmacyName?: string; // For pharmacists
  shopDetails?: string; // For pharmacists
  medicalHistory?: string; // For patients
}

export interface PrescriptionVersion {
  updatedAt: string;
  updatedBy: string;
  reason: string;
  previousContent: Partial<Prescription>;
}

export interface Prescription {
  id?: string;
  userId?: string | number; // Backend usually uses this
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
  pdfUrl?: string;
  renewalPeriod?: string;
  history?: PrescriptionVersion[];
}