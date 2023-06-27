import type PackedData from './PackedData'
import strictQuerySelector from './strictQuerySelector'

function renderImageList({ imageRefs, pageList }: PackedData): void {
  const contentsRoot = strictQuerySelector(document, '#contents')
  const olElement = document.createElement('ol')

  for (let i = 0; i < pageList.length; i += 1) {
    const divElement = document.createElement('div')
    divElement.textContent = `${i + 1}.`

    const imgElement = document.createElement('img')
    imgElement.src = imageRefs[pageList[i]] ?? ''

    const liElement = document.createElement('li')
    liElement.append(divElement, imgElement)

    olElement.appendChild(liElement)
  }

  contentsRoot.appendChild(olElement)
}

export default renderImageList
