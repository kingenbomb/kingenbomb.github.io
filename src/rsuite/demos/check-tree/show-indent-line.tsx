import { CheckTree } from 'rsuite';
import { mockTreeData } from '@/utils/mock';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const App = () => {
  return (
    <>
      <CheckTree data={data} defaultExpandAll showIndentLine />
    </>
  );
};


export default App;
