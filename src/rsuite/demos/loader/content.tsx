import { Loader } from 'rsuite';

const App = () => (
  <>
    <Loader content="Horizontal Loading..." />
    <hr />
    <Loader content="Vertical Loading..." vertical />
  </>
);


export default App;
