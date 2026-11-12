import { useState } from 'react';
import React from 'react';
import { Pagination } from 'rsuite';

const App = () => {
  const [activePage, setActivePage] = React.useState(1);

  return (
    <>
      <Pagination
        total={100}
        limit={10}
        first={<span>First</span>}
        last={<span>Last</span>}
        activePage={activePage}
        onChangePage={setActivePage}
      />
    </>
  );
};



export default App;
