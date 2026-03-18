export type EventType =
  | 'conference'
  | 'meetup'
  | 'hackathon'
  | 'workshop'
  | 'summit'
  | 'panel'
  | 'networking'
  | 'other';

export type EventSource = 'manual' | 'scraper' | 'api';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  company?: string;
  email: string;
  notification_opt_in: boolean;
  gdpr_consent: boolean;
  gdpr_consent_date?: string;
  // Extended profile fields (migration 002)
  avatar_url?: string;
  username?: string;
  bio?: string;
  website_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  city: string;
  hosting_company: string;
  organizer_id?: string;
  organizer_email?: string;
  event_type?: EventType;
  event_types?: EventType[];
  tags?: string[];
  website_url?: string;
  registration_url?: string;
  cover_image_url?: string;
  source: EventSource;
  source_url?: string;
  external_id?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  organizer?: Profile;
}

export interface EventFilters {
  search?: string;
  hosting_company?: string;
  event_type?: EventType;
  date_from?: string;
  date_to?: string;
  tags?: string[];
}

export interface NotificationSubscription {
  id: string;
  user_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscriber_company?: string;
  is_active: boolean;
  created_at: string;
}

export interface SignupFormData {
  first_name: string;
  last_name: string;
  company?: string;
  email: string;
  password: string;
  notification_opt_in: boolean;
  gdpr_consent: boolean;
}

export interface SubscribeFormData {
  first_name: string;
  last_name: string;
  company?: string;
  email: string;
  gdpr_consent: boolean;
}

export interface EventFormData {
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  city: string;
  hosting_company: string;
  event_type?: EventType;
  event_types?: EventType[];
  tags?: string[];
  website_url?: string;
  registration_url?: string;
  cover_image_url?: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  company?: string;
  bio?: string;
  website_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
