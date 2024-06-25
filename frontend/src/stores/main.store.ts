import { create as _create, StateCreator } from 'zustand';

const storeResetFns = new Set<() => void>();

export const create = (<T>(f: StateCreator<T> | undefined) => {
  if (f === undefined) return create;
  const store = _create(f);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
}) as typeof _create;

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};
