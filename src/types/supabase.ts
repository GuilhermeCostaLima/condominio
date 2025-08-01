export interface Profile {
  id: string;
  user_id: string;
  apartment_number: string | null;
  role: 'admin' | 'resident';
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  apartment_number: string;
  resident_name: string;
  date: string;
  time_slot: string;
  event: string;
  contact: string;
  observations: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  cancellation_reason: string | null;
  requested_at: string;
  created_at: string;
  updated_at: string;
}

// Database response type (with potential string status)
export interface DatabaseReservation {
  id: string;
  user_id: string;
  apartment_number: string;
  resident_name: string;
  date: string;
  time_slot: string;
  event: string;
  contact: string;
  observations: string | null;
  status: string;
  cancellation_reason: string | null;
  requested_at: string;
  created_at: string;
  updated_at: string;
}