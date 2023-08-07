export type MainBooleanOptions = {
  'image-enlarge': boolean
  'keep-extension': boolean
  'page-description': boolean
  'page-number': boolean
  'page-sort': boolean
  'page-sort-natural': boolean
  'page-sort-split': boolean
  replace: boolean
  'replace-regex': boolean
}
export type MainNumberOptions = {
  'page-height': number
  'page-number-start': number
  'page-width': number
  'quality-jpeg': number
}
export type MainStringOptions = {
  'background-color': string
  'replace-find': string
  'replace-replace': string
  title: string
}
export type MainOptions = MainBooleanOptions &
  MainNumberOptions &
  MainStringOptions

export const defaultMainBooleanOptions: Readonly<MainBooleanOptions> = {
  'image-enlarge': true,
  'keep-extension': false,
  'page-description': false,
  'page-number': true,
  'page-sort': true,
  'page-sort-natural': true,
  'page-sort-split': true,
  replace: false,
  'replace-regex': false,
}
export const defaultMainNumberOptions: Readonly<MainNumberOptions> = {
  'page-height': 540,
  'page-number-start': 1,
  'page-width': 960,
  'quality-jpeg': 90,
}
export const defaultMainStringOptions: Readonly<MainStringOptions> = {
  'background-color': '#5e5e5e',
  'replace-find': '',
  'replace-replace': '',
  title: 'img-seq-pack',
}

const mainBooleanOptionsKeySet = new Set<keyof MainBooleanOptions>(
  Object.keys(defaultMainBooleanOptions) as (keyof MainBooleanOptions)[]
)
const mainNumberOptionsKeySet = new Set<keyof MainNumberOptions>(
  Object.keys(defaultMainNumberOptions) as (keyof MainNumberOptions)[]
)
const mainStringOptionsKeySet = new Set<keyof MainStringOptions>(
  Object.keys(defaultMainStringOptions) as (keyof MainStringOptions)[]
)
const mainOptionsKeySet = new Set<keyof MainOptions>([
  ...mainBooleanOptionsKeySet,
  ...mainNumberOptionsKeySet,
  ...mainStringOptionsKeySet,
])

export function isMainOptionsBooleanKey(
  key: unknown
): key is keyof MainBooleanOptions {
  return mainBooleanOptionsKeySet.has(key as keyof MainBooleanOptions)
}
export function isMainOptionsNumberKey(
  key: unknown
): key is keyof MainNumberOptions {
  return mainNumberOptionsKeySet.has(key as keyof MainNumberOptions)
}
export function isMainOptionsStringKey(
  key: unknown
): key is keyof MainStringOptions {
  return mainStringOptionsKeySet.has(key as keyof MainStringOptions)
}
export function isMainOptionsKey(key: unknown): key is keyof MainOptions {
  return mainOptionsKeySet.has(key as keyof MainOptions)
}
