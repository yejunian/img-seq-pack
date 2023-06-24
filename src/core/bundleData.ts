async function bundleData(data: string, title?: string): Promise<Blob> {
  const response = await fetch('/template/template.html')

  let html = await response.text()
  html = html.replace('[["title"]]', title || 'img-seq-pack')
  html = html.replace('[["data"]]', data)

  return new Blob([html], { type: 'text/html' })
}

export default bundleData
