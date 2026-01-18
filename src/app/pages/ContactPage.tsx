import { useEffect, useMemo, useState } from "react";
import { Mail, Linkedin, Handshake, Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchProfile, fetchSocialLinks } from "../../services/portfolioService";

type ProfileRow = {
  full_name: string;
  email: string;
};

type SocialLinkRow = {
  id: string;
  label: string;
  url: string;
  icon: string | null;
};

function iconForSocialInline(icon: string | null, label: string) {
  const key = (icon ?? label).toLowerCase();
  if (key.includes("linkedin")) return <Linkedin className="w-6 h-6" />;
  if (key.includes("github")) return <Github className="w-6 h-6" />;
  if (key.includes("handshake")) return <Handshake className="w-6 h-6" />;
  return <ExternalLink className="w-6 h-6" />;
}

function iconForContact(icon: string | null, label: string) {
  const key = (icon ?? label).toLowerCase();
  if (key.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
  if (key.includes("handshake")) return <Handshake className="w-5 h-5" />;
  if (key.includes("github")) return <Github className="w-5 h-5" />;
  return <ExternalLink className="w-5 h-5" />;
}

export function ContactPage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [links, setLinks] = useState<SocialLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const [p, s] = await Promise.all([fetchProfile(), fetchSocialLinks()]);

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

      setProfile(p.data as ProfileRow);
      setLinks((s.data ?? []) as SocialLinkRow[]);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const email = profile?.email ?? "";

  // Prefer LinkedIn + Handshake for the top "quick links" row (fallback to all if missing)
  const preferredInline = useMemo(() => {
    const preferred = links.filter((l) => {
      const key = `${l.icon ?? ""} ${l.label}`.toLowerCase();
      return key.includes("linkedin") || key.includes("handshake");
    });
    return preferred.length ? preferred : links;
  }, [links]);

  // Keep the card list as your preferred (LinkedIn + Handshake) OR all
  const preferredList = useMemo(() => {
    const preferred = links.filter((l) => {
      const key = `${l.icon ?? ""} ${l.label}`.toLowerCase();
      return key.includes("linkedin") || key.includes("handshake");
    });
    return preferred.length ? preferred : links;
  }, [links]);

  return (
    <div className="w-full">
      <section className="container mx-auto px-8 py-16">
        {/* Header like Homepage teaser */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg mb-8">
            I’m always open to conversations - Feel free to reach out via email or connect with me on professional platforms.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load contact info: {errorMsg}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-muted-foreground">Loading contact info…</div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {/* Email */}
            <Card className="col-span-12 md:col-span-6">
              <CardHeader>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Click to send me an email.
                </p>

                <Button asChild className="w-full" disabled={!email}>
                  <a href={email ? `mailto:${email}` : undefined}>
                    <Mail className="w-5 h-5 mr-2" />
                    {email || "Email not set"}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Social links */}
            <Card className="col-span-12 md:col-span-6">
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preferredList.map((link) => (
                  <Button
                    key={link.id}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <span className="mr-2">
                        {iconForContact(link.icon, link.label)}
                      </span>
                      <span className="flex-1 text-left">{link.label}</span>
                      <ExternalLink className="w-4 h-4 opacity-70" />
                    </a>
                  </Button>
                ))}

                {!links.length && (
                  <div className="text-sm text-muted-foreground">
                    No social links yet. Add rows in Supabase → social_links.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
