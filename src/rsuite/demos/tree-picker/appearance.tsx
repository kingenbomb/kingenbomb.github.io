import { TreePicker } from 'rsuite';
import { mockTreeData } from '@/utils/mock';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const App = () => (
  <>
    <TreePicker
      defaultExpandAll
      data={data}
      appearance="default"
      placeholder="Default"
      w={246}
    />
    <hr />
    <TreePicker
      defaultExpandAll
      data={data}
      appearance="subtle"
      placeholder="Subtle"
      w={246}
    />
  </>
);


export default App;
