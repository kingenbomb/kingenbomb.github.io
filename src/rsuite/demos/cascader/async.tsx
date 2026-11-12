import { useState } from 'react';
import React from 'react';
import { Cascader } from 'rsuite';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import { mockAsyncData } from '@/utils/mock';

const [getNodes, fetchNodes] = mockAsyncData();
const initialData = getNodes(5);

const App = () => {
  const [value, setValue] = React.useState();

  return (
    <div className="example-item">
      <Cascader
        value={value}
        onChange={setValue}
        placeholder="Select"
        w={224}
        data={initialData}
        columnWidth={200}
        getChildren={node => {
          return fetchNodes(node.id);
        }}
        renderTreeNode={(label, item) => {
          return (
            <>
              {item.children ? <FolderFillIcon /> : <PageIcon />} {label}
            </>
          );
        }}
      />
    </div>
  );
};



export default App;
