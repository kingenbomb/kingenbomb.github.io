import React from 'react';
import { JSONTree } from 'react-json-tree';

const JSONView = ({ formValue, formError }: { formValue?: unknown; formError?: unknown }) => (
  <div className="my-2 space-y-2">
    <div className="rounded border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-600">formValue</div>
      <div className="p-2 text-[12px]">
        <JSONTree data={formValue} />
      </div>
    </div>
    <div className="rounded border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-600">formError</div>
      <div className="p-2 text-[12px]">
        <JSONTree data={formError} />
      </div>
    </div>
  </div>
);

export default JSONView;
