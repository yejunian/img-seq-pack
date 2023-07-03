import type PackedData from './PackedData'
import strictQuerySelector from './strictQuerySelector'

function renderImageList({ images, pages }: PackedData): void {
  const contentsRoot = strictQuerySelector(document, '#contents')
  const olElement = document.createElement('ol')

  for (let i = 0; i < pages.length; i += 1) {
    const divElement = document.createElement('div')
    divElement.textContent = `${i + 1}.`

    const imgElement = document.createElement('img')
    imgElement.src = images[pages[i]] ?? ''

    const liElement = document.createElement('li')
    liElement.append(divElement, imgElement)

    olElement.appendChild(liElement)
  }

  contentsRoot.appendChild(olElement)
}

export default renderImageList
