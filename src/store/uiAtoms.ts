import { atom } from 'jotai';

// Atom to hold an array of 13 boolean values, all default to false
// Only 1, 12, and 13 (indices 0, 11, 12) are true by default
const defaultUiStatusArray = Array(13).fill(false);
defaultUiStatusArray[0] = true;
defaultUiStatusArray[11] = true;
defaultUiStatusArray[12] = true;
export const uiStatusArrayAtom = atom<boolean[]>(defaultUiStatusArray);


