export const UI_STATUS_KEY = 'uiStatusArray';

export function saveUiStatusArrayToLocalStorage(arr: boolean[]) {
  localStorage.setItem(UI_STATUS_KEY, JSON.stringify(arr));
}

export function loadUiStatusArrayFromLocalStorage(): boolean[] {
  const val = localStorage.getItem(UI_STATUS_KEY);
  if (!val) return Array(13).fill(false);
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr) && arr.length === 13 && arr.every(v => typeof v === 'boolean')) {
      return arr;
    }
  } catch {}
  return Array(13).fill(false);
}

// Utility to set specified indices to true in a boolean array
export function setUiStatusIndicesTrue(indices: number[], setUiStatusArray: (arr: boolean[]) => void, currentArray: boolean[]) {
  const newArray = [...currentArray];
  indices.forEach(idx => {
    if (idx >= 0 && idx < newArray.length) {
      newArray[idx] = true;
    }
  });
  setUiStatusArray(newArray);
}
