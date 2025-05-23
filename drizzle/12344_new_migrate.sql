-- Add admin role to existing owner account
UPDATE public.users
SET is_admin = TRUE
WHERE email = 'topedarasimi5@gmail.com';
