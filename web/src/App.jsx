import data from './content.json';

/* ---------- data selection: founder variant only, straight from content.yaml ---------- */
const on = (e) => (e.show_on || []).includes('founder');
const P = data.personal;
const experience = data.experience.filter(on);
const research = data.research.filter(on);
const publications = data.publications.filter(on);
const educationF = data.education.filter(on);
const skillsAll = data.skills.filter(on);
const languages = skillsAll.find((s) => s.label === 'Languages');
const skillGroups = skillsAll.filter((s) => s.label !== 'Languages');

const LINKEDIN_URL = `linkedin.com/in/${P.linkedin}`;
const GITHUB_URL = `github.com/${P.github}`;

/* ---------- formatting helpers (presentation only — facts untouched) ---------- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s === 'present') return 'Present';
  const m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return s;
}
export const range = (a, b) => `${fmtDate(a)} – ${fmtDate(b)}`;
export function fmtPhone(p) {
  const s = String(p);
  if (s.startsWith('+880') && s.length === 14) return `+880 ${s.slice(4, 8)} ${s.slice(8)}`;
  return s;
}

/* ---------- shared components ---------- */
function SectionTitle({ children }) {
  return (
    <h2 className="sec-title">
      <span className="tick" aria-hidden="true" />
      {children}
    </h2>
  );
}

