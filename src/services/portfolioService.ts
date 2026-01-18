import { supabase } from "../lib/supabaseClient";

/* ------------------------
   Profile
------------------------ */
export async function fetchProfile() {
  return supabase
    .from("profile")
    .select(
      `
      *,
      profile_image:media_assets!profile_image_asset_id (
        public_url,
        alt_text
      )
    `,
    )
    .single();
}

export async function fetchSocialLinks() {
  return supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

export async function fetchAboutSections() {
  return supabase
    .from("about_page")
    .select("id,title,content,sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

/* ------------------------
   Subjects (with counts via view)
   Requires: public.subjects_with_counts view
------------------------ */
export async function fetchSubjects() {
  return supabase
    .from("subjects_with_counts")
    .select("*")
    .order("sort_order", { ascending: true });
}

export async function fetchSubjectsPreview(limit = 6) {
  return supabase
    .from("subjects_with_counts")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(limit);
}

/* ------------------------
   Courses (with counts via view)
   Requires: public.courses_with_counts view
------------------------ */
export async function fetchCoursesBySubject(subjectId: string) {
  return supabase
    .from("courses_with_counts")
    .select("*")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true });
}

export async function fetchCourseById(courseId: string) {
  return supabase.from("courses").select("*").eq("id", courseId).single();
}

/**
 * NOTE: Your actual table name (from your screenshot) is `course_tool`
 * with columns: id, course_id, tool, sort_order
 */
export async function fetchCourseTools(courseId: string) {
  return supabase
    .from("course_tool")
    .select("id,course_id,tool,sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });
}

/* ------------------------
   Assignments
------------------------ */
export async function fetchAssignmentsByCourse(courseId: string) {
  return supabase
    .from("assignments")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

/* ------------------------
   Activities
   Table: public.activities
   View:  public.activities_count  (select count(*) as total ...)

   Columns used:
   - list:   id,title,description,organization,location,start_date,end_date,...
   - detail: + story, cover_image_url
------------------------ */

// Landing page (all visible activities)
export async function fetchActivities() {
  return supabase
    .from("activities")
    .select(
      "id,title,description,organization,location,start_date,end_date,sort_order,is_visible",
    )
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
}

// Homepage preview (limit N)
export async function fetchActivitiesPreview(limit = 4) {
  return supabase
    .from("activities")
    .select("id,title,description,organization,location,start_date,end_date")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
}

// Detail page (one activity)
export async function fetchActivityById(activityId: string) {
  return supabase
    .from("activities")
    .select(
      "id,title,description,story,organization,location,cover_image_url,start_date,end_date",
    )
    .eq("id", activityId)
    .eq("is_visible", true)
    .single();
}

// Total count of visible activities (from view)
export async function fetchActivitiesCount() {
  return supabase.from("activities_count").select("total").single();
}

/* ------------------------
   Contact (Contact Page display)
------------------------ */

/**
 * If you want *only* LinkedIn + Handshake (+ Email separately),
 * call fetchContactLinks() from ContactPage.
 */
export async function fetchContactLinks() {
  return supabase
    .from("social_links")
    .select("id,label,url,icon,sort_order,is_visible")
    .eq("is_visible", true)
    .or("label.ilike.%linkedin%,label.ilike.%handshake%,icon.ilike.%linkedin%,icon.ilike.%handshake%")
    .order("sort_order", { ascending: true });
}

/* ------------------------
   Contact Messages (INSERT)
------------------------ */
export async function insertContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    subject: input.subject ?? null,
    message: input.message,
  });
}
