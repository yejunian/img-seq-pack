import { NamedItemKVPairs } from './NamedItemKVPairs'
import PageMetadata from './PageMetadata'
import getCompareFunction from './getCompareFunction'
import splitFilename from './splitFilename'

function buildPageMetadata(
  fileList: FileList,
  options: NamedItemKVPairs
): PageMetadata {
  const {
    'page-sort': sortEnabled,
    'page-sort-natural': naturalSort,
    'page-sort-split': sortByNameFirst,

    'page-naming': pageNaming,
    'page-sequence-start': startingNumber,
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

  if (pageNaming === 'sequence') {
    for (let i = 0; i < metadata.length; i += 1) {
      metadata[i].name = `${startingNumber + i}`
    }
  } else if (pageNaming === 'filename') {
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
  } else {
    throw new Error(`Unknown page naming method: ${pageNaming}`)
  }

  return metadata
}

export default buildPageMetadata
