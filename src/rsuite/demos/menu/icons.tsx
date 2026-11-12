import { Menu } from 'rsuite';
import PageIcon from '@rsuite/icons/Page';
import IdInfoIcon from '@rsuite/icons/IdInfo';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import DetailIcon from '@rsuite/icons/Detail';

const App = () => (
  <Menu>
    <Menu.Item icon={<PageIcon />}>New File</Menu.Item>
    <Menu.Item icon={<IdInfoIcon />}>New File with Current Profile</Menu.Item>
    <Menu.Item icon={<FileDownloadIcon />}>Download As...</Menu.Item>
    <Menu.Item icon={<DetailIcon />}>Export PDF</Menu.Item>
  </Menu>
);


export default App;
