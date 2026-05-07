-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Public Profile that links to Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'worker')),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  profile_image_url VARCHAR(500),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Worker Profiles
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  experience_description TEXT,
  hourly_rate DECIMAL(10, 2),
  availability_status VARCHAR(20) DEFAULT 'available',
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  certifications JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Profiles
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  business_type VARCHAR(100),
  company_description TEXT,
  is_business_account BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(20) DEFAULT 'unverified',
  total_jobs_posted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id),
  worker_id UUID REFERENCES public.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('scheduled', 'spot')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address VARCHAR(500),
  budget DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'posted',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  urgency_level VARCHAR(20),
  images TEXT[], -- Array of image URLs
  voice_note_url VARCHAR(500), -- URL to audio file
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Job Media
CREATE TABLE public.job_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  media_url VARCHAR(500) NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  recipient_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  media_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL UNIQUE REFERENCES public.jobs(id),
  reviewer_id UUID NOT NULL REFERENCES public.users(id),
  reviewee_id UUID NOT NULL REFERENCES public.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Job Status History
CREATE TABLE public.job_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS POLICIES --
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public read for basic info" ON public.users FOR SELECT USING (true); -- Simplified for discovery

-- Job Policies
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true); -- Workers need to see jobs
CREATE POLICY "Customers create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Participants update jobs" ON public.jobs FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = worker_id);

-- Storage Buckets (Manual setup required in dashboard, but here is logic)
-- Bucket: profile-images, job-media, chat-attachments
