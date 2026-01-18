import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchActivities } from "../../services/portfolioService";

type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number | null;
  is_visible: boolean;
};

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  if (start && !end) return `From ${start}`;
  if (!start && end) return `Until ${end}`;
  return `${start} – ${end}`;
}

export function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetchActivities();

      if (!mounted) return;

      if (res.error) {
        setErrorMsg(res.error.message);
        setActivities([]);
        setLoading(false);
        return;
      }

      setActivities((res.data ?? []) as ActivityRow[]);
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
        <h1 className="mb-4">Activities</h1>
        <p className="text-muted-foreground mb-12 text-lg max-w-3xl">
          Photography, volunteering, hiking, events, and other work outside
          coursework.
        </p>

        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load activities: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground">Loading activities…</div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {activities.map((a) => {
              const dateRange = formatDateRange(a.start_date, a.end_date);

              return (
                <Card
                  key={a.id}
                  className="col-span-12 md:col-span-6 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{a.title}</CardTitle>
                    <CardDescription className="text-base">
                      {a.description ?? "View details"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4 space-y-1">
                      {a.organization && (
                        <div>
                          <span className="font-medium text-foreground/80">
                            Organization:
                          </span>{" "}
                          {a.organization}
                        </div>
                      )}

                      {a.location && (
                        <div>
                          <span className="font-medium text-foreground/80">
                            Location:
                          </span>{" "}
                          {a.location}
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

                    <Button asChild className="w-full">
                      <Link
                        to={`/activities/${a.id}`}
                        aria-label={`Read more about ${a.title}`}
                      >
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {!activities.length && !errorMsg && (
              <div className="col-span-12 text-muted-foreground">
                No activities yet. Add rows in Supabase → activities.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
