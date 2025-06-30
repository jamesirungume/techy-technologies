
-- First, let's check what policies exist and create the missing ones
-- Create policies for order_items table (these should be missing)
DO $$ 
BEGIN
    -- Add RLS policies for the order_items table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view their own order items') THEN
        CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can insert their own order items') THEN
        CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
        );
    END IF;
END $$;

-- Enable RLS on order_items table if not already enabled
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cart table if not already enabled  
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a simple OTP table for seller access
CREATE TABLE IF NOT EXISTS public.seller_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otp_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours'),
  used BOOLEAN DEFAULT false
);

-- Enable RLS on seller_otp table
ALTER TABLE public.seller_otp ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read valid OTPs (needed for verification)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_otp' AND policyname = 'Anyone can verify OTP') THEN
        CREATE POLICY "Anyone can verify OTP" ON public.seller_otp FOR SELECT USING (
            expires_at > now() AND used = false
        );
    END IF;
END $$;

-- Insert a default OTP that will work for accessing the seller page
INSERT INTO public.seller_otp (otp_code, expires_at) 
VALUES ('SELLER2024', now() + interval '1 year')
ON CONFLICT DO NOTHING;
