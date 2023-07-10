import PackedData from './PackedData'

function prerenderData(data: PackedData): { style: string; markup: string } {
  const style = buildStyle(data)
  const markup = buildMarkup(data)

  return { style, markup }
}

function buildStyle({ images, widths, heights }: PackedData): string {
  let rules = ''

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index]
    const width = widths[index]
    const height = heights[index]

    rules += `.i${index}{--w:${width};--h:${height};--i:url("${image}");}\n`
  }

  return rules
}

function buildMarkup({ pages, names }: PackedData): string {
  const container = document.createElement('div')

  for (let index = 0; index < pages.length; index += 1) {
    const pageName = names[index]
    const imageIndex = pages[index]

    const headingElement = document.createElement('h2')
    headingElement.textContent = pageName

    const divElement = document.createElement('div')
    divElement.className = `i${imageIndex}`

    const articleElement = document.createElement('article')
    articleElement.append(headingElement, divElement)

    container.appendChild(articleElement)
  }

  return container.innerHTML
}

export default prerenderData
