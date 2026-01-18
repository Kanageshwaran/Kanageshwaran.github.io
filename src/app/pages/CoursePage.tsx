import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { supabase } from "../../lib/supabaseClient";
import {
  fetchCourseById,
  fetchAssignmentsByCourse,
} from "../../services/portfolioService";

type CourseRow = {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  term: string | null;
};

type SubjectRow = {
  id: string;
  name: string;
};

type AssignmentRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  github_link: string | null;
  sort_order: number | null;
  is_visible: boolean;
};

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const safeCourseId = useMemo(() => courseId?.trim() ?? "", [courseId]);

  const [course, setCourse] = useState<CourseRow | null>(null);
  const [parentSubject, setParentSubject] = useState<SubjectRow | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!safeCourseId) {
        setCourse(null);
        setParentSubject(null);
        setAssignments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      // 1) Course
      const courseRes = await fetchCourseById(safeCourseId);

      if (!mounted) return;

      if (courseRes.error) {
        setErrorMsg(courseRes.error.message);
        setCourse(null);
        setParentSubject(null);
        setAssignments([]);
        setLoading(false);
        return;
      }

      const c = courseRes.data as CourseRow;
      setCourse(c);

      // 2) Parent subject name (for "Back to <subject>" button)
      const subjRes = await supabase
        .from("subjects")
        .select("id,name")
        .eq("id", c.subject_id)
        .single();

      if (!mounted) return;

      if (subjRes.error) {
        // Not fatal — we can still render the page
        setParentSubject({ id: c.subject_id, name: "Subject" });
      } else {
        setParentSubject(subjRes.data as SubjectRow);
      }

      // 3) Assignments
      const assignRes = await fetchAssignmentsByCourse(safeCourseId);

      if (!mounted) return;

      if (assignRes.error) {
        setErrorMsg(assignRes.error.message);
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments((assignRes.data ?? []) as AssignmentRow[]);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [safeCourseId]);

  // Not found state
  if (!loading && !course) {
    return (
      <div className="container mx-auto px-8 py-16 text-center">
        <h2 className="mb-4">Course Not Found</h2>
        {errorMsg && (
          <p className="text-muted-foreground mb-6 text-sm">{errorMsg}</p>
        )}
        <Button onClick={() => navigate("/academic-work")}>
          Back to Academic Work
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="container mx-auto px-8 py-16">
        <Button
          variant="ghost"
          onClick={() =>
            navigate(
              parentSubject?.id ? `/subject/${parentSubject.id}` : "/academic-work",
            )
          }
          className="mb-8"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {parentSubject?.name ?? "Subjects"}
        </Button>

        {/* Error banner */}
        {errorMsg && (
          <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            Failed to load content: {errorMsg}
          </div>
        )}

        {/* Course Header */}
        <div className="mb-12">
          <h1 className="mb-4">{course?.name ?? ""}</h1>
          {course?.description && (
            <p className="text-muted-foreground text-lg mb-6">
              {course.description}
            </p>
          )}
        </div>

        <h2 className="mb-8">Assignments</h2>

        {loading ? (
          <div className="text-muted-foreground">Loading assignments…</div>
        ) : assignments.length === 0 ? (
          <Card className="col-span-12">
            <CardContent className="py-12 text-center text-muted-foreground">
              No assignments available for this course yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {assignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="col-span-12 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription className="text-base">
                    {assignment.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {assignment.github_link ? (
                    <Button asChild variant="outline">
                      <a
                        href={assignment.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        View on GitHub
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      GitHub link not added yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
