import { Suspense, lazy } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { allComponents, categories } from './registry';
import CategoryBrowse from './pages/CategoryBrowse.jsx';

const RsuiteSection = lazy(() => import('./rsuite/RsuiteSection.jsx'));
const ProApp = lazy(() => import('./pro/ProApp.jsx'));

function Home() {
  const total = categories.reduce((sum, category) => sum + category.items.length, 0);
  return (
    <div className="content-inner">
      <header className="page-header">
        <p className="page-kicker">React Bits Clone</p>
        <h1>Component Playground</h1>
        <p className="page-lead">
          {total} components ported so far — real component sources, live customization panels and usage code for
          every one. More categories land in later batches.
        </p>
      </header>
      {categories.map(category => (
        <section key={category.slug} className="home-section">
          <h2 className="home-section-title">
            {category.name}
            <span>{category.items.length}</span>
          </h2>
          <div className="home-grid">
            {category.items.map(entry => (
              <Link key={entry.slug} to={`/${category.slug}/${entry.slug}`} className="home-card">
                <span className="home-card-name">{entry.name}</span>
                <span className="home-card-cat">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <section className="home-section">
        <h2 className="home-section-title">
          Catalog pages
          <span>{categories.length + 1}</span>
        </h2>
        <div className="home-grid">
          {categories.map(category => (
            <Link key={`page-${category.slug}`} to={`/c/${category.slug}`} className="home-card">
              <span className="home-card-name">{category.name}</span>
              <span className="home-card-cat">{category.items.length} components · browse</span>
            </Link>
          ))}
          <Link to="/pro/docs/components" className="home-card">
            <span className="home-card-name">React Bits Pro</span>
            <span className="home-card-cat">230 components · 22 blocks · 38 app ui · 15 templates · 20 agent skills</span>
          </Link>
        </div>
      </section>
      <section className="home-section">
        <h2 className="home-section-title">
          React Suite UI
          <span>1</span>
        </h2>
        <div className="home-grid">
          <Link to="/rsuite" className="home-card">
            <span className="home-card-name">React Suite Gallery</span>
            <span className="home-card-cat">107 pages · 825 demos</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="content-inner">
      <header className="page-header">
        <p className="page-kicker">404</p>
        <h1>Component not found</h1>
        <p className="page-lead">
          This component has not been ported yet. <Link to="/">Back to the playground</Link>.
        </p>
      </header>
    </div>
  );
}

function ComponentPage() {
  const { categorySlug, slug } = useParams();
  const category = categories.find(item => item.slug === categorySlug);
  const entry = category?.items.find(item => item.slug === slug);
  if (!category || !entry) return <NotFound />;
  const Demo = entry.demo;
  return (
    <div className="content-inner">
      <header className="page-header page-header--component">
        <p className="page-kicker">{category.name}</p>
        <h1>{entry.name}</h1>
      </header>
      <Suspense fallback={<div className="page-loading">Loading {entry.name}…</div>}>
        <Demo />
      </Suspense>
    </div>
  );
}

export default function App() {
  const total = allComponents.length;
  const location = useLocation();
  if (location.pathname === '/rsuite' || location.pathname.startsWith('/rsuite/')) {
    return (
      <Suspense fallback={<div className="page-loading">Loading React Suite…</div>}>
        <RsuiteSection />
      </Suspense>
    );
  }
  if (location.pathname === '/pro' || location.pathname.startsWith('/pro/')) {
    return (
      <Suspense fallback={<div className="page-loading">Loading React Bits Pro…</div>}>
        <ProApp />
      </Suspense>
    );
  }
  return (
    <div className="site">
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          reactbits
          <span>*</span>
        </Link>
        <div className="sidebar-scroll">
          <div className="sidebar-group">
            <p className="sidebar-heading">
              Browse
              <span className="sidebar-count">{categories.length}</span>
            </p>
            <nav className="sidebar-nav">
              {categories.map(category => (
                <NavLink
                  key={`browse-${category.slug}`}
                  to={`/c/${category.slug}`}
                  className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
                >
                  {category.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="sidebar-group">
            <p className="sidebar-heading">
              More libraries
              <span className="sidebar-count">2</span>
            </p>
            <nav className="sidebar-nav">
              <NavLink
                to="/rsuite"
                className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
              >
                React Suite UI
              </NavLink>
              <NavLink
                to="/pro/docs/components"
                className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
              >
                React Bits Pro
              </NavLink>
            </nav>
          </div>
          {categories.map(category => (
            <div key={category.slug} className="sidebar-group">
              <p className="sidebar-heading">
                {category.name}
                <span className="sidebar-count">{category.items.length}</span>
              </p>
              <nav className="sidebar-nav">
                {category.items.map(entry => (
                  <NavLink
                    key={entry.slug}
                    to={`/${category.slug}/${entry.slug}`}
                    className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
                  >
                    {entry.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="sidebar-foot">
          <p>
            {total} components · MIT + Commons Clause (c) David Haz ·{' '}
            <a href="https://reactbits.dev" target="_blank" rel="noreferrer">
              reactbits.dev
            </a>
          </p>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:category" element={<CategoryBrowse />} />
          <Route path="/:categorySlug/:slug" element={<ComponentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
