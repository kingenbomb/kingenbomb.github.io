import * as ReactNS from 'react';
import * as RS from 'rsuite';
import { faker } from '@faker-js/faker';
import * as YupNS from 'yup';
import { SchemaModel, StringType, NumberType, ObjectType, ArrayType, BooleanType } from 'rsuite/Schema';
import { mockUsers } from '@/utils/mock';
import JSONView from '@/components/support/JSONView';
import FakeBrowser from '@/components/support/FakeBrowser';
import ErrorSummaryCompat from '@/components/support/ErrorSummaryCompat';

if (!(RS as any).Form?.ErrorSummary) {
  (RS as any).Form.ErrorSummary = ErrorSummaryCompat;
}

const DOM_GUARD = new Set([
  'Text', 'Image', 'Option', 'Event', 'Audio', 'Video', 'Script', 'File', 'Notification',
  'Range', 'Comment', 'Blob', 'FileReader', 'Worker', 'Location', 'History', 'Navigator', 'Screen',
]);

const REACT_SCOPE = [
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext', 'useReducer',
  'useLayoutEffect', 'useImperativeHandle', 'useDebugValue', 'useId', 'useSyncExternalStore',
  'useTransition', 'useDeferredValue', 'useOptimistic',
  'forwardRef', 'memo', 'createRef', 'Fragment', 'createContext', 'Component', 'PureComponent',
  'cloneElement', 'createElement', 'isValidElement',
];

const scope: Record<string, unknown> = {
  faker,
  Yup: YupNS,
  SchemaModel,
  StringType,
  NumberType,
  ObjectType,
  ArrayType,
  BooleanType,
  mockUsers,
  JSONView,
  FakeBrowser,
  Column: (RS as any).Table?.Column,
  HeaderCell: (RS as any).Table?.HeaderCell,
  Cell: (RS as any).Table?.Cell,
  ColumnGroup: (RS as any).Table?.ColumnGroup,
};

for (const [key, value] of Object.entries(RS as unknown as Record<string, unknown>)) {
  if (!/^[A-Z]/.test(key)) continue;
  scope[key] = value;
}
for (const key of REACT_SCOPE) {
  scope[key] = (ReactNS as any)[key];
}

const g = globalThis as unknown as Record<string, unknown>;
for (const [key, value] of Object.entries(scope)) {
  if (value === undefined) continue;
  if (DOM_GUARD.has(key)) continue;
  g[key] = value;
}
