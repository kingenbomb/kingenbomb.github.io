import { useState } from 'react';
import React from 'react';
import { Tree } from 'rsuite';
import { mockTreeData } from '@/utils/mock';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const App = () => {
  const [treeData, setTreeData] = React.useState(data);
  return (
    <Tree
      data={treeData}
      draggable
      defaultExpandAll
      onDrop={({ createUpdateDataFunction }, event) =>
        setTreeData(createUpdateDataFunction(treeData))
      }
    />
  );
};



export default App;
