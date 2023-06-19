function downloadBlob(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename ? `${filename}.html` : 'img-seq-pack.html'
  anchor.click()

  URL.revokeObjectURL(url)
}

export default downloadBlob
