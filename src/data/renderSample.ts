import strictQuerySelector from '../core/strictQuerySelector'
import { images, names, pages, widths, heights } from '../data/sample.json'

function renderSample(): void {
  applySampleStyle()

  const mainElement = strictQuerySelector(document, 'main')
  mainElement.replaceChildren()

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const pageName = names[pageIndex]
    const imageIndex = pages[pageIndex]

    const h2Element = document.createElement('h2')
    h2Element.textContent = pageName

    const divElement = document.createElement('div')
    divElement.classList.add(`i${imageIndex}`)

    const articleElement = document.createElement('article')
    articleElement.append(h2Element, divElement)

    mainElement.append(articleElement)
  }
}

function applySampleStyle(): void {
  let styleRules = ''

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index]
    const width = widths[index]
    const height = heights[index]

    styleRules += `.i${index}{--w:${width};--h:${height};--i:url("${image}");}\n`
  }

  const styleElements = document.querySelectorAll('style')
  for (const styleElement of styleElements) {
    if (styleElement.textContent === '--{--:style;}') {
      styleElement.textContent = styleRules
    }
  }
}

export default renderSample
