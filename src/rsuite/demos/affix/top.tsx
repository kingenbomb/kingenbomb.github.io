import { Affix, Button, Placeholder } from 'rsuite';

const App = () => (
  <>
    <Affix top={50}>
      <Button appearance="primary">Top 50</Button>
    </Affix>
    <Placeholder.Paragraph rows={12} />
  </>
);



export default App;
