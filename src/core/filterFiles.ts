export type FilterResult = {
  files: FileList
  discardedCount: number
  discardedCountsPerType: Map<string, number>
}

function filterFiles(files: FileList): FilterResult {
  const filtered = new DataTransfer()
  let discardedCount = 0
  const discardedCountsPerType = new Map<string, number>()

  for (const file of Array.from(files)) {
    if (isSupportedFile(file)) {
      filtered.items.add(file)
    } else {
      discardedCount += 1
      const dotPosition = file.name.lastIndexOf('.')
      const extension = dotPosition <= 0 ? '' : file.name.slice(dotPosition + 1)
      const prev = discardedCountsPerType.get(extension)
      discardedCountsPerType.set(extension, prev ? prev + 1 : 1)
    }
  }

  return {
    discardedCount,
    discardedCountsPerType,
    files: filtered.files,
  }
}

function isSupportedFile(file: File): boolean {
  const typePattern = /^image\/(?:jpeg|png|gif|webp|avif|svg\+xml|targa)/i
  const namePattern = /\.(?:jpe?g|png|gif|webp|avif|svg\+xml|tga)$/i

  return typePattern.test(file.type) || namePattern.test(file.name)
}

export default filterFiles
