import { Uploader, Button } from 'rsuite';

const App = () => (
  <>
    <Uploader action="//jsonplaceholder.typicode.com/posts/">
      <Button>Select files...</Button>
    </Uploader>
  </>
);



export default App;
