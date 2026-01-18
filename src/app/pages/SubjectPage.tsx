import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { supabase } from "../../lib/supabaseClient";
import {
  fetchCoursesBySubject,
  fetchCourseTools,
} from "../../services/portfolioService";

type SubjectRow = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
};

type CourseRow = {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  term: string | null;
  assignment_count: number | null;
};

type CourseToolRow = {
  id: string;
  course_id: string;
  tool: string;
  sort_order: number | null;
};

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<SubjectRow | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [toolsByCourse, setToolsByCourse] = useState<Record<string, string[]>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const safeSubjectId = useMemo(() => subjectId?.trim() ?? "", [subjectId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!safeSubjectId) {
        setSubject(null);
        setCourses([]);
        setToolsByCourse({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      /* 1) Subject */
      const subjRes = await supabase
        .from("subjects")
        .select("id,name,description,icon")
        .eq("id", safeSubjectId)
        .single();

      if (!mounted) return;

      if (subjRes.error) {
        setErrorMsg(subjRes.error.message);
        setLoading(false);
        return;
      }

      setSubject(subjRes.data as SubjectRow);

      /* 2) Courses */
      const courseRes = await fetchCoursesBySubject(safeSubjectId);

      if (!mounted) return;

      if (courseRes.error) {
        setErrorMsg(courseRes.error.message);
        setLoading(false);
        return;
      }

      const courseRows = (courseRes.data ?? []) as CourseRow[];
      setCourses(courseRows);

      /* 3) Tools per course */
      const toolsMap: Record<string, string[]> = {};

      await Promise.all(
        courseRows.map(async (course) => {
          const toolsRes = await fetchCourseTools(course.id);

          if (toolsRes.error) {
            toolsMap[course.id] = [];
            return;
          }

          const rows = (toolsRes.data ?? []) as CourseToolRow[];

          toolsMap[course.id] = rows
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((r) => r.tool);
        }),
      );

      if (!mounted) return;

      setToolsByCourse(toolsMap);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [safeSubjectId]);

  /* Subject not found */
  if (!loading && (!safeSubjectId || !subject)) {
    return (
      <div className="container mx-auto px-8 py-16 text-center">
        <h2 className="mb-4">Subject Not Found</h2>
        {errorMsg && (
          <p className="text-muted-foreground mb-6 text-sm">{errorMsg}</p>
        )}
        <Button asChild>
          <Link to="/academic-work">Back to Academic Work</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="container mx-auto px-8 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/academic-work")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Subjects
        </Button>

        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load content: {errorMsg}
          </div>
        )}

        {/* Subject header */}
        <div className="mb-12">
          <div className="text-5xl mb-4">{subject?.icon ?? "📘"}</div>
          <h1 className="mb-4">{subject?.name}</h1>
          <p className="text-muted-foreground text-lg">
            {subject?.description}
          </p>
        </div>

        <h2 className="mb-8">Courses</h2>

        {loading ? (
          <div className="text-muted-foreground">Loading courses…</div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            {courses.map((course) => {
              const tools = (toolsByCourse[course.id] ?? []).slice(0, 3);
              const assignmentCount = course.assignment_count ?? 0;

              return (
                <Card
                  key={course.id}
                  className="col-span-12 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 text-sm text-muted-foreground">
                      {assignmentCount}{" "}
                      {assignmentCount === 1 ? "assignment" : "assignments"}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm mb-2 text-muted-foreground">
                        Tools Used:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tools.length ? (
                          tools.map((tool) => (
                            <Badge
                              key={`${course.id}-${tool}`}
                              variant="secondary"
                            >
                              {tool}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not listed yet
                          </span>
                        )}
                      </div>
                    </div>

                    <Button asChild>
                      <Link to={`/course/${course.id}`}>
                        View Assignments
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {!courses.length && !errorMsg && (
              <div className="col-span-12 text-muted-foreground">
                No courses found for this subject yet.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
