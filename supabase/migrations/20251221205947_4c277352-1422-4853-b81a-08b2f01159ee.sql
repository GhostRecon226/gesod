-- Create account status enum
CREATE TYPE public.account_status AS ENUM ('active', 'suspended');

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  account_status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_account_status ON public.customers(account_status);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers can view their own record
CREATE POLICY "Customers can view their own record"
ON public.customers FOR SELECT
USING (auth.uid() = user_id);

-- Customers can update their own record (limited fields handled in app)
CREATE POLICY "Customers can update their own record"
ON public.customers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all customers
CREATE POLICY "Admins can view all customers"
ON public.customers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create customers
CREATE POLICY "Admins can create customers"
ON public.customers FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update any customer
CREATE POLICY "Admins can update any customer"
ON public.customers FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete customers
CREATE POLICY "Admins can delete customers"
ON public.customers FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Optional: Function to auto-create customer record when user signs up
-- This extends the existing handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Assign default customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  -- Create customer record
  INSERT INTO public.customers (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  
  RETURN NEW;
END;
$$;