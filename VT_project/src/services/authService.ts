import { supabase } from '../lib/supabase';

export const signUp = (email: string, password: string) => 
  supabase.auth.signUp({ email, password });

export const signIn = (email: string, password: string) => 
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};