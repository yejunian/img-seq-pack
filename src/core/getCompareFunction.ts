import { PageMetadataEntry } from './PageMetadata'
import splitFilename from './splitFilename'

type CompareFunction = (a: string, b: string) => number

function getCompareFunction(
  sortByNameFirst: boolean,
  naturalSort: boolean
): (a: PageMetadataEntry, b: PageMetadataEntry) => number {
  let compare: CompareFunction = naturalSort
    ? new Intl.Collator(undefined, { numeric: true }).compare
    : compareByDefault

  if (sortByNameFirst) {
    compare = compareForFilenameWith(compare)
  }

  return function (a: PageMetadataEntry, b: PageMetadataEntry) {
    return compare(a.name, b.name)
  }
}

function compareForFilenameWith(
  compareForBasename: CompareFunction = compareByDefault
): CompareFunction {
  return function (a: string, b: string): number {
    const filenameA = splitFilename(a)
    const filenameB = splitFilename(b)

    const naturalBasenameComparison = compareForBasename(
      filenameA.basename,
      filenameB.basename
    )
    if (naturalBasenameComparison !== 0) {
      return naturalBasenameComparison
    }

    const basicBasenameComparison = compareByDefault(
      filenameA.basename,
      filenameB.basename
    )
    if (basicBasenameComparison !== 0) {
      return basicBasenameComparison
    }

    const extensionComparison = compareByDefault(
      filenameA.extension,
      filenameB.extension
    )
    if (extensionComparison !== 0) {
      return extensionComparison
    }

    return compareByDefault(a, b)
  }
}

function compareByDefault(a: string, b: string): number {
  if (a === b) {
    return 0
  } else if (a < b) {
    return -1
  } else {
    return 1
  }
}

export default getCompareFunction
