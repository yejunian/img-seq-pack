import getCompareFunction from './getCompareFunction'
import type { MainOptions } from './MainOptions'
import splitFilename from './splitFilename'

export type PageMetadata = PageMetadataEntry[]

export type PageMetadataEntry = {
  fileIndex: number
  name: string
}

export function buildPageMetadata(
  fileList: FileList,
  options: MainOptions
): PageMetadata {
  const {
    'page-sort': sortEnabled,
    'page-sort-natural': naturalSort,
    'page-sort-split': sortByNameFirst,

    'page-description': pageDescription,
    'keep-extension': keepExtension,
    replace: replaceEnabled,
    'replace-find': contentToFind,
    'replace-replace': contentToReplaceWith,
    'replace-regex': regexEnabled,
  } = options

  const metadata: PageMetadata = Array.from(fileList, (file, index) => ({
    fileIndex: index,
    name: file.name,
  }))

  if (sortEnabled) {
    metadata.sort(getCompareFunction(sortByNameFirst, naturalSort))
  }

  if (pageDescription) {
    const find =
      replaceEnabled && contentToFind && regexEnabled
        ? new RegExp(contentToFind)
        : contentToFind

    for (let i = 0; i < metadata.length; i += 1) {
      let { name } = metadata[i]

      if (!keepExtension) {
        name = splitFilename(name).basename
      }

      if (replaceEnabled && contentToFind) {
        name = name.replace(find, contentToReplaceWith)
      }

      metadata[i].name = name
    }
  }

  return metadata
}
