import React from 'react';

const dynamic = (loader: any, _options?: any) =>
  React.lazy(() =>
    Promise.resolve(loader()).then((m: any) => {
      if (m && typeof m === 'object' && 'default' in m) return m;
      return { default: m };
    })
  );

export default dynamic;
