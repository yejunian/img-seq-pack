import { FilterResult } from '../core/filterFiles'

function alertFilterResult({
  discardedCount,
  discardedCountsPerType,
  files,
}: FilterResult): void {
  const items = Array.from(discardedCountsPerType.entries())
    .sort(compareDiscardedTypeCounts)
    .reduce(
      (acc, [extension, count]) => `${acc}\n- *.${extension} 파일 ${count}개`,
      ''
    )

  const prevFileCount = files.length + discardedCount
  window.alert(
    `파일 ${prevFileCount}개 중 ${discardedCount}개가 선택에서 제외됩니다.\n${items}`
  )
}

function compareDiscardedTypeCounts(
  a: [string, number],
  b: [string, number]
): number {
  const diff = b[1] - a[1]

  if (diff === 0) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  } else {
    return diff
  }
}

export default alertFilterResult
