import { Uploader, Button } from 'rsuite';

const App = () => (
  <>
    <Uploader listType="picture-text" action="//jsonplaceholder.typicode.com/posts/">
      <Button>Select files...</Button>
    </Uploader>
  </>
);



export default App;
