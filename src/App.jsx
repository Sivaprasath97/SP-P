import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  Database,
  Cpu,
  Layers,
  ArrowUp,
  CheckCircle,
  FileText
} from 'lucide-react'

// Custom standard Lucide SVG equivalents for brand icons since they are removed from recent lucide versions
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
import spImg from './assets/sp.JPG'
import projectDevflow from './assets/project_devflow.png'
import projectQuantum from './assets/project_quantum.png'
import projectApex from './assets/project_apex.png'

function App() {
  // Theme State
  const [theme, setTheme] = useState('dark')

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
    'Application Developer',
    'Full-Stack Developer',
    'React.js & Laravel Expert',
    'Node.js Developer'
  ]
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Theme Syncing Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Scroll Actions Effect (Navbar Scrolled class & Scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      // Navbar background transition
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Scrollspy active section detection
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'resume', 'contact']
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
      // Hold complete word for 2.2 seconds before starting backspace
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

  // Form Submit Handler (Connected with MongoDB Express API)
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
        setFormError(result.error || 'Failed to transmit contact details. Please try again.')
      }
    } catch (err) {
      console.error('Contact submission error:', err)
      setFormError('Could not establish connection with database server. Please ensure it is running.')
    } finally {
      setIsFormSubmitting(false)
    }
  }

  // Toggle Theme Function
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Navigation Links array
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' }
  ]

  // Skills Dataset
  const skillsData = [
    // Frontend
    { name: 'React.js', level: '92%', category: 'frontend', icon: Cpu },
    { name: 'JavaScript (ES6+)', level: '90%', category: 'frontend', icon: Terminal },
    { name: 'HTML5 & CSS3', level: '95%', category: 'frontend', icon: Layers },
    { name: 'Bootstrap', level: '85%', category: 'frontend', icon: Layers },
    // Backend
    { name: 'Node.js & Express', level: '88%', category: 'backend', icon: Terminal },
    { name: 'PHP & Laravel', level: '85%', category: 'backend', icon: Database },
    // Databases & Tools
    { name: 'MySQL', level: '88%', category: 'databases & tools', icon: Database },
    { name: 'MongoDB', level: '85%', category: 'databases & tools', icon: Database },
    { name: 'Supabase', level: '80%', category: 'databases & tools', icon: Layers },
    { name: 'Postman & REST APIs', level: '90%', category: 'databases & tools', icon: Terminal },
    // DevOps & Cloud
    { name: 'Docker Containerization', level: '80%', category: 'devops & cloud', icon: Cpu },
    { name: 'Kubernetes (Basics)', level: '60%', category: 'devops & cloud', icon: Layers },
    { name: 'CI/CD (GitHub Actions)', level: '82%', category: 'devops & cloud', icon: Layers },
    { name: 'AWS Academy Foundations', level: '75%', category: 'devops & cloud', icon: Cpu }
  ]

  // Projects Dataset
  const projectsData = [
    {
      title: 'DevFlow (E-Commerce & Referral)',
      category: 'Full-Stack',
      image: projectDevflow,
      desc: 'An e-commerce platform integrated with a multi-level referral tracking and commission distribution system. Features complete shopping cart, catalog, and secure transactions.',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      github: 'https://github.com/sivaprasath-s-s/devflow',
      demo: '#'
    },
    {
      title: 'Project Quantum (Inventory Management)',
      category: 'Backend & DevOps',
      image: projectQuantum,
      desc: 'An enterprise inventory system featuring Role-Based Access Control (RBAC) and automated notifications. Fully containerized with Docker for robust environments.',
      tech: ['PHP Laravel', 'MySQL', 'Docker', 'Bootstrap'],
      github: 'https://github.com/sivaprasath-s-s/project-quantum',
      demo: '#'
    },
    {
      title: 'Project Apex (Developer API Testing)',
      category: 'DevOps & CI/CD',
      image: projectApex,
      desc: 'A clean developer platform and dashboard for real-time API testing and validation. Integrated with GitHub Actions pipelines for automated test execution and reports.',
      tech: ['React.js', 'Supabase', 'GitHub Actions', 'Postman'],
      github: 'https://github.com/sivaprasath-s-s/project-apex',
      demo: '#'
    }
  ]

  // Filter skills based on active tab selection
  const filteredSkills =
    selectedSkillTab === 'all'
      ? skillsData
      : skillsData.filter((skill) => skill.category === selectedSkillTab)

  return (
    <>
      {/* 1. Dynamic Background & Glow Orbs */}
      <div className="glow-bg" aria-hidden="true">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* 2. Navigation Header Bar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#home" className="nav-logo" id="logo-anchor">
            <span>SIVA</span>
            <span className="text-gradient-primary">PRASATH</span>
          </a>

          {/* Nav Items Desktop */}
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
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle display theme"
              id="theme-toggler-btn"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Navigation Menu Button */}
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

      {/* 3. Hero Showcase Section */}
      <section id="home" className="section container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-welcome">
              <span className="badge">Available for Work</span>
            </div>
            <h1 className="hero-title">Siva Prasath S S</h1>
            <div className="hero-subtitle">
              <span>I'm a </span>
              <span className="text-gradient-primary">{currentText}</span>
              <span className="cursor-blink">|</span>
            </div>
            <p className="hero-desc">
              Passionate Application Developer specializing in building high-performance, scalable web
              applications. Expert in full-stack architecture using React.js, Node.js, and PHP Laravel,
              reinforced by clean databases and containerized deployment.
            </p>
            <div className="hero-ctas">
              <a href="#projects" className="btn-primary">
                View My Projects <ExternalLink size={18} />
              </a>
              <a href="#contact" className="btn-secondary">
                Let's Talk
              </a>
            </div>

            <div className="hero-socials">
              <span className="hero-social-label">Follow Me:</span>
              <div className="hero-social-links">
                <a
                  href="https://linkedin.com/in/sivaprasath-s-s/"
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
                  aria-label="Email Siva"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="photo-wrapper">
              <div className="photo-glow"></div>
              <div className="photo-inner">
                <img
                  src={spImg}
                  alt="Siva Prasath S S profile photo"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'
                  }}
                />
              </div>
              <div className="tech-badge-float tech-badge-1">
                <Cpu size={16} className="text-gradient-primary" /> Full Stack Developer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Me Section */}
      <section id="about" className="section container">
        <div className="section-header">
          <span className="section-subtitle">About Me</span>
          <h2 className="section-title">My Background & Core Values</h2>
        </div>

        <div className="about-grid">
          <div className="about-intro-container">
            <h3 className="about-text-title">
              Driven by <span className="text-gradient-primary">Performance</span>, Committed to Quality
            </h3>
            <p className="about-paragraph">
              I am an energetic full-stack application developer based in Coimbatore, India. Armed with a
              Master of Computer Applications (MCA) and a solid grasp of modern technology, I focus on constructing
              functional, beautiful, and extremely scalable digital environments.
            </p>
            <p className="about-paragraph">
              From implementing multi-level commission structures to deploying inventory microservices
              using Docker, I thrive on analyzing complex requirements and delivering high-value products in agile
              environments.
            </p>

            {/* About Stats Grid */}
            <div className="about-stats">
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">2+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">8.0</span>
                <span className="stat-label">MCA CGPA</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">5+</span>
                <span className="stat-label">Deployments</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-number text-gradient-primary">100%</span>
                <span className="stat-label">Performance Goal</span>
              </div>
            </div>
          </div>

          <div className="about-cards">
            {/* Feature 1 */}
            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Database size={22} />
              </div>
              <div className="feature-info">
                <h3>Robust Backend Architectures</h3>
                <p>
                  Specialized in writing super-fast RESTful APIs in Node.js, Express, and PHP Laravel, implementing role-based access control and solid relational models.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Cpu size={22} />
              </div>
              <div className="feature-info">
                <h3>Responsive Frontend UIs</h3>
                <p>
                  Translating creative mockups into clean, interactive React code bases with modern styling grids, high accessibility compliance, and instant load speeds.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="about-feature-card glass">
              <div className="feature-icon-box">
                <Layers size={22} />
              </div>
              <div className="feature-info">
                <h3>Cloud Operations & DevOps</h3>
                <p>
                  Packaging, containerizing, and orchestrating nodes with Docker, structuring automated test frameworks with GitHub Actions, and organizing cloud databases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Skills Grid Section */}
      <section id="skills" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Skills & Expertise</span>
          <h2 className="section-title">My Technical Stack</h2>
        </div>

        {/* Skill Category Filtering Tabs */}
        <div className="skills-nav">
          {['all', 'frontend', 'backend', 'databases & tools', 'devops & cloud'].map((cat) => (
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
                <div className="skill-bar-wrap">
                  <div className="skill-bar-info">
                    <span>Expertise</span>
                    <span>{skill.level}</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: skill.level }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. Projects Showcase Section */}
      <section id="projects" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Selected Work</span>
          <h2 className="section-title">My Masterpieces</h2>
        </div>

        <div className="projects-grid">
          {projectsData.map((project, idx) => (
            <article key={idx} className="project-card glass">
              <div className="project-image-box">
                <img src={project.image} alt={project.title} />
                <div className="project-image-overlay">
                  <span className="project-category">{project.category}</span>
                </div>
              </div>
              <div className="project-body">
                <div className="project-title">
                  <h3>{project.title}</h3>
                </div>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  {project.tech.map((pill, i) => (
                    <span key={i} className="tech-pill">
                      {pill}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link-btn"
                  >
                    <Github size={16} /> Codebase
                  </a>
                  <a href={project.demo} className="project-link-btn">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Experience Timeline Section */}
      <section id="experience" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Career Path</span>
          <h2 className="section-title">Experience & Education</h2>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {/* Timeline Item 1 - Professional */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-card glass">
              <div className="timeline-meta">
                <div className="timeline-role-org">
                  <h3>Application Developer</h3>
                  <span className="timeline-org">Nandha Infotech</span>
                </div>
                <div className="timeline-time-loc">
                  <span className="timeline-time">June 2024 – Present</span>
                  <span className="timeline-loc">Coimbatore, India</span>
                </div>
              </div>
              <ul className="timeline-desc">
                <li>
                  Developed high-fidelity full-stack applications using React.js, Node.js, and Laravel, increasing system efficiency and overall maintainability by ~30%.
                </li>
                <li>
                  Designed, structured, and implemented a multi-level commission referral flow, boosting transaction logic processing rates.
                </li>
                <li>
                  Refactored core e-commerce modules including catalogs, shopping cart widgets, and order dispatch pipelines.
                </li>
                <li>
                  Engineered modular inventory tracking boards backed by role-based credentials (RBAC) to ensure tight security boundaries.
                </li>
                <li>
                  Wrapped modules inside Docker containers and built automated testing operations through custom GitHub Actions.
                </li>
              </ul>
            </div>
          </div>

          {/* Timeline Item 2 - Education MCA */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-card glass">
              <div className="timeline-meta">
                <div className="timeline-role-org">
                  <h3>Master of Computer Applications (MCA)</h3>
                  <span className="timeline-org">Dr. Mahalingam College of Engineering and Technology</span>
                </div>
                <div className="timeline-time-loc">
                  <span className="timeline-time">2022 – 2024</span>
                  <span className="timeline-loc">Pollachi, India</span>
                </div>
              </div>
              <ul className="timeline-desc">
                <li>Acquired deep knowledge of Advanced Software Architecture, Relational Databases (RDBMS), and Distributed Computing systems.</li>
                <li>Graduated with an excellent performance rating of 8.0 / 10 CGPA.</li>
                <li>Spearheaded academic projects showcasing complex full-stack web capabilities.</li>
              </ul>
            </div>
          </div>

          {/* Timeline Item 3 - Education CS */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-card glass">
              <div className="timeline-meta">
                <div className="timeline-role-org">
                  <h3>Bachelor of Computer Science</h3>
                  <span className="timeline-org">Sri Krishna College of Arts and Science</span>
                </div>
                <div className="timeline-time-loc">
                  <span className="timeline-time">2019 – 2022</span>
                  <span className="timeline-loc">Coimbatore, India</span>
                </div>
              </div>
              <ul className="timeline-desc">
                <li>Solidified core principles of computer programming, algorithms, data structures, and computer networks.</li>
                <li>Graduated with a cumulative academic success rate of 8.0 / 10 CGPA.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Resume Section */}
      <section id="resume" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Resume</span>
          <h2 className="section-title">Qualifications Overview</h2>
        </div>

        <div className="resume-section-wrapper">
          <div className="resume-header-bar">
            <div className="resume-info-summary">
              <h3>Curriculum Vitae</h3>
              <p>Siva Prasath S S - Application Developer credentials</p>
            </div>
            <a
              href="/SIVA_PRASATH_RESUME.pdf"
              download="Siva_Prasath_Resume.pdf"
              className="btn-primary"
              id="resume-download-btn"
            >
              <Download size={18} /> Download Resume PDF
            </a>
          </div>

          <div className="resume-viewer-container glass">
            {/* Native iframe view of PDF with interactive fallback if not supported */}
            <iframe
              src="/SIVA_PRASATH_RESUME.pdf#toolbar=0"
              title="Siva Prasath S S Resume Document"
              className="resume-iframe"
              onError={(e) => {
                console.log('PDF loading error. Rendering interactive fallback widget.', e)
              }}
            >
              <div className="resume-fallback">
                <div className="resume-fallback-icon">
                  <FileText size={42} />
                </div>
                <h4>Resume Preview Not Available</h4>
                <p>
                  Your browser does not support inline PDF previews. Please click the button below to retrieve the copy directly on your storage drive.
                </p>
                <a
                  href="/SIVA_PRASATH_RESUME.pdf"
                  download="Siva_Prasath_Resume.pdf"
                  className="btn-primary"
                >
                  <Download size={16} /> Grab Resume
                </a>
              </div>
            </iframe>
          </div>
        </div>
      </section>

      {/* 9. Contact Section */}
      <section id="contact" className="section container">
        <div className="section-header">
          <span className="section-subtitle">Contact Me</span>
          <h2 className="section-title">Let's Establish a Connection</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            <div className="contact-intro">
              <h3>Get In Touch</h3>
              <p>
                Have an exciting project idea, a position to fill, or simply want to chat about scalable backend pipelines? Feel free to reach out using the form or direct coordinates below!
              </p>
            </div>

            <div className="contact-details">
              {/* Phone item */}
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-item-content">
                  <span>Call / Text</span>
                  <a href="tel:+917548814113">+91 7548814113</a>
                </div>
              </div>

              {/* Email item */}
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-item-content">
                  <span>Direct Mail</span>
                  <a href="mailto:sivaprasath.dev@gmail.com">sivaprasath.dev@gmail.com</a>
                </div>
              </div>

              {/* Location item */}
              <div className="contact-item">
                <div className="contact-item-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-item-content">
                  <span>Base Location</span>
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
                  placeholder="Write your details here..."
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
                  {isFormSubmitting ? 'Sending Message...' : 'Transmit Message'}
                </button>
              </div>

              {/* Form Success Toast Display */}
              {isFormSuccess && (
                <div className="submit-success-msg">
                  <CheckCircle size={20} />
                  <span>Success! Your message was recorded in the database. Siva will respond shortly.</span>
                </div>
              )}

              {/* Form Error Toast Display */}
              {formError && (
                <div className="submit-success-msg" style={{ color: '#f43f5e' }}>
                  <X size={20} />
                  <span>{formError}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <span>SIVA </span>
            <span className="text-gradient-primary">PRASATH</span>
          </div>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Siva Prasath S S. All rights reserved.
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
