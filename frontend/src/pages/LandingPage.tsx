import { Link } from "react-router-dom";

const previewTasks = [
  { title: "Finalize the product brief", detail: "Today · 10:30 AM", priority: "High", done: true },
  { title: "Review sprint feedback", detail: "Today · 1:00 PM", priority: "Medium", done: false },
  { title: "Share updates with the team", detail: "Today · 3:30 PM", priority: "Low", done: false },
];

function PulseFlowMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="9" fill="currentColor" />
        <path d="m8.5 16.3 4.7 4.6 10.3-10.1" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" fill="currentColor" />
      <path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" fill="currentColor" />
    </svg>
  );
}

function TaskBoardPreview() {
  return (
    <div className="preview-wrap" aria-label="Preview of a PulseFlow personal task board">
      <div className="preview-glow" />
      <div className="floating-chip floating-chip--ai">
        <span className="floating-chip__icon"><SparkleIcon /></span>
        <span><strong>AI plan ready</strong><small>3 tasks prioritized</small></span>
      </div>
      <div className="floating-chip floating-chip--focus">
        <span className="focus-dot" />
        <span><strong>Focus time</strong><small>1h 25m protected</small></span>
      </div>

      <div className="task-preview">
        <aside className="task-preview__sidebar">
          <div className="task-preview__brand"><PulseFlowMark /><span>PulseFlow</span></div>
          <div className="preview-nav preview-nav--active"><span className="preview-nav__icon">◷</span> My day</div>
          <div className="preview-nav"><span className="preview-nav__icon">▤</span> My tasks</div>
          <div className="preview-nav"><span className="preview-nav__icon">♧</span> Groups</div>
          <div className="preview-sidebar-label">WORKSPACE</div>
          <div className="preview-project"><span className="project-dot project-dot--blue" /> Product launch</div>
          <div className="preview-project"><span className="project-dot project-dot--violet" /> Design team</div>
        </aside>

        <div className="task-preview__main">
          <div className="preview-topbar">
            <span>Tuesday, October 24</span>
            <div className="preview-avatar">M</div>
          </div>
          <div className="preview-heading">
            <div>
              <span className="eyebrow">YOUR PERSONAL SPACE</span>
              <h2>Good morning, Minh <span aria-hidden="true">✦</span></h2>
              <p>Make today count. You&apos;ve got this.</p>
            </div>
            <div className="preview-progress"><span>DAILY PROGRESS</span><strong>2 of 5 done</strong><i><b /></i></div>
          </div>

          <div className="preview-focus-card">
            <span className="focus-card-icon"><SparkleIcon /></span>
            <div><strong>Your day, in focus</strong><p>A balanced plan is ready based on your priorities.</p></div>
            <span className="preview-focus-link">View plan <ArrowIcon /></span>
          </div>

          <div className="preview-task-heading"><strong>Today&apos;s tasks</strong><span>+ Add task</span></div>
          <div className="preview-tasks">
            {previewTasks.map((task) => (
              <div className="preview-task" key={task.title}>
                <span className={`task-check${task.done ? " task-check--done" : ""}`}>{task.done ? "✓" : ""}</span>
                <span className="preview-task__copy"><strong className={task.done ? "is-done" : ""}>{task.title}</strong><small>{task.detail}</small></span>
                <span className={`priority priority--${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    number: "01",
    icon: "◷",
    title: "A clearer personal day",
    description: "Bring your tasks, deadlines, and priorities into one calm, focused view.",
    tone: "blue",
  },
  {
    number: "02",
    icon: "♧",
    title: "Better work, together",
    description: "Keep group work organized with shared spaces for teams and projects.",
    tone: "violet",
  },
  {
    number: "03",
    icon: "✦",
    title: "Priorities that make sense",
    description: "Use AI-assisted sorting to find a sensible order for the work ahead.",
    tone: "mint",
  },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="PulseFlow home">
          <PulseFlowMark />
          <span>PulseFlow</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="site-header__actions">
          <Link className="sign-in-link" to="/login">Sign in</Link>
          <Link className="button button--small button--primary" to="/login">
            Get started <ArrowIcon />
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-sparkle"><SparkleIcon /></span> YOUR WORK, IN A BETTER RHYTHM</div>
          <h1>Make space for the work that <span>moves you forward.</span></h1>
          <p className="hero-description">
            Plan your day, keep your team in sync, and find your next priority — all in one thoughtful workspace.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/login">Start with Google <ArrowIcon /></Link>
            <a className="text-link" href="#features">Explore PulseFlow <span>↓</span></a>
          </div>
          <div className="hero-note">
            <span className="avatar-stack" aria-hidden="true"><i>M</i><i>A</i><i>J</i></span>
            <span>A calmer way to get things done.</span>
          </div>
        </div>

        <TaskBoardPreview />
        <span className="hero-decoration hero-decoration--one" aria-hidden="true" />
        <span className="hero-decoration hero-decoration--two" aria-hidden="true" />
      </section>

      <section className="trust-strip" aria-label="PulseFlow workspace modes">
        <span>MADE FOR THE WAY YOU WORK</span>
        <div><span className="trust-icon">◷</span> Personal focus</div>
        <div><span className="trust-icon">♧</span> Shared workspaces</div>
        <div><span className="trust-icon">✦</span> AI-assisted planning</div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">ONE WORKSPACE, MORE MOMENTUM</span>
          <h2>Everything in its right place.</h2>
          <p>From your own to-do list to the work you share, PulseFlow helps you keep moving with clarity.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className={`feature-card__icon feature-card__icon--${feature.tone}`} aria-hidden="true">{feature.icon}</div>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <a href="#how-it-works" aria-label={`Learn about ${feature.title}`}><ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="workflow-copy">
          <span className="eyebrow">A LITTLE LESS BUSYWORK</span>
          <h2>Get it out of your head. Get it moving.</h2>
          <p>Start with what matters today. Organize work on your own or with your group, then let a suggested priority order help you take the next step.</p>
          <Link className="button button--dark" to="/login">Find your flow <ArrowIcon /></Link>
        </div>
        <div className="workflow-steps">
          <article><span>1</span><div><h3>Capture what needs doing</h3><p>Keep tasks and plans together in one workspace.</p></div></article>
          <article><span>2</span><div><h3>Bring the right people in</h3><p>Switch between personal focus and group work.</p></div></article>
          <article><span>3</span><div><h3>Choose your next move</h3><p>Review priorities and make progress at your pace.</p></div></article>
        </div>
      </section>

      <footer className="site-footer">
        <Link className="site-brand" to="/"><PulseFlowMark /><span>PulseFlow</span></Link>
        <span>Make room for meaningful progress.</span>
        <Link to="/login">Sign in <ArrowIcon /></Link>
      </footer>
    </main>
  );
}
