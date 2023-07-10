let template: string

async function bundleData(
  style: string,
  markup: string,
  title?: string
): Promise<Blob> {
  if (!template) {
    template = await cacheTemplate()
  }

  let html = template
  html = html.replace(/--\{--:title;\}/g, title || 'img-seq-pack')
  html = html.replace('--{--:style;}', style)
  html = html.replace('--{--:markup;}', markup)

  return new Blob([html], { type: 'text/html' })
}

async function cacheTemplate(): Promise<string> {
  const response = await fetch('/template/template.html')
  return await response.text()
}

export default bundleData
