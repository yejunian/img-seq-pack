import strictQuerySelector from './strictQuerySelector'

function updateSelectedFileList(files?: FileList | null): void {
  const olElement = strictQuerySelector<HTMLOListElement>(
    document,
    '#file-list'
  )

  if (!files || files.length === 0) {
    for (const child of olElement.children) {
      child.remove()
    }
  } else {
    const liElements = []

    for (const { name } of files) {
      const liElement = document.createElement('li')
      liElement.textContent = name
      liElements.push(liElement)
    }

    olElement.replaceChildren(...liElements)
  }
}

export default updateSelectedFileList
