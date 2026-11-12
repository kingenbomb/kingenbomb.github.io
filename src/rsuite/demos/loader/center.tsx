import { Loader, Placeholder } from 'rsuite';

const App = () => (
  <div>
    <Placeholder.Paragraph rows={8} />
    <Loader center content="loading" />
  </div>
);



export default App;