function Entry({ e }) {
  return (
    <article className="entry">
      <div className="entry-head">
        <h3>{e.position}</h3>
        <span className="entry-dates">{range(e.start, e.end)}</span>
      </div>
      <div className="entry-sub">
        {e.company} · {e.location}
      </div>
      <ul className="bullets">
        {e.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </article>
  );
}

function Publication({ p }) {
  return (
    <article className="entry pub">
      <div className="entry-head">
        <h3>{p.title}</h3>
        <span className="entry-dates">{p.date}</span>
      </div>
      <div className="pub-authors">
        {p.authors.map((a, i) => (
          <span key={i}>
            {i > 0 && ', '}
            {a === P.name ? <strong>{a}</strong> : a}
          </span>
        ))}
      </div>
      <div className="pub-journal">
        {p.journal}
        {p.doi && (
          <>
            {' · DOI: '}
            <a href={`https://doi.org/${p.doi}`}>{p.doi}</a>
          </>
        )}
      </div>
    </article>
  );
}

function ProfileBlock() {
  return (
    <section className="block">
      <SectionTitle>Profile</SectionTitle>
      <p className="rail-text">{P.headline_founder}</p>
    </section>
  );
}

function SkillsBlock() {
  return (
    <section className="block">
      <SectionTitle>Skills</SectionTitle>
      {skillGroups.map((s) => (
        <p className="skill" key={s.label}>
          <strong>{s.label}.</strong> {s.details}
        </p>
      ))}
    </section>
  );
}

function EducationBlock() {
  return (
    <section className="block">
      <SectionTitle>Education</SectionTitle>
      {educationF.map((e) => (
        <div className="edu" key={e.institution}>
          <div className="edu-inst">{e.institution}</div>
          <div className="edu-line">
            {e.degree}, {e.area}
          </div>
          <div className="edu-dates">
            {range(e.start, e.end)} · {e.location}
          </div>
          {e.highlights.map((h, i) => (
            <div className="edu-hl" key={i}>
              {h}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function LanguagesBlock() {
  if (!languages) return null;
  return (
    <section className="block">
      <SectionTitle>Languages</SectionTitle>
      <p className="rail-text">{languages.details}</p>
    </section>
  );
}

function LinksBlock() {
  return (
    <section className="block links-block">
      <div className="seg-hair" aria-hidden="true" />
      <img className="qr" src="./qr_linkedin.png" alt="QR code linking to LinkedIn profile" />
      <a className="rail-link" href={`https://www.${LINKEDIN_URL}`}>
        {LINKEDIN_URL}
      </a>
      <a className="rail-link" href={`https://${GITHUB_URL}`}>
        {GITHUB_URL}
      </a>
    </section>
  );
}

/* ---------- PDF downloads (screen only) ----------
   The four files are assembled next to index.html at publish time:
   premium PDFs from the Playwright print of this app, ATS PDFs from the
   RenderCV build (see .github/workflows/build.yml). Hrefs must match
   those filenames exactly. */
const PDF_LINKS = [
  { key: 'founder-premium', file: 'Shabbir_Ahmed_Founder_CV_premium.pdf', label: 'Founder CV · Premium PDF' },
  { key: 'academic-premium', file: 'Shabbir_Ahmed_Academic_CV_premium.pdf', label: 'Academic CV · Premium PDF' },
  { key: 'founder-ats', file: 'Shabbir_Ahmed_Founder_CV.pdf', label: 'Founder CV · ATS PDF' },
  { key: 'academic-ats', file: 'Shabbir_Ahmed_Academic_CV.pdf', label: 'Academic CV · ATS PDF' },
];

export function Downloads({ primary, scholar = false }) {
  return (
    <nav className={scholar ? 'dl-bar scholar' : 'dl-bar'} aria-label="Download this CV as PDF">
      {PDF_LINKS.map((l) => (
        <a
          key={l.key}
          className={l.key === primary ? 'dl-btn dl-btn-primary' : 'dl-btn'}
          href={`./${l.file}`}
          download
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

function Rail({ panel = false }) {
  return (
    <aside className={panel ? 'col-rail rail-panel' : 'col-rail'}>
      <ProfileBlock />
      <SkillsBlock />
      <EducationBlock />
      <LanguagesBlock />
      <LinksBlock />
    </aside>
  );
}

function ContactStack({ dark = false }) {
  return (
    <div className={dark ? 'contact contact-dark' : 'contact'}>
      <span>{P.location}</span>
      <span>{P.email}</span>
      <span>{fmtPhone(P.phone)}</span>
      <span>{LINKEDIN_URL}</span>
      <span>{GITHUB_URL}</span>
    </div>
  );
}

function PrintHeader() {
  return (
    <header className="p-header">
      <div className="p-header-main">
        <div className="eyebrow">Founder — Orion AI · Dhaka</div>
        <h1 className="p-name">{P.name}</h1>
        <div className="seg-ember" aria-hidden="true" />
      </div>
      <div className="p-header-side">
        <ContactStack />
      </div>
    </header>
  );
}

function PrintFooter({ n }) {
  return (
    <footer className="p-footer">
      {P.name} · Founder CV · Page {n} / 2 · Current version at shabbir09.github.io/cv
    </footer>
  );
}

/* ---------- print render: two explicit A4 sheets ---------- */
export function PrintApp() {
  return (
    <div className="print-root">
      <section className="sheet">
        <PrintHeader />
        <div className="cols">
          <div className="col-main">
            <section className="block">
              <SectionTitle>Experience</SectionTitle>
              {experience.slice(0, 2).map((e) => (
                <Entry key={e.company} e={e} />
              ))}
            </section>
          </div>
          <Rail panel />
        </div>
        <PrintFooter n={1} />
      </section>

      <section className="sheet">
        <div className="full-main">
          <section className="block">
            <SectionTitle>Experience — Continued</SectionTitle>
            {experience.slice(2).map((e) => (
              <Entry key={e.company} e={e} />
            ))}
          </section>
          <section className="block">
            <SectionTitle>Research Background</SectionTitle>
            {research.map((e) => (
              <Entry key={e.position} e={e} />
            ))}
          </section>
          <section className="block">
            <SectionTitle>Publications</SectionTitle>
            {publications.map((p) => (
              <Publication key={p.title} p={p} />
            ))}
          </section>
        </div>
        <PrintFooter n={2} />
      </section>
    </div>
  );
}

/* ---------- screen render: dark hero + same components ---------- */
export function ScreenApp() {
  return (
    <div className="screen-root">
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-main">
            <div className="eyebrow">Founder — Orion AI · Dhaka</div>
            <h1 className="s-name">{P.name}</h1>
            <div className="seg-ember" aria-hidden="true" />
          </div>
          <div className="hero-side">
            <ContactStack dark />
          </div>
        </div>
      </div>

      <main className="screen-body">
        <Downloads primary="founder-premium" />
        <div className="cols screen-cols">
          <div className="col-main">
            <section className="block">
              <SectionTitle>Experience</SectionTitle>
              {experience.map((e) => (
                <Entry key={e.company} e={e} />
              ))}
            </section>
            <section className="block">
              <SectionTitle>Research Background</SectionTitle>
              {research.map((e) => (
                <Entry key={e.position} e={e} />
              ))}
            </section>
            <section className="block">
              <SectionTitle>Publications</SectionTitle>
              {publications.map((p) => (
                <Publication key={p.title} p={p} />
              ))}
            </section>
          </div>
          <Rail />
        </div>
      </main>

      <footer className="screen-footer">
        <div className="screen-footer-inner">
          {P.name} · Founder CV · Current version at shabbir09.github.io/cv
        </div>
      </footer>
    </div>
  );
}
