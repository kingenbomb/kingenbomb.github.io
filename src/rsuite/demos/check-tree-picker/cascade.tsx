import { Toggle } from 'rsuite';
import { useState } from 'react';
import React from 'react';
import { CheckTreePicker } from 'rsuite';
import { mockTreeData } from '@/utils/mock';

const data = mockTreeData({
  limits: [3, 3, 4],
  labels: (layer, value, faker) => {
    const methodName = ['jobArea', 'jobType', 'firstName'];
    return faker.person[methodName[layer]]();
  }
});

const App = () => {
  const [cascade, setCascade] = React.useState(false);
  return (
    <div>
      <Toggle
        checked={cascade}
        onChange={checked => {
          setCascade(checked);
        }}
      >
        Cascade
      </Toggle>
      <hr />
      <CheckTreePicker
        defaultExpandAll
        cascade={cascade}
        defaultValue={[2, 38]}
        data={data}
        w={280}
      />
    </div>
  );
};



export default App;
