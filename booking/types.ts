export type BookingType = 'individual' | 'group';

export type BookingStatus =
  | 'requested'
  | 'rejected'
  | 'approved'
  | 'agreement_pending_signatures'
  | 'signed_ready_for_owner'
  | 'completed';

export interface BookingAgreement {
  agreementId: string;
  generatedAt: string;
  studentSignatures: Record<string, string>;
  ownerConfirmedAt?: string;
  pdfDataUri?: string;
}

export interface BookingRecord {
  id: string;
  bookingType: BookingType;
  requesterName: string;
  studentNames: string[];
  roomDetails: string;
  monthlyRent: number;
  periodStart: string;
  periodEnd: string;
  status: BookingStatus;
  createdAt: string;
  ownerDecisionNote?: string;
  agreement?: BookingAgreement;
}