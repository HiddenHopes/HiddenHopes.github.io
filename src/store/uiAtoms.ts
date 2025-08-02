import { atom } from 'jotai';

// Atom to hold an array of 20 boolean values, all default to false
// Only indices 1, 12, and 13 are true by default
function getDefaultUiStatusArray() {
  const arr = Array(20).fill(false);
  arr[1] = true;
  arr[12] = true;
  arr[13] = true;
  return arr;
}
export const uiStatusArrayAtom = atom<boolean[]>(getDefaultUiStatusArray());


