-- Create grievances table
CREATE TABLE IF NOT EXISTS public.grievances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for grievances
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

-- Users can read their own grievances
CREATE POLICY grievances_select_policy ON public.grievances
  FOR SELECT USING (user_id = auth.uid() OR 
                   EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Users can insert their own grievances
CREATE POLICY grievances_insert_policy ON public.grievances
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own grievances
CREATE POLICY grievances_update_policy ON public.grievances
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own grievances
CREATE POLICY grievances_delete_policy ON public.grievances
  FOR DELETE USING (user_id = auth.uid());

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grievances TO anon, authenticated;
