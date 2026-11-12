import { useCallback, useMemo, useState } from 'react';

const serialize = value => JSON.stringify(value ?? null);

/**
 * Local (nuqs-free) implementation of the official useComponentProps hook.
 * Same public API: props / defaultProps / updateProp / updateProps / resetProps / hasChanges.
 */
export default function useComponentProps(defaultProps) {
  const [props, setProps] = useState(defaultProps);

  const updateProp = useCallback((name, value) => {
    setProps(previous => ({ ...previous, [name]: value }));
  }, []);

  const updateProps = useCallback(partial => {
    setProps(previous => ({ ...previous, ...partial }));
  }, []);

  const resetProps = useCallback(() => {
    setProps({ ...defaultProps });
  }, [defaultProps]);

  const hasChanges = useMemo(() => serialize(props) !== serialize(defaultProps), [props, defaultProps]);

  return { props, defaultProps, updateProp, updateProps, resetProps, hasChanges };
}
