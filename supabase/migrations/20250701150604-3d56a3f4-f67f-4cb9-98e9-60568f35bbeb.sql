
-- Update the orders table RLS policy to allow guest orders (user_id can be null)
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

CREATE POLICY "Users can insert their own orders or guest orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Update the view policy to allow users to see their own orders and allow guest access for order confirmation
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders or guest can view during session" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- Update the update policy to allow guest orders to be updated (for payment status changes)
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can update their own orders or guest orders can be updated" 
ON public.orders 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);
