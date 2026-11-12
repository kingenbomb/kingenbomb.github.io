import { Divider } from 'rsuite';
import { useState } from 'react';
import React from 'react';
import { Pagination } from 'rsuite';

const App = () => {
  const [activePage, setActivePage] = React.useState(5);
  const pageProps = {
    prev: true,
    last: true,
    next: true,
    first: true,
    total: 100,
    limit: 10,
    activePage,
    onChangePage: setActivePage
  };

  return (
    <>
      <Pagination {...pageProps} size="xs" />
      <Divider />
      <Pagination {...pageProps} size="sm" />
      <Divider />
      <Pagination {...pageProps} size="md" />
      <Divider />
      <Pagination {...pageProps} size="lg" />
    </>
  );
};



export default App;
