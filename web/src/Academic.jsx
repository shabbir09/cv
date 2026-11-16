import data from './content.json';
import { range, fmtPhone, Downloads } from './App.jsx';

/* ---------- data selection: academic variant only, straight from content.yaml ---------- */
const on = (e) => (e.show_on || []).includes('academic');
const P = data.personal;
const education = data.education.filter(on);
const experience = data.experience.filter(on);
const research = data.research.filter(on);
const publications = data.publications.filter(on);
const skills = data.skills.filter(on);
const coursework = data.coursework.filter(on);
const awards = data.awards.filter(on);

const LINKEDIN_URL = `linkedin.com/in/${P.linkedin}`;
const GITHUB_URL = `github.com/${P.github}`;
const TOTAL_PAGES = 2;

/* ---------- Scholar components ---------- */
function ASectionTitle({ children }) {
  return <h2 className="a-sec-title">{children}</h2>;
}

function AContact() {
  return (
    <div className="contact a-contact">
      <span>{P.location}</span>
      <span>{P.email}</span>
      <span>{fmtPhone(P.phone)}</span>
      <span>{LINKEDIN_URL}</span>
      <span>{GITHUB_URL}</span>
    </div>
  );
}

function AHeader() {
  return (
    <header className="a-header">
      <div className="a-header-main">
        <h1 className="a-name">{P.name}</h1>
        <div className="seg-gold" aria-hidden="true" />
      </div>
      <div className="a-header-side">
        <AContact />
      </div>
    </header>
  );
}

function AFooter({ n }) {
  return (
    <footer className="p-footer a-footer">
      {P.name} · Academic CV · Page {n} / {TOTAL_PAGES} · Current version at shabbir09.github.io/cv
    </footer>
  );
}

function AboutBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>About</ASectionTitle>
      <p className="a-text">{P.headline_academic}</p>
    </section>
  );
}

function EducationBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Education</ASectionTitle>
      {education.map((e) => (
        <article className="a-entry" key={e.institution}>
          <div className="a-entry-head">
            <h3>{e.institution}</h3>
            <span className="a-dates">{range(e.start, e.end)}</span>
          </div>
          <div className="a-sub">
            {[e.degree, e.area].filter(Boolean).join(', ')} · {e.location}
          </div>
          {e.highlights.map((h, i) => (
            <div className="a-hl" key={i}>
              {h}
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}

function EntryList({ entries }) {
  return entries.map((e) => (
    <article className="a-entry" key={e.position}>
      <div className="a-entry-head">
        <h3>{e.position}</h3>
        <span className="a-dates">{range(e.start, e.end)}</span>
      </div>
      <div className="a-sub">
        {e.company} · {e.location}
      </div>
      <ul className="a-bullets">
        {e.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </article>
  ));
}

function ExperienceBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Experience</ASectionTitle>
      <EntryList entries={experience} />
    </section>
  );
}

function ResearchBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Research</ASectionTitle>
      <EntryList entries={research} />
    </section>
  );
}

/* Journal-style reference: hanging indent, authors (year). Title. Journal. DOI. */
function Reference({ p }) {
  return (
    <p className="a-ref">
      {p.authors.map((a, i) => (
        <span key={i}>
          {i > 0 && ', '}
          {a === P.name ? <strong>{a}</strong> : a}
        </span>
      ))}
      {` (${p.date}). `}
      {p.title}. <em>{p.journal}</em>.
      {p.doi && (
        <>
          {' '}
          <a href={`https://doi.org/${p.doi}`}>https://doi.org/{p.doi}</a>
        </>
      )}
    </p>
  );
}

function PublicationsBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Publications</ASectionTitle>
      {publications.map((p) => (
        <Reference key={p.title} p={p} />
      ))}
    </section>
  );
}

function CourseworkBlock() {
  if (!coursework.length) return null;
  return (
    <section className="a-block">
      <ASectionTitle>Coursework</ASectionTitle>
      {coursework.map((c) => (
        <p className="a-text" key={c.label}>
          {c.details}
        </p>
      ))}
    </section>
  );
}

function SkillsBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Skills</ASectionTitle>
      {skills.map((s) => (
        <p className="a-skill" key={s.label}>
          <strong>{s.label}:</strong> {s.details}
        </p>
      ))}
    </section>
  );
}

function AwardsBlock() {
  return (
    <section className="a-block">
      <ASectionTitle>Honors and Awards</ASectionTitle>
      {awards.map((a) => (
        <p className="a-award" key={a.label}>
          <strong>{a.label}</strong> — {a.details}
        </p>
      ))}
    </section>
  );
}

/* ---------- print render: two explicit A4 sheets ---------- */
export function PrintAcademic() {
  return (
    <div className="print-root scholar-root">
      <section className="sheet scholar-sheet">
        <AHeader />
        <AboutBlock />
        <EducationBlock />
        <ExperienceBlock />
        <AFooter n={1} />
      </section>

      <section className="sheet scholar-sheet">
        <ResearchBlock />
        <PublicationsBlock />
        <CourseworkBlock />
        <SkillsBlock />
        <AwardsBlock />
        <AFooter n={2} />
      </section>
    </div>
  );
}

/* ---------- screen render: light Scholar page, same components ---------- */
export function ScreenAcademic() {
  return (
    <div className="a-screen">
      <main className="a-screen-inner">
        <AHeader />
        <Downloads primary="academic-premium" scholar />
        <AboutBlock />
        <EducationBlock />
        <ExperienceBlock />
        <ResearchBlock />
        <PublicationsBlock />
        <CourseworkBlock />
        <SkillsBlock />
        <AwardsBlock />
      </main>
      <footer className="a-screen-footer">
        <div className="a-screen-footer-inner">
          {P.name} · Academic CV · Current version at shabbir09.github.io/cv
        </div>
      </footer>
    </div>
  );
}
