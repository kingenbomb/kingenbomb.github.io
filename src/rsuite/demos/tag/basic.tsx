import { Tag, TagGroup } from 'rsuite';

const App = () => (
  <TagGroup>
    <Tag>Text</Tag>
    <Tag closable>Closable</Tag>
    <Tag>
      <a target="_blank" href="https://rsuitejs.com" rel="noreferrer">
        Link
      </a>
    </Tag>
  </TagGroup>
);



export default App;
