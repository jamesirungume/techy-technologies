
-- Update the order_items RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

-- Create new policy that allows inserting order items for both authenticated users and guest orders
CREATE POLICY "Users can insert order items for their orders or guest orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      (orders.user_id = auth.uid()) OR 
      (orders.user_id IS NULL)
    )
  )
);

-- Create new policy that allows viewing order items for both authenticated users and guest orders
CREATE POLICY "Users can view order items for their orders or guest orders" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      (orders.user_id = auth.uid()) OR 
      (orders.user_id IS NULL)
    )
  )
);
