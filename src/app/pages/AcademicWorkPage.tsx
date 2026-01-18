import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchSubjects } from "../../services/portfolioService";

type SubjectRow = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  course_count: number | null; // allow null from SQL just in case
};

export function AcademicWorkPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetchSubjects();

      if (!mounted) return;

      if (res.error) {
        setErrorMsg(res.error.message);
        setSubjects([]);
        setLoading(false);
        return;
      }

      setSubjects((res.data ?? []) as SubjectRow[]);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      <section className="container mx-auto px-8 py-16">
        <h1 className="mb-4">Choose a Subject</h1>
        <p className="text-muted-foreground mb-12 text-lg max-w-3xl">
          Explore my academic work organized by subject. Each subject contains courses
          with detailed assignments and projects.
        </p>

        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load subjects: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground">Loading subjects…</div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {subjects.map((subject) => {
              const count = subject.course_count ?? 0; // final safe value

              return (
                <Card
                  key={subject.id}
                  className="col-span-12 md:col-span-6 lg:col-span-4 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="text-5xl mb-4">{subject.icon ?? "📘"}</div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription className="text-base">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {count} {count === 1 ? "course" : "courses"} available
                    </p>

                    <Button asChild className="w-full">
                      <Link to={`/subject/${subject.id}`}>View Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {!subjects.length && !errorMsg && (
              <div className="col-span-12 text-muted-foreground">
                No subjects found. Add subjects in Supabase → Table Editor → subjects.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
