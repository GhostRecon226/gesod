-- Allow customers to view their own linked quote requests
CREATE POLICY "Customers can view their own linked quote requests"
ON public.public_quote_requests
FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);