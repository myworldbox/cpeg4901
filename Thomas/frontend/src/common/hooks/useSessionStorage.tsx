import { useState, useEffect } from "react";

export const useSessionStorage = (key: string) => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  return isBrowser ? window['sessionStorage'][key] : '';
}

export const setSessionStorage = (key: string, value: string) => {
    const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

    if (isBrowser) {
        window.sessionStorage.setItem(key, value);
        return true;
    }
    return false;
}

export default useSessionStorage