import './lib/demo-scope';
import 'rsuite/dist/rsuite-no-reset.min.css';
import './index.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from './components/shell/TopNav';
import Sidebar from './components/shell/Sidebar';
import HomePage from './pages/HomePage';
import ComponentPage from './pages/ComponentPage';

const parseId = (pathname) => {
  const m = pathname.match(/^\/rsuite\/components\/([\w-]+)/);
  return m ? m[1] : null;
};

export default function RsuiteSection() {
  const location = useLocation();
  const id = parseId(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-[#1c1f23]">
      <TopNav activeId={id || undefined} />
      <Sidebar activeId={id || undefined} />
      <div className="ml-64 pt-14">{id ? <ComponentPage id={id} /> : <HomePage />}</div>
    </div>
  );
}
