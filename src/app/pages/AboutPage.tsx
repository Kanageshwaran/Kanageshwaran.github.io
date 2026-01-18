import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { fetchAboutSections } from "../../services/portfolioService";

type AboutSectionRow = {
  id: string;
  title: string;
  content: string;
  sort_order: number | null;
};

export function AboutPage() {
  const [sections, setSections] = useState<AboutSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetchAboutSections();

      if (!mounted) return;

      if (res.error) {
        setErrorMsg(res.error.message);
        setSections([]);
        setLoading(false);
        return;
      }

      setSections((res.data ?? []) as AboutSectionRow[]);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      <section className="container mx-auto px-8 py-16 max-w-4xl">
        <h1 className="mb-6">About Me</h1>

        <p className="text-muted-foreground mb-12 text-lg">
          A deeper look into who I am, what I do, and what I’ve learned along the way.
        </p>

        {/* Error */}
        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load about content: {errorMsg}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-muted-foreground">Loading about content…</div>
        ) : (
          <div className="space-y-10">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-lg whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!sections.length && !errorMsg && (
              <div className="text-muted-foreground">
                No about content yet.  
                Add sections in Supabase → <code>about_page</code>.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
