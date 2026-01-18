-- PROFILE (1 row)
insert into
    public.profile (
        full_name,
        hero_title,
        hero_description,
        about_title,
        about_paragraph_1,
        about_paragraph_2,
        email,
        resume_url
    )
values (
        'Kanageshwaran Dhakshinamoorthy',
        'Welcome to My Academic Portfolio',
        'This portfolio showcases my academic journey, projects, and skills.',
        'About Me',
        'I am a Computer Science graduate from California State University, Sacramento.',
        'I enjoy building web apps, working on security labs, and exploring AI/ML.',
        'your-email@example.com',
        '/resume.pdf'
    );

-- SOCIAL LINKS
insert into
    public.social_links (label, url, icon, sort_order)
values (
        'LinkedIn',
        'https://linkedin.com/in/YOUR_USERNAME',
        'linkedin',
        1
    ),
    (
        'GitHub',
        'https://github.com/YOUR_USERNAME',
        'github',
        2
    ),
    (
        'Handshake',
        'https://handshake.com/YOUR_USERNAME',
        'handshake',
        3
    );

-- SUBJECTS
insert into
    public.subjects (
        id,
        name,
        description,
        icon,
        sort_order
    )
values (
        'csc',
        'Computer Science',
        'CS coursework, labs, and projects',
        '💻',
        1
    ),
    (
        'math',
        'Mathematics',
        'Math foundations and problem solving',
        '📐',
        2
    );

-- COURSES
insert into
    public.courses (
        id,
        subject_id,
        name,
        term,
        description,
        sort_order
    )
values (
        'csc193a',
        'csc',
        'CSC 193A Web Programming',
        'Fall 2025',
        'Web development projects',
        1
    );

-- COURSE TOOLS
insert into
    public.course_tools (course_id, tool, sort_order)
values ('csc193a', 'React', 1),
    ('csc193a', 'TypeScript', 2),
    ('csc193a', 'Supabase', 3);

-- ASSIGNMENTS
insert into
    public.assignments (
        course_id,
        title,
        description,
        assignment_type,
        github_url,
        sort_order
    )
values (
        'csc193a',
        'Portfolio Website',
        'Academic portfolio built with React and Supabase',
        'Project',
        'https://github.com/YOUR_USERNAME/YOUR_REPO',
        1
    );

-- ACTIVITIES
insert into
    public.activities (
        title,
        description,
        sort_order
    )
values (
        'Photography',
        'Digital photography projects and editing work',
        1
    );