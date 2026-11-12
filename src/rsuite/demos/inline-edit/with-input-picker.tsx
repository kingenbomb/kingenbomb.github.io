import { InlineEdit, InputPicker } from 'rsuite';

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
  item => ({ label: item, value: item })
);

const App = () => (
  <InlineEdit placeholder="Click to edit ..." showControls={false}>
    <InputPicker data={data} w={200} />
  </InlineEdit>
);



export default App;
