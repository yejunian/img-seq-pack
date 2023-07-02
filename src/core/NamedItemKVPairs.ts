type NamedBooleanKVPairs = {
  'max-size-enabled': boolean
  'page-sort-enabled': boolean
}
type NamedNumberKVPairs = {
  'max-size-height': number
  'max-size-width': number
  'quality-webp': number
}
type NamedStringKVPairs = {
  'page-name': string
  title: string
}
export type NamedItemKVPairs = NamedBooleanKVPairs &
  NamedNumberKVPairs &
  NamedStringKVPairs

type NamedBooleanKey = keyof NamedBooleanKVPairs
type NamedNumberKey = keyof NamedNumberKVPairs
type NamedStringKey = keyof NamedStringKVPairs
export type NamedItemKey = keyof NamedItemKVPairs

const namedBooleanKeySet = new Set<NamedBooleanKey>([
  'max-size-enabled',
  'page-sort-enabled',
])
const namedNumberKeySet = new Set<NamedNumberKey>([
  'max-size-height',
  'max-size-width',
  'quality-webp',
])
const namedStringKeySet = new Set<NamedStringKey>(['page-name', 'title'])
export const namedItemKeySet = new Set<NamedItemKey>([
  ...namedBooleanKeySet,
  ...namedNumberKeySet,
  ...namedStringKeySet,
])

export function getNamedItemKVPairs(form: HTMLFormElement): NamedItemKVPairs {
  const names = new Set<NamedItemKey>()

  for (let i = 0; i < form.elements.length; i += 1) {
    const item = form.elements[i]

    if (item instanceof HTMLInputElement) {
      const name = item.name as NamedItemKey

      if (namedItemKeySet.has(name)) {
        names.add(name)
      }
    }
  }

  const booleanPairs = getDefaultNamedBooleanKVPairs()
  const numberPairs = getDefaultNamedNumberKVPairs()
  const stringPairs = getDefaultNamedStringKVPairs()

  for (const name of names) {
    const item = form.elements.namedItem(name) as HTMLInputElement

    if (isNamedBooleanKey(name)) {
      booleanPairs[name] = item.checked
    } else if (isNamedNumberKey(name)) {
      numberPairs[name] = item.valueAsNumber
    } else if (isNamedStringKey(name)) {
      stringPairs[name] = item.value
    }
  }

  return {
    ...booleanPairs,
    ...numberPairs,
    ...stringPairs,
  }
}

function getDefaultNamedBooleanKVPairs(): NamedBooleanKVPairs {
  return {
    'max-size-enabled': true,
    'page-sort-enabled': true,
  }
}
function getDefaultNamedNumberKVPairs(): NamedNumberKVPairs {
  return {
    'max-size-height': 960,
    'max-size-width': 540,
    'quality-webp': 70,
  }
}
function getDefaultNamedStringKVPairs(): NamedStringKVPairs {
  return {
    'page-name': 'filename-only',
    title: '',
  }
}

function isNamedBooleanKey(key: unknown): key is NamedBooleanKey {
  return namedBooleanKeySet.has(key as NamedBooleanKey)
}
function isNamedNumberKey(key: unknown): key is NamedNumberKey {
  return namedNumberKeySet.has(key as NamedNumberKey)
}
function isNamedStringKey(key: unknown): key is NamedStringKey {
  return namedStringKeySet.has(key as NamedStringKey)
}
