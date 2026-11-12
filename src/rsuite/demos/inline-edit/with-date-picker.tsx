import { InlineEdit, DatePicker } from 'rsuite';

const App = () => (
  <InlineEdit placeholder="Click to edit ..." defaultValue={new Date()}>
    <DatePicker format="MMMM dd, yyyy" />
  </InlineEdit>
);



export default App;
