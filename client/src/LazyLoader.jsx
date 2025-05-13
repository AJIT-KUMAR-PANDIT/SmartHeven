import React, { Suspense } from "react";

export function lazyImport(factory) {
  const Component = React.lazy(factory);
  return (props) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}