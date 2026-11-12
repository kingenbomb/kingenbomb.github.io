import { InlineEdit, Input } from 'rsuite';

const App = () => (
  <>
    <InlineEdit placeholder="Click to edit ..." w={300}>
      <Input as="textarea" rows={5} />
    </InlineEdit>
  </>
);



export default App;
