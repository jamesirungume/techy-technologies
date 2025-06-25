
-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own wishlist items
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own wishlist items
CREATE POLICY "Users can view their own wishlist" 
  ON public.wishlist 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own wishlist items
CREATE POLICY "Users can create their own wishlist items" 
  ON public.wishlist 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own wishlist items
CREATE POLICY "Users can delete their own wishlist items" 
  ON public.wishlist 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate wishlist items
CREATE UNIQUE INDEX wishlist_user_product_unique ON public.wishlist(user_id, product_id);
