import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  const isExactActive = (path: string) => location.pathname === path;

  const isAcademicActive =
    location.pathname === "/academic-work" ||
    location.pathname.startsWith("/subject") ||
    location.pathname.startsWith("/course");

  const isActivitiesActive =
    location.pathname === "/activities" ||
    location.pathname.startsWith("/activities/");

  const isAboutActive = location.pathname === "/about";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand → Landing page */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <span className="text-xl">Kanageshwaran Dhakshinamoorthy</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            {/* About (separate page now) */}
            <Link
              to="/about"
              className={`transition-opacity hover:opacity-80 ${
                isAboutActive ? "opacity-100" : "opacity-60"
              }`}
            >
              About
            </Link>

            <Link
              to="/academic-work"
              className={`transition-opacity hover:opacity-80 ${
                isAcademicActive ? "opacity-100" : "opacity-60"
              }`}
            >
              Academic Work
            </Link>

            {/* Activities */}
            <Link
              to="/activities"
              className={`transition-opacity hover:opacity-80 ${
                isActivitiesActive ? "opacity-100" : "opacity-60"
              }`}
            >
              Activities
            </Link>

            <Link
              to="/contact"
              className={`transition-opacity hover:opacity-80 ${
                isExactActive("/contact") ? "opacity-100" : "opacity-60"
              }`}
            >
              Contact
            </Link>

            <Link
              to="/settings"
              className={`transition-opacity hover:opacity-80 ${
                isExactActive("/settings") ? "opacity-100" : "opacity-60"
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
