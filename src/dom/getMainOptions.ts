import {
  defaultMainBooleanOptions,
  defaultMainNumberOptions,
  defaultMainStringOptions,
  isMainOptionsBooleanKey,
  isMainOptionsKey,
  isMainOptionsNumberKey,
  isMainOptionsStringKey,
  MainOptions,
} from '../core/MainOptions'

function getMainOptions(form: HTMLFormElement): MainOptions {
  const names = new Set<keyof MainOptions>()

  for (let i = 0; i < form.elements.length; i += 1) {
    const item = form.elements[i]

    if (item instanceof HTMLInputElement) {
      const name = item.name

      if (isMainOptionsKey(name)) {
        names.add(name)
      }
    }
  }

  const booleanPairs = { ...defaultMainBooleanOptions }
  const numberPairs = { ...defaultMainNumberOptions }
  const stringPairs = { ...defaultMainStringOptions }

  for (const name of names) {
    const item = form.elements.namedItem(name) as HTMLInputElement

    if (isMainOptionsBooleanKey(name)) {
      booleanPairs[name] = item.checked
    } else if (isMainOptionsNumberKey(name)) {
      const value = item.valueAsNumber
      if (Math.abs(value) <= Number.MAX_SAFE_INTEGER) {
        numberPairs[name] = value
      }
    } else if (isMainOptionsStringKey(name)) {
      stringPairs[name] = item.value
    }
  }

  return {
    ...booleanPairs,
    ...numberPairs,
    ...stringPairs,
  }
}

export default getMainOptions
