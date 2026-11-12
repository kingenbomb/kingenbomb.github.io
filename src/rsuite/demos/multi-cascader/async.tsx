import { useState } from 'react';
import React from 'react';
import { MultiCascader } from 'rsuite';
import { mockAsyncData } from '@/utils/mock';

const [getNodes, fetchNodes] = mockAsyncData();
const initialData = getNodes(5);

const App = () => {
  const [value, setValue] = React.useState();

  return (
    <div className="example-item">
      <MultiCascader
        value={value}
        onChange={setValue}
        placeholder="Select"
        w={224}
        data={initialData}
        getChildren={fetchNodes}
      />
    </div>
  );
};



export default App;
