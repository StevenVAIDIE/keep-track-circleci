import browser from 'webextension-polyfill'
import { useState, useEffect } from 'react'

function isDifferent (a: any, b: any): boolean {
  if (typeof a !== typeof b) {
    return true
  }
  if (Array.isArray(a)) {
    return arrayIsDifferent(a, b)
  }
  if (typeof a === 'object') {
    return objectIsDifferent(a, b)
  }
  return a !== b
}

function arrayIsDifferent (a: any, b: any): boolean {
  if (a.length !== b.length) {
    return true
  }

  return a.some((e: any, i: string) => {
    return isDifferent(e, b[i])
  })
}

function objectIsDifferent(a: any, b: any): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (arrayIsDifferent(keysA, keysB)) {
    return true
  }

  return keysA.some((key: string) => {
    return isDifferent(a[key], b[key])
  })
}

const useStorageState = <StateType>(initialValue: StateType, key: string) => {
  const [value, setValue] = useState(initialValue)
  browser.storage.sync.get(key).then(storedValue => {
    if (!storedValue[key]) {
      return
    }

    if (isDifferent(value, storedValue[key])) {
      setValue(storedValue[key])
    }
  })

  const storageOnChange = (storedValue: any, area: string) => {
    if ('sync' !== area) {
      return
    }

    if (!storedValue[key]) {
      return
    }

    if (isDifferent(value, storedValue[key].newValue)) {
      setValue(storedValue[key].newValue)
    }
  }

  const changeValue = (value: StateType) => {
    browser.storage.sync.set({
      [key]: value
    })
  }

  useEffect(() => {
    browser.storage.onChanged.addListener(storageOnChange)
    return () => {
      browser.storage.onChanged.removeListener(storageOnChange)
    }
  })
  return [value, changeValue] as const;
}

export {useStorageState}
