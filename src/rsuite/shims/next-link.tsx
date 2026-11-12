import React from 'react';

const Link = ({ href, children, ...rest }: any) => (
  <a href={typeof href === 'string' ? href : href?.pathname || '#'} {...rest}>
    {children}
  </a>
);

export default Link;
