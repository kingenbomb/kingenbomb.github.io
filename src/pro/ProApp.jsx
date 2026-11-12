import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import catalog from './data/pro-catalog.json';
import './pro.css';
import ProNav from './ProNav.jsx';
import ProSidebar from './ProSidebar.jsx';
import ProFooter from './ProFooter.jsx';
import SearchDialog from './SearchDialog.jsx';
import ComponentsPage from './pages/ComponentsPage.jsx';
import BlocksPage from './pages/BlocksPage.jsx';
import AppUiPage from './pages/AppUiPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import AgentKitPage from './pages/AgentKitPage.jsx';
import ComponentDetail from './pages/ComponentDetail.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import VariantDetail from './pages/VariantDetail.jsx';
import TemplateDetail from './pages/TemplateDetail.jsx';
import AgentKitDetail from './pages/AgentKitDetail.jsx';
import DocPage from './pages/DocPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import SitePage from './pages/SitePage.jsx';

const SIDEBAR_KEY = {
  components: 'components',
  blocks: 'blocks',
  'app-ui': 'appui',
  templates: 'templates',
  'agent-kit': 'agentkit',
};

const counts = {
  components: catalog.sections.components.cards.length,
  blocks: catalog.sections.blocks.cards.length,
  'app-ui': catalog.sections['app-ui'].cards.length,
  templates: catalog.sections.templates.cards.length,
  'agent-kit': catalog.sections['agent-kit'].cards.length,
  appui: catalog.sections['app-ui'].cards.length,
  agentkit: catalog.sections['agent-kit'].cards.length,
};

export default function ProApp() {
  const location = useLocation();
  const segment = location.pathname.replace(/^\/pro\/docs\/?/, '').split('/')[0];
  const sectionKey = SIDEBAR_KEY[segment] || 'components';

  return (
    <div className="pro-app dark">
      <ProNav counts={counts} />
      <div className="mx-auto flex w-full items-start lg:pl-4">
        <ProSidebar sectionKey={sectionKey} sidebars={catalog.sidebars} counts={counts} />
        <main className="min-w-0 flex-1 px-4 lg:px-10 pt-6 md:pt-10 pb-4 max-w-[1250px]">
          <Routes>
            <Route path="/pro" element={<Navigate to="/pro/docs/components" replace />} />
            <Route path="/pro/docs" element={<Navigate to="/pro/docs/components" replace />} />
            <Route path="/pro/docs/components" element={<ComponentsPage />} />
            <Route path="/pro/docs/blocks" element={<BlocksPage />} />
            <Route path="/pro/docs/app-ui" element={<AppUiPage />} />
            <Route path="/pro/docs/templates" element={<TemplatesPage />} />
            <Route path="/pro/docs/agent-kit" element={<AgentKitPage />} />
            <Route path="/pro/docs/components/:slug" element={<ComponentDetail />} />
            <Route path="/pro/docs/blocks/:cat" element={<CategoryDetail kind="blocks" />} />
            <Route path="/pro/docs/blocks/:cat/:variant" element={<VariantDetail kind="blocks" />} />
            <Route path="/pro/docs/app-ui/:cat" element={<CategoryDetail kind="appUi" />} />
            <Route path="/pro/docs/app-ui/:cat/:variant" element={<VariantDetail kind="appUi" />} />
            <Route path="/pro/docs/templates/:slug" element={<TemplateDetail />} />
            <Route path="/pro/docs/agent-kit/:kind/:slug" element={<AgentKitDetail />} />
            <Route path="/pro/docs/agent-kit/:slug" element={<AgentKitDetail />} />
            <Route path="/pro/docs/introduction" element={<DocPage />} />
            <Route path="/pro/docs/installation" element={<DocPage />} />
            <Route path="/pro/docs/mcp" element={<DocPage />} />
            <Route path="/pro/docs/saved" element={<SavedPage />} />
            <Route path="/pro/pricing" element={<PricingPage />} />
            <Route path="/pro/docs/pricing" element={<Navigate to="/pro/pricing" replace />} />
            <Route path="/pro/about" element={<SitePage />} />
            <Route path="/pro/license" element={<SitePage />} />
            <Route path="/pro/privacy" element={<SitePage />} />
            <Route path="/pro/roadmap" element={<SitePage />} />
            <Route path="/pro/changelog" element={<SitePage />} />
            <Route path="/pro/affiliate" element={<SitePage />} />
            <Route path="/pro/*" element={<Navigate to="/pro/docs/components" replace />} />
          </Routes>
        </main>
      </div>
      <ProFooter footer={catalog.footer} />
      <SearchDialog />
    </div>
  );
}

