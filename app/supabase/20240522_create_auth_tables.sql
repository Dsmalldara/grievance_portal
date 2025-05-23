-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_token)
);

-- Create extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to register a new user
CREATE OR REPLACE FUNCTION public.register_user(
  p_email TEXT,
  p_password TEXT,
  p_name TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_exists BOOLEAN;
BEGIN
  -- Check if email already exists
  SELECT EXISTS(SELECT 1 FROM public.users WHERE email = p_email) INTO v_exists;
  
  IF v_exists THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Email already exists');
  END IF;
  
  -- Insert new user with hashed password
  INSERT INTO public.users (email, password_hash, name)
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),
    p_name
  )
  RETURNING id INTO v_user_id;
  
  RETURN jsonb_build_object('success', TRUE, 'user_id', v_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to login a user
CREATE OR REPLACE FUNCTION public.login_user(
  p_email TEXT,
  p_password TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_session_id UUID;
  v_session_token TEXT;
BEGIN
  -- Check credentials and get user ID
  SELECT id INTO v_user_id
  FROM public.users
  WHERE email = p_email AND password_hash = crypt(p_password, password_hash);
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Invalid email or password');
  END IF;
  
  -- Generate session token
  v_session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Deactivate any existing sessions for this user
  UPDATE public.user_sessions
  SET is_active = FALSE
  WHERE user_id = v_user_id AND is_active = TRUE;
  
  -- Create new session
  INSERT INTO public.user_sessions (user_id, session_token, expires_at, is_active)
  VALUES (
    v_user_id,
    v_session_token,
    NOW() + INTERVAL '30 days',
    TRUE
  )
  RETURNING id INTO v_session_id;
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'user_id', v_user_id,
    'session_id', v_session_id,
    'session_token', v_session_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to logout a user
CREATE OR REPLACE FUNCTION public.logout_user() RETURNS JSONB AS $$
DECLARE
  v_client_id UUID;
BEGIN
  -- Get client ID from Supabase auth context
  v_client_id := auth.uid();
  
  IF v_client_id IS NULL THEN
    -- If no authenticated user, try to get from cookie or header in the future
    -- For now, just return success
    RETURN jsonb_build_object('success', TRUE);
  END IF;
  
  -- Deactivate all active sessions for this user
  UPDATE public.user_sessions
  SET is_active = FALSE
  WHERE user_id = v_client_id AND is_active = TRUE;
  
  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for users table
CREATE POLICY users_select_policy ON public.users
  FOR SELECT USING (TRUE);  -- Anyone can read user data

CREATE POLICY users_insert_policy ON public.users
  FOR INSERT WITH CHECK (TRUE);  -- Anyone can create a user

CREATE POLICY users_update_policy ON public.users
  FOR UPDATE USING (auth.uid() = id);  -- Only the user can update their own data

-- Policy for user_sessions table
CREATE POLICY sessions_select_policy ON public.user_sessions
  FOR SELECT USING (TRUE);  -- Anyone can read session data

CREATE POLICY sessions_insert_policy ON public.user_sessions
  FOR INSERT WITH CHECK (TRUE);  -- Anyone can create a session

CREATE POLICY sessions_update_policy ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);  -- Only the user can update their own sessions

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_sessions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.login_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.logout_user TO anon, authenticated;
