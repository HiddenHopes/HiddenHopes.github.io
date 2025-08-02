import { atom } from 'jotai';

// Atom to hold an array of 20 boolean values, all default to false
// Only indices 1, 12, and 13 are true by default
const defaultUiStatusArray = Array(20).fill(false);
defaultUiStatusArray[1] = true;
defaultUiStatusArray[12] = true;
defaultUiStatusArray[13] = true;
export const uiStatusArrayAtom = atom<boolean[]>(defaultUiStatusArray);


