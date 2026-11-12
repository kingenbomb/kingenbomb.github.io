import { InlineEdit, Slider } from 'rsuite';

const App = () => (
  <InlineEdit placeholder="Click to edit ..." w={300} defaultValue={10}>
    {(props, ref) => {
      return <Slider {...props} ref={ref} />;
    }}
  </InlineEdit>
);



export default App;
