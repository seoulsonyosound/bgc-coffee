export interface CustomerInfo {
  fullName: string;
  contactNumber: string;
  email?: string;
  pickupNotes?: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}
