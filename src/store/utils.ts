import { Status } from './statusEnum';
import { uiStatusArrayAtom } from './uiAtoms';
import { useSetAtom } from 'jotai';

export const UI_STATUS_KEY = 'uiStatusArray';

export function saveUiStatusArrayToLocalStorage(arr: boolean[]) {
  // Always save a 20-element array
  if (Array.isArray(arr)) {
    const arr20 = Array(20).fill(false);
    for (let i = 0; i < 20; i++) {
      if (typeof arr[i] === 'boolean' && i !== Status.GameMenu && i !== Status.NavExpanded ) arr20[i] = arr[i];
    }
    localStorage.setItem(UI_STATUS_KEY, JSON.stringify(arr20));
  } else {
    localStorage.setItem(UI_STATUS_KEY, JSON.stringify(Array(20).fill(false)));
  }
}

export function loadUiStatusArrayFromLocalStorage(): boolean[] {
  const val = localStorage.getItem(UI_STATUS_KEY);
  const defaultArr = uiStatusArrayAtom.init ? uiStatusArrayAtom.init : Array(20).fill(false);
  if (!val) {
    return defaultArr;
  }
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr) && arr.length === 20 && arr.every(v => typeof v === 'boolean')) {
      return arr;
    }
  } catch (e) {
    // ignore
  }
  // fallback to atom default
  return defaultArr;
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