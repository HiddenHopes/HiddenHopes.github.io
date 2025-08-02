import { uiStatusArrayAtom } from './uiAtoms';
import { useSetAtom } from 'jotai';

export const UI_STATUS_KEY = 'uiStatusArray';

export function saveUiStatusArrayToLocalStorage(arr: boolean[]) {
  localStorage.setItem(UI_STATUS_KEY, JSON.stringify(arr));
}

export function loadUiStatusArrayFromLocalStorage(): boolean[] {
  const val = localStorage.getItem(UI_STATUS_KEY);
  if (!val) return Array(13).fill(false);
  try {
    const stored = localStorage.getItem('uiStatusArray');
    if (stored) {
      const arr = JSON.parse(stored);
      // Get the default array from atom
      const defaultArr = uiStatusArrayAtom.init ? uiStatusArrayAtom.init : Array(20).fill(false);
      // If loaded array is not 20 elements, pad/copy from default
      if (Array.isArray(arr)) {
        const result = defaultArr.slice();
        for (let i = 0; i < 20; i++) {
          if (typeof arr[i] === 'boolean') {
            result[i] = arr[i];
          }
        }
        return result;
      }
    }
  } catch (e) {
    // ignore
  }
  // fallback to atom default
  return uiStatusArrayAtom.init ? uiStatusArrayAtom.init : Array(20).fill(false);
}

// React hook to set one or more indices in uiStatusArrayAtom to a given boolean value
export function useSetUiStatus() {
  const setUiStatusArray = useSetAtom(uiStatusArrayAtom);
  return (indices: number | number[], value: boolean) => {
    setUiStatusArray((prev) => {
      const newArray = [...prev];
      if (Array.isArray(indices)) {
        indices.forEach(idx => {
          if (idx >= 0 && idx < newArray.length) {
            newArray[idx] = value;
          }
        });
      } else {
        if (indices >= 0 && indices < newArray.length) {
          newArray[indices] = value;
        }
      }
      return newArray;
    });
  };
}