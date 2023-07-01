function downloadBlob(blob: Blob, title?: string): void {
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = title ? `${title}.html` : 'img-seq-pack.html'
  anchor.click()

  URL.revokeObjectURL(url)
}

export default downloadBlob
