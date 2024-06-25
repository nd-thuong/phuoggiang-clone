import { DependencyList, useEffect } from 'react';

export const useAsyncEffect = (cb: () => void, dep: DependencyList | undefined = undefined) => {
  useEffect(() => {
    (async () => {
      await cb();
    })();
  }, dep ?? []);
};
