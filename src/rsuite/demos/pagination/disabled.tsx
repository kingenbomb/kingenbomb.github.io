import { Pagination } from 'rsuite';

const App = () => (
  <>
    <Pagination disabled total={100} limit={10} activePage={1} prev last next first />
  </>
);



export default App;
