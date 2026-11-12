import { TreePicker, Button } from 'rsuite';
import { mockTreeData } from '@/utils/mock';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const App = (
  <>
    <TreePicker data={data} toggleAs={Button} />
    <hr />
    <TreePicker data={data} block toggleAs={Button} />
  </>
);



const __AppComponent = () => App;
export default __AppComponent;
