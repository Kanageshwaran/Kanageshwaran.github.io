import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Download, Linkedin, Github, Handshake } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  fetchProfile,
  fetchSocialLinks,
  fetchSubjectsPreview,
  fetchActivitiesPreview,
  fetchActivitiesCount,
} from "../../services/portfolioService";

type ProfileRow = {
  full_name: string;
  hero_title: string;
  hero_description: string;
  about_title: string;
  about_paragraph_1: string;
  about_paragraph_2: string | null;
  email: string;
  resume_url: string | null;
  profile_image?: { public_url: string; alt_text: string | null } | null;
};

type SocialLinkRow = {
  id: string;
  label: string;
  url: string;
  icon: string | null;
};

type SubjectRow = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  course_count?: number;
};

type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
};

function iconForSocial(icon: string | null, label: string) {
  const key = (icon ?? label).toLowerCase();
  if (key.includes("linkedin")) return <Linkedin className="w-6 h-6" />;
  if (key.includes("github")) return <Github className="w-6 h-6" />;
  if (key.includes("handshake")) return <Handshake className="w-6 h-6" />;
  return null;
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  if (start && !end) return `From ${start}`;
  if (!start && end) return `Until ${end}`;
  return `${start} – ${end}`;
}

export function Homepage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [activitiesCount, setActivitiesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const [p, s, subj, actPreview, actCount] = await Promise.all([
        fetchProfile(),
        fetchSocialLinks(),
        fetchSubjectsPreview(6),
        fetchActivitiesPreview(4),
        fetchActivitiesCount(),
      ]);

      if (!mounted) return;

      if (p.error) {
        setErrorMsg(p.error.message);
        setLoading(false);
        return;
      }
      if (s.error) {
        setErrorMsg(s.error.message);
        setLoading(false);
        return;
      }
      if (subj.error) {
        setErrorMsg(subj.error.message);
        setLoading(false);
        return;
      }
      if (actPreview.error) {
        setErrorMsg(actPreview.error.message);
        setLoading(false);
        return;
      }
      if (actCount.error) {
        setErrorMsg(actCount.error.message);
        setLoading(false);
        return;
      }

      setProfile(p.data as ProfileRow);
      setSocialLinks((s.data ?? []) as SocialLinkRow[]);
      setSubjects((subj.data ?? []) as SubjectRow[]);
      setActivities((actPreview.data ?? []) as ActivityRow[]);
      setActivitiesCount(actCount.data?.total ?? 0);

      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const profileImage = profile?.profile_image?.public_url;

  const contactLinks = useMemo(() => {
    return socialLinks.filter((l) => {
      const key = `${l.icon ?? ""} ${l.label}`.toLowerCase();
      return key.includes("linkedin") || key.includes("handshake");
    });
  }, [socialLinks]);

  return (
    <div className="w-full">
      {/* loading/error banner */}
      {errorMsg && (
        <div className="container mx-auto px-8 pt-6">
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load content: {errorMsg}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-5">
            {profileImage && (
              <img
                src={profileImage}
                alt={
                  profile?.profile_image?.alt_text ??
                  profile?.full_name ??
                  "Profile"
                }
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
              />
            )}
          </div>

          <div className="col-span-12 lg:col-span-7">
            <h1 className="mb-6">
              {profile?.hero_title ?? "Welcome to My Academic Portfolio"}
            </h1>

            <p className="text-muted-foreground mb-8 text-lg">
              {profile?.hero_description ??
                "This portfolio showcases my academic journey, projects, and skills."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild disabled={loading}>
                <Link to="/academic-work">View Academic Work</Link>
              </Button>

              {/* Change: send users to /contact page instead of homepage email section */}
              <Button variant="outline" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-8 py-16">
        <div className="max-w-4xl">
          <h2 className="mb-6">{profile?.about_title ?? "About Me"}</h2>

          <p className="text-muted-foreground mb-6 text-lg">
            {profile?.about_paragraph_1 ?? ""}
          </p>

          {profile?.about_paragraph_2 && (
            <p className="text-muted-foreground mb-8 text-lg">
              {profile.about_paragraph_2}
            </p>
          )}

          {profile?.resume_url && (
            <Button variant="outline" asChild>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-8 py-8">
        <div className="flex gap-6 justify-center flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${link.label} Profile`}
            >
              {iconForSocial(link.icon, link.label)}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Academic Preview */}
      <section className="container mx-auto px-8 py-16">
        <h2 className="mb-8">Academic Work Preview</h2>

        <div className="grid grid-cols-12 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="col-span-12 md:col-span-6 lg:col-span-4 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="text-4xl mb-2">{subject.icon ?? "📘"}</div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/subject/${subject.id}`}>View Courses</Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {!loading && !subjects.length && !errorMsg && (
            <div className="col-span-12 text-muted-foreground">
              No subjects found yet. Add subjects in Supabase → Table Editor →
              subjects.
            </div>
          )}
        </div>
      </section>

      {/* Other Activities */}
      <section className="container mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2>Other Activities</h2>
          <Link
            to="/activities"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all ({activitiesCount})
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {activities.map((activity) => {
            const dateRange = formatDateRange(
              activity.start_date,
              activity.end_date,
            );

            return (
              <Card
                key={activity.id}
                className="col-span-12 md:col-span-6 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{activity.title}</CardTitle>
                  <CardDescription className="text-base">
                    {activity.description ?? "View details"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {activity.organization && (
                      <div>
                        <span className="font-medium text-foreground/80">
                          Organization:
                        </span>{" "}
                        {activity.organization}
                      </div>
                    )}
                    {activity.location && (
                      <div>
                        <span className="font-medium text-foreground/80">
                          Location:
                        </span>{" "}
                        {activity.location}
                      </div>
                    )}
                    {dateRange && (
                      <div>
                        <span className="font-medium text-foreground/80">
                          Dates:
                        </span>{" "}
                        {dateRange}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/activities/${activity.id}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!loading && !activities.length && !errorMsg && (
            <div className="col-span-12 text-muted-foreground">
              No activities found yet. Add activities in Supabase → Table Editor
              → activities.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
