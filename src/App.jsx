import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Terminal,
  Database,
  Cpu,
  Layers,
  ArrowUp,
  CheckCircle,
  FileText,
  Users,
  Server,
  ShieldCheck,
  Workflow,
  Code
} from 'lucide-react'

// Brand Icons
const Github = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const Linkedin = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

import spImg from './assets/sp.png'
import projectDevflow from './assets/project_devflow.png'
import projectQuantum from './assets/project_quantum.png'
import projectApex from './assets/project_apex.png'

function App() {
  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Active Section State (for Scrollspy)
  const [activeSection, setActiveSection] = useState('home')

  // Scrolled Navbar State
  const [isScrolled, setIsScrolled] = useState(false)

  // Skill Filtering State
  const [selectedSkillTab, setSelectedSkillTab] = useState('all')

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [isFormSuccess, setIsFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  // Subtitle Role Typing Effect
  const roles = [
    'Technical Lead',
    'Full Stack Developer',
    'MERN & Laravel Specialist',
    'System Architect'
  ]
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Scroll Actions Effect (Navbar Scrolled class & Scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      const sections = ['home', 'about', 'experience', 'skills', 'services', 'projects', 'resume', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Character Typing Effect Logic
  useEffect(() => {
    let timer
    const role = roles[currentRoleIndex]
    const typingSpeed = isDeleting ? 40 : 100

    if (!isDeleting && currentText === role) {
      timer = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false)
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length)
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting ? role.substring(0, prev.length - 1) : role.substring(0, prev.length + 1)
        )
      }, typingSpeed)
    }

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentRoleIndex])

  // Form Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setIsFormSubmitting(true)
    setFormError('')
    setIsFormSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsFormSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setFormError(result.error || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error('Contact submission error:', err)
      setFormError('Could not establish connection with database server. Please try again.')
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // Navigation Links array
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' }
  ]

  // Skills Dataset Categorized
  const skillsData = [
    // Frontend
    { name: 'React.js', category: 'frontend', icon: Cpu },
    { name: 'JavaScript', category: 'frontend', icon: Terminal },
    { name: 'HTML5', category: 'frontend', icon: Layers },
    { name: 'CSS3', category: 'frontend', icon: Layers },
    { name: 'Bootstrap', category: 'frontend', icon: Layers },
    { name: 'Tailwind CSS', category: 'frontend', icon: Layers },
    { name: 'Responsive Web Design', category: 'frontend', icon: Layers },
    // Backend
    { name: 'Node.js', category: 'backend', icon: Terminal },
    { name: 'Express.js', category: 'backend', icon: Terminal },
    { name: 'PHP', category: 'backend', icon: Database },
    { name: 'Laravel', category: 'backend', icon: Database },
    { name: 'REST APIs', category: 'backend', icon: Terminal },
    { name: 'API Development', category: 'backend', icon: Terminal },
    // Database
    { name: 'MongoDB', category: 'database', icon: Database },
    { name: 'MySQL', category: 'database', icon: Database },
    { name: 'Database Design', category: 'database', icon: Database },
    // DevOps & Tools
    { name: 'Git', category: 'devops & tools', icon: Layers },
    { name: 'GitHub', category: 'devops & tools', icon: Layers },
    { name: 'Docker', category: 'devops & tools', icon: Cpu },
    { name: 'Linux', category: 'devops & tools', icon: Server },
    { name: 'Apache', category: 'devops & tools', icon: Server },
    { name: 'PM2', category: 'devops & tools', icon: Server },
    { name: 'CI/CD', category: 'devops & tools', icon: Layers },
    // Development
    { name: 'Full-Stack Development', category: 'development', icon: Code },
    { name: 'Web Application Development', category: 'development', icon: Code },
    { name: 'Software Development', category: 'development', icon: Code },
    { name: 'Authentication', category: 'development', icon: ShieldCheck },
    { name: 'CRUD', category: 'development', icon: Code },
    { name: 'Agile Development', category: 'development', icon: Workflow },
    // Leadership
    { name: 'Technical Leadership', category: 'leadership', icon: Users },
    { name: 'Team Leadership', category: 'leadership', icon: Users },
    { name: 'Mentoring', category: 'leadership', icon: Users },
    { name: 'Code Review', category: 'leadership', icon: ShieldCheck },
    { name: 'Project Coordination', category: 'leadership', icon: Workflow },
    { name: 'Problem Solving', category: 'leadership', icon: Workflow }
  ]

  // Filter skills based on active tab selection
  const filteredSkills =
    selectedSkillTab === 'all'
      ? skillsData
      : skillsData.filter((skill) => skill.category === selectedSkillTab)

  // Experience Dataset
  const experienceData = [
    {
      title: 'Technical Lead',
      company: 'Nandha InfoTech',
      location: 'Coimbatore, Tamil Nadu, India',
      period: 'August 2026 – Present',
      employment: 'Full-time',
      isCurrent: true,
      description: [
        'Lead the design, development, and delivery of scalable web applications.',
        'Work hands-on across frontend, backend, database, API, and deployment layers.',
        'Guide developers and interns through technical implementation, code reviews, and problem solving.',
        'Participate in application architecture, database design, API design, and technology decisions.',
        'Assign and track development tasks while supporting project delivery and technical quality.',
        'Collaborate with stakeholders to understand requirements and translate business needs into software solutions.',
        'Support production deployment, troubleshooting, server management, and application maintenance.',
        'Promote clean code, reusable components, documentation, testing, and maintainable development practices.'
      ],
      technologies: [
        'React.js', 'Node.js', 'Express.js', 'Laravel', 'PHP', 'MongoDB',
        'MySQL', 'JavaScript', 'REST APIs', 'Git', 'Docker', 'Linux', 'PM2', 'Apache'
      ]
    },
    {
      title: 'Application Developer',
      company: 'Nandha InfoTech',
      location: 'Coimbatore, Tamil Nadu, India',
      period: 'June 2024 – July 2026',
      employment: 'Full-time',
      isCurrent: false,
      description: [
        'Developed and maintained web applications using PHP, Laravel, React.js, Node.js, Express.js, MongoDB, and MySQL.',
        'Developed RESTful APIs and integrated frontend applications with backend services.',
        'Built responsive and user-friendly interfaces using React.js, HTML5, CSS3, Bootstrap, and JavaScript.',
        'Developed full-stack MERN applications with database integration and authentication.',
        'Designed and maintained MySQL and MongoDB databases.',
        'Implemented CRUD operations, business logic, API integrations, and application features.',
        'Debugged production issues, fixed application bugs, and improved existing functionality.',
        'Used Git and GitHub for version control and collaborative development.',
        'Participated in deployment, server maintenance, and production support.'
      ],
      technologies: [
        'PHP', 'Laravel', 'React.js', 'Node.js', 'Express.js', 'MongoDB',
        'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Git', 'REST APIs'
      ]
    },
    {
      title: 'Application Developer Intern',
      company: 'Nandha InfoTech',
      location: 'Coimbatore, Tamil Nadu, India',
      period: 'January 2024 – May 2024',
      employment: 'Internship',
      isCurrent: false,
      description: [
        'Gained hands-on experience in professional web application development.',
        'Worked with PHP, Laravel, MySQL, HTML5, CSS3, Bootstrap, and JavaScript.',
        'Assisted in developing and maintaining web application features.',
        'Developed CRUD functionality and database-driven application modules.',
        'Built responsive web pages using HTML, CSS, Bootstrap, and JavaScript.',
        'Used Git for source control and collaborated with the development team.',
        'Debugged issues, tested application functionality, and improved existing features.',
        'Developed a strong foundation in backend development, database management, and full-stack web development.'
      ],
      technologies: [
        'PHP', 'Laravel', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Git'
      ]
    }
  ]

  // Services Dataset
  const servicesData = [
    {
      title: 'Full-Stack Development',
      desc: 'Building complete web applications across frontend, backend, APIs, databases, and business logic.',
      icon: Code
    },
    {
      title: 'Backend & API Development',
      desc: 'Designing RESTful APIs, backend services, authentication, and application business logic.',
      icon: Database
    },
    {
      title: 'Enterprise Web Applications',
      desc: 'Developing business-focused applications such as ERP, CRM, inventory, e-commerce, and management systems.',
      icon: Briefcase
    },
    {
      title: 'Technical Leadership',
      desc: 'Guiding developers, reviewing implementations, solving technical problems, and supporting project delivery.',
      icon: Users
    },
    {
      title: 'Deployment & Production Support',
      desc: 'Deploying, maintaining, troubleshooting, and supporting applications in Linux-based production environments.',
      icon: Server
    }
  ]

  // Projects Dataset
  const projectsData = [
    {
      title: 'DevFlow (E-Commerce & Referral System)',
      shortDesc: 'Full-stack web application designed to streamline business operations through centralized data management and workflow automation.',
      purpose: 'An e-commerce platform integrated with a multi-level referral tracking and commission distribution system.',
      contribution: 'Led full-stack architecture, engineered secure cart workflows, API integrations, and referral tracking logic.',
      keyFeatures: [
        'Multi-level commission calculation and referral tracking',
        'Centralized product catalog and dynamic shopping cart',
        'Secure payment and transaction processing',
        'User and partner portal dashboard'
      ],
      image: projectDevflow,
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
      github: 'https://github.com/sivaprasathdev-sd/devflow-ecommerce-mlm'
    },
    {
      title: 'Project Quantum (Inventory Management System)',
      shortDesc: 'Enterprise-ready inventory and supply chain tracking system with granular permissions.',
      purpose: 'Centralized inventory tracking application with Role-Based Access Control (RBAC) and automated notifications.',
      contribution: 'Designed MySQL database schema, implemented Laravel backend REST APIs, RBAC modules, and Docker containerization.',
      keyFeatures: [
        'Role-Based Access Control (RBAC) for admins and operators',
        'Automated inventory notification alerts and stock metrics',
        'Product category and order fulfillment tracking',
        'Containerized deployment using Docker'
      ],
      image: projectQuantum,
      tech: ['PHP', 'Laravel', 'MySQL', 'Docker', 'Bootstrap', 'REST APIs'],
      github: 'https://github.com/sivaprasathdev-sd/project-quantum'
    },
    {
      title: 'Project Apex (Developer API Testing Platform)',
      shortDesc: 'Real-time API testing platform and developer dashboard for validation workflows.',
      purpose: 'Simplifies API endpoint verification and pipeline status monitoring for engineering teams.',
      contribution: 'Built interactive React dashboard interface, Supabase integration, and GitHub Actions CI/CD workflows.',
      keyFeatures: [
        'Real-time API endpoint testing and status validation',
        'Automated pipeline integration with GitHub Actions',
        'Visual response metric graphs and error logging',
        'Supabase backend integration for test suite storage'
      ],
      image: projectApex,
      tech: ['React.js', 'Supabase', 'GitHub Actions', 'Postman', 'JavaScript'],
      github: 'https://github.com/sivaprasathdev-sd/project_apex'
    }
  ]

  return (
    <>
      {/* Subtle Background Glow */}
      <div className="glow-bg" aria-hidden="true">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Navigation Header Bar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#home" className="nav-logo" id="logo-anchor">
            <span>SIVAPRASATH</span>
            <span className="text-gradient-primary">S S</span>
          </a>

          {/* Desktop Nav Items */}
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-btn"
              aria-label="Toggle navigation menu"
              id="mobile-menu-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-welcome">
              <span className="badge">Technical Lead @ Nandha InfoTech</span>
            </div>
            <h1 className="hero-title">Technical Lead & Full Stack Developer</h1>
            <div className="hero-subtitle">
              <span>Specializing in </span>
              <span className="text-gradient-primary">{currentText}</span>
              <span className="cursor-blink">|</span>
            </div>
            <p className="hero-desc">
              Building scalable, reliable, and user-focused web applications using MERN Stack, Laravel, PHP, and modern web technologies.
            </p>
            <p className="about-paragraph" style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '32px' }}>
              Design. Develop. Lead. Deliver.
            </p>
            <div className="hero-ctas">
              <a href="#projects" className="btn-primary">
                View My Work <ExternalLink size={18} />
              </a>
              <a href="#contact" className="btn-secondary">
                Let's Connect
              </a>
            </div>

            <div className="hero-socials">
              <span className="hero-social-label">Connect:</span>
              <div className="hero-social-links">
                <a
                  href="https://www.linkedin.com/in/sivaprasath-s-s/"
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-btn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/sivaprasath-s-s"
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-btn"
                  aria-label="GitHub Profile"
                >
                  <Github size={18} />
                </a>
                <a
                  href="mailto:sivaprasath.dev@gmail.com"
                  className="hero-social-btn"
                  aria-label="Email Sivaprasath"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="photo-wrapper">
              <div className="photo-inner">
                <img
                  src={spImg}
                  alt="Sivaprasath S S profile photo"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'
                  }}
                />
              </div>
              <div className="tech-badge-float tech-badge-1">
                <Cpu size={16} style={{ color: 'var(--color-primary)' }} /> Technical Lead
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section container">
        <div className="section-header">
          <span className="section-subtitle">About Me</span>
          <h2 className="section-title">Professional Background</h2>
        </div>

        <div className="about-grid">
          <div className="about-intro-container">
            <h3 className="about-text-title">
              Engineering <span className="text-gradient-primary">Maintainable Software</span> & Leading Teams
            </h3>
            <p className="about-paragraph">
              I am a Technical Lead and Full Stack Developer at Nandha InfoTech, focused on designing, developing, and delivering scalable web applications that solve real-world business problems.
            </p>
            <p className="about-paragraph">
              My experience spans both MERN Stack and Laravel/PHP ecosystems, with hands-on expertise in React.js, Node.js, Express.js, PHP, Laravel, MongoDB, MySQL, REST APIs, Git, Docker, and Linux-based application deployment.
            </p>
            <p className="about-paragraph">
              Alongside development, I take ownership of technical implementation, guide developers and interns, participate in architecture and database decisions, review code, coordinate project activities, and support production deployments.
            </p>
            <p className="about-paragraph">
              I enjoy turning business requirements into maintainable software, improving application performance, and continuously exploring modern technologies that help teams build better products.
            </p>

            {/* Key Quick Highlights */}
            <div className="about-stats">
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">Lead</span>
                <span className="stat-label">Technical Leadership</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">Full Stack</span>
                <span className="stat-label">MERN + Laravel/PHP</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">Docker</span>
                <span className="stat-label">Linux Deployments</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">REST APIs</span>
                <span className="stat-label">Clean DB Design</span>
              </div>
            </div>
          </div>

          <div className="about-cards">
            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Users size={22} />
              </div>
              <div className="feature-info">
                <h3>Technical Ownership & Leadership</h3>
                <p>
                  Guiding developers and interns, performing thorough code reviews, planning application architecture, and coordinating delivery.
                </p>
              </div>
            </div>

            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Database size={22} />
              </div>
              <div className="feature-info">
                <h3>Full Stack Architecture</h3>
                <p>
                  Designing robust web applications using React.js on the frontend, Express/Node.js or PHP/Laravel on the backend, and MySQL/MongoDB for storage.
                </p>
              </div>
            </div>

            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Server size={22} />
              </div>
              <div className="feature-info">
                <h3>Deployment & Production Support</h3>
                <p>
                  Containerizing apps with Docker, setting up Linux servers, managing PM2/Apache configurations, and troubleshooting live production systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience / Career Section */}
      <section id="experience" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Career Path</span>
          <h2 className="section-title">Professional Experience</h2>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {experienceData.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card glass">
                <div className="timeline-meta">
                  <div className="timeline-role-org">
                    <h3>{exp.title}</h3>
                    <span className="timeline-org">{exp.company}</span>
                  </div>
                  <div className="timeline-time-loc">
                    <span className="timeline-time">{exp.period}</span>
                    <span className="timeline-loc">{exp.location} • {exp.employment}</span>
                  </div>
                </div>

                <ul className="timeline-desc">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>

                <div className="project-tech" style={{ marginTop: '20px', marginBottom: 0 }}>
                  {exp.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorized Skills Section */}
      <section id="skills" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Skills & Expertise</span>
          <h2 className="section-title">Technical Competencies</h2>
        </div>

        {/* Skill Category Filtering Tabs */}
        <div className="skills-nav">
          {['all', 'frontend', 'backend', 'database', 'devops & tools', 'development', 'leadership'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSkillTab(cat)}
              className={`skill-tab-btn ${selectedSkillTab === cat ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'All Skills' : cat}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill, index) => {
            const IconComponent = skill.icon
            return (
              <div key={index} className="skill-card glass">
                <div className="skill-card-header">
                  <div className="skill-icon-wrap">
                    <IconComponent size={20} />
                  </div>
                  <span className="skill-title">{skill.name}</span>
                </div>
                <div style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Category: {skill.category}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Services / What I Do Section */}
      <section id="services" className="section container">
        <div className="section-header">
          <span className="section-subtitle">What I Do</span>
          <h2 className="section-title">Core Professional Services</h2>
        </div>

        <div className="projects-grid">
          {servicesData.map((service, index) => {
            const IconComp = service.icon
            return (
              <div key={index} className="glass" style={{ padding: '32px' }}>
                <div className="feature-icon-box" style={{ marginBottom: '20px' }}>
                  <IconComp size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{service.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section id="projects" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Selected Work</span>
          <h2 className="section-title">Featured Projects</h2>
        </div>

        <div className="projects-grid">
          {projectsData.map((project, idx) => (
            <article key={idx} className="project-card glass">
              <div className="project-image-box">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-body">
                <div className="project-title">
                  <h3>{project.title}</h3>
                </div>
                
                <p className="project-desc" style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {project.shortDesc}
                </p>

                <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Purpose / Problem:</strong> {project.purpose}
                </div>

                <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>My Contribution:</strong> {project.contribution}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                    Key Features:
                  </strong>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {project.keyFeatures.map((feat, fIdx) => (
                      <li key={fIdx} style={{ marginBottom: '4px' }}>{feat}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-tech">
                  {project.tech.map((pill, i) => (
                    <span key={i} className="tech-pill">
                      {pill}
                    </span>
                  ))}
                </div>

                {project.github && (
                  <div className="project-links">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link-btn"
                    >
                      <Github size={16} /> GitHub Repository
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Resume</span>
          <h2 className="section-title">Professional Qualifications</h2>
        </div>

        <div className="resume-section-wrapper">
          <div className="resume-header-bar">
            <div className="resume-info-summary">
              <h3>Curriculum Vitae</h3>
              <p>Sivaprasath S S — Technical Lead & Full Stack Developer credentials</p>
            </div>
            <a
              href="/Sivaprasath_SS_Resume.pdf"
              download="Sivaprasath_SS_Resume.pdf"
              className="btn-primary"
              id="resume-download-btn"
            >
              <Download size={18} /> Download Resume
            </a>
          </div>

          <div className="resume-viewer-container glass">
            <iframe
              src="/Sivaprasath_SS_Resume.pdf#toolbar=0"
              title="Sivaprasath S S Resume Document"
              className="resume-iframe"
            ></iframe>
          </div>

          <div className="resume-mobile-card glass">
            <div className="resume-mobile-icon-wrap">
              <FileText size={40} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h4>Resume Document</h4>
            <p>
              Download or preview Sivaprasath's professional experience, technical qualifications, and career background.
            </p>
            <div className="resume-mobile-actions">
              <a
                href="/Sivaprasath_SS_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={16} /> View PDF
              </a>
              <a
                href="/Sivaprasath_SS_Resume.pdf"
                download="Sivaprasath_SS_Resume.pdf"
                className="btn-primary"
              >
                <Download size={16} /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Contact</span>
          <h2 className="section-title">Let's Build Something Great</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            <div className="contact-intro">
              <h3>Get In Touch</h3>
              <p>
                I'm open to connecting with professionals, teams, and organizations working on interesting software products and technology initiatives.
              </p>
            </div>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-item-content">
                  <span>Email</span>
                  <a href="mailto:sivaprasath.dev@gmail.com">sivaprasath.dev@gmail.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <Linkedin size={20} />
                </div>
                <div className="contact-item-content">
                  <span>LinkedIn</span>
                  <a href="https://www.linkedin.com/in/sivaprasath-s-s/" target="_blank" rel="noreferrer">
                    sivaprasath-s-s
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <Github size={20} />
                </div>
                <div className="contact-item-content">
                  <span>GitHub</span>
                  <a href="https://github.com/sivaprasath-s-s" target="_blank" rel="noreferrer">
                    sivaprasath-s-s
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-item-content">
                  <span>Location</span>
                  <p>Coimbatore, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card glass">
            <form onSubmit={handleFormSubmit} id="direct-contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name-input">Your Name *</label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email-input">Your Email *</label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject-input">Subject</label>
                <input
                  type="text"
                  id="subject-input"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Topic of discussion"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message-input">Your Message *</label>
                <textarea
                  id="message-input"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <div className="submit-btn-wrap">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isFormSubmitting}
                  id="form-submit-action-btn"
                >
                  {isFormSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>

              {isFormSuccess && (
                <div className="submit-success-msg">
                  <CheckCircle size={20} />
                  <span>Success! Your message has been sent. Sivaprasath will respond shortly.</span>
                </div>
              )}

              {formError && (
                <div className="submit-success-msg" style={{ color: '#e11d48' }}>
                  <X size={20} />
                  <span>{formError}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <span>SIVAPRASATH </span>
            <span className="text-gradient-primary">S S</span>
          </div>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Sivaprasath S S. All rights reserved.
          </span>
          <a
            href="#home"
            className="scroll-top-btn"
            aria-label="Scroll back to top"
            id="back-to-top-anchor"
          >
            <ArrowUp size={20} />
          </a>
        </div>
      </footer>
    </>
  )
}

export default App
