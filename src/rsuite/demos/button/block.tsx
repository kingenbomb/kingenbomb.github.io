import { Button, IconButton, ButtonToolbar } from 'rsuite';
import AddOutlineIcon from '@rsuite/icons/AddOutline';

const App = () => (
  <ButtonToolbar>
    <Button appearance="default" block>
      Block
    </Button>
    <Button appearance="primary" block>
      Block Primary
    </Button>
    <Button block startIcon={<AddOutlineIcon />}>
      Block With Icon
    </Button>
  </ButtonToolbar>
);


export default App;
