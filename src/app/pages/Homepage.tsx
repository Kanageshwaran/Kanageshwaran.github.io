import { Link } from 'react-router-dom';
import { Download, Linkedin, Github, Handshake } from 'lucide-react';
import { subjects, activities } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import profileImage from '../../assets/profile.jpg';

const PROFILE_IMAGE = profileImage;

export function Homepage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-5">
            <img
              src={PROFILE_IMAGE}
              alt="Kanageshwaran Dhakshinamoorthy"
              className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
            />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <h1 className="mb-6">Welcome to My Academic Portfolio</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              I’m a Computer Science graduate from California State University, Sacramento, with a strong
              interest in software engineering, cybersecurity, and full-stack development. This portfolio
              highlights my academic work, technical projects, and the skills I’ve built through coursework
              and hands-on labs.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/academic-work">View Academic Work</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-8 py-16">
        <div className="max-w-4xl">
          <h2 className="mb-6">About Me</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            My interests include secure application development, databases, networking, and building modern
            web/mobile applications. I enjoy turning ideas into clean, reliable software and learning by
            implementing real solutions—from APIs and UI features to security testing and debugging.
          </p>
          <p className="text-muted-foreground mb-8 text-lg">
            Beyond classes, I work on team-based projects and technical labs that strengthen my fundamentals
            in system design, problem-solving, and writing clear documentation. I’m actively preparing for the
            next step in my career and looking for opportunities where I can grow as a developer.
          </p>

          <Button variant="outline" asChild>
            <a href="/resume.pdf" download>
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </a>
          </Button>
        </div>
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-8 py-8">
        <div className="flex gap-6 justify-center">
          <a
            href="https://linkedin.com/in/dkanageshwaran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-6 h-6" />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/Kanageshwaran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-6 h-6" />
            <span>GitHub</span>
          </a>

          <a
            href="https://joinhandshake.com/profile/your-handshake-id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Handshake Profile"
          >
            <Handshake className="w-6 h-6" />
            <span>Handshake</span>
          </a>
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
                <div className="text-4xl mb-2">{subject.icon}</div>
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
        </div>
      </section>

      {/* Other Activities */}
      <section className="container mx-auto px-8 py-16">
        <h2 className="mb-8">Other Activities</h2>

        <div className="grid grid-cols-12 gap-6">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="col-span-12 md:col-span-6 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            I’m open to internships, full-time roles, and project collaborations. Feel free to reach out.
          </p>
          <Button asChild size="lg">
            <a href="mailto:kdhakshinamoorthy@csus.edu">Send Email</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
