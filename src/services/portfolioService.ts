import { supabase } from "../lib/supabaseClient";

export async function fetchProfile() {
  return supabase.from("profile").select("*").single();
}

export async function fetchSocialLinks() {
  return supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

export async function fetchSubjects() {
  return supabase
    .from("subjects")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

export async function fetchActivities() {
  return supabase
    .from("activities")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}
