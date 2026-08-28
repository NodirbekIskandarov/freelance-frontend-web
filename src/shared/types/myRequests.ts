/**
 * Foydalanuvchi yuborgan arizalar — haqiqiy backend (`/me/requests/...`).
 *
 * To'rt xil ariza bir xil oqimda: kutilmoqda → tasdiqlandi yoki rad
 * etildi. Tasdiqlangach katalogda yangi yozuv yaratiladi va foydalanuvchi
 * MUKOFOT oladi (`reward_granted`).
 *
 * Beshinchisi — variant so'rovi — istisno: uni tasdiqlash kerak emas,
 * u shunchaki talabni sanaydi.
 */

export const REQUEST_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Ko‘rib chiqilmoqda',
  approved: 'Tasdiqlandi',
  rejected: 'Rad etildi',
};

interface RequestBase {
  id: string;
  status: RequestStatus;
  reject_reason: string;
  reward_granted: boolean;
  created_at: string;
  updated_at: string;
}

export interface MyUniversityRequest extends RequestBase {
  name: string;
  short_name: string;
  city: string;
  comment: string;
  created_university: string | null;
}

export interface MySubjectRequest extends RequestBase {
  university: string;
  university_name: string;
  university_short_name: string;
  name: string;
  course: number | null;
  semester: number | null;
  note: string;
  created_subject: string | null;
}

export interface MyAssignmentRequest extends RequestBase {
  subject: string;
  subject_name: string;
  university: string;
  university_name: string;
  /** Katalog manzilining birinchi bo'lagi shundan yasaladi. */
  university_short_name: string;
  title: string;
  type: string;
  description: string;
  file: string;
  variant_count: number | null;
  created_assignment: string | null;
}

/** Variant so'rovida holat yo'q — faqat bajarilgan-bajarilmagani. */
export interface MySolutionRequest {
  id: string;
  variant: string;
  variant_number: number;
  request_count: number;
  assignment: string;
  assignment_title: string;
  /** Katalog barcha turlarni ko'rsatmaydi — havola shunga qarab quriladi. */
  assignment_type: string;
  subject: string;
  subject_name: string;
  university_name: string;
  university_short_name: string;
  is_fulfilled: boolean;
  created_at: string;
}

export interface MyRequestsQuery {
  page?: number;
  page_size?: number;
  ordering?: string;
  status?: RequestStatus;
}

export interface UniversityRequestInput {
  name: string;
  short_name?: string;
  city?: string;
  comment?: string;
}
