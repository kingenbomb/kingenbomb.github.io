import { Tree } from 'rsuite';
import { CheckTree } from 'rsuite';
import PageIcon from '@rsuite/icons/Page';
import { mockTreeData } from '@/utils/mock';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
  MdFilePresent,
  MdFolder
} from 'react-icons/md';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const TreeNode = ({ children, ...rest }) => {
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {children}
    </div>
  );
};

const App = () => (
  <Tree
    data={data}
    defaultExpandAll
    renderTreeNode={treeNode => {
      return (
        <TreeNode>
          {treeNode.children ? <MdFolder /> : <MdFilePresent />}
          {treeNode.label}
        </TreeNode>
      );
    }}
    renderTreeIcon={(treeNode, expanded) => {
      if (treeNode.children) {
        return expanded ? <MdOutlineKeyboardArrowDown /> : <MdOutlineKeyboardArrowRight />;
      }
      return null;
    }}
  />
);



export default App;
