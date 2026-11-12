import { useState } from 'react';
import React from 'react';
import { List } from 'rsuite';

const BrowserList = ['Chrome', 'Edge', 'FireFox', 'Safari'];

const App = () => {
  const [data, setData] = React.useState(BrowserList);

  const handleSortEnd = ({ oldIndex, newIndex }) =>
    setData(prvData => {
      const moveData = prvData.splice((oldIndex - 1) / 2, 1);
      const newData = [...prvData];
      newData.splice((newIndex - 1) / 2, 0, moveData[0]);
      return newData;
    }, []);

  return (
    <List sortable bordered onSort={handleSortEnd}>
      {data.flatMap((browser, index) => [
        <List.Item key={index} index={index * 2} collection="order" disabled>
          {index + 1}
        </List.Item>,
        <List.Item key={browser} index={index * 2 + 1}>
          {browser}
        </List.Item>
      ])}
    </List>
  );
};



export default App;
