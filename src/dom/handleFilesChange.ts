import strictQuerySelector from './strictQuerySelector'

function handleFilesChange(this: HTMLInputElement): void {
  const olElement = strictQuerySelector<HTMLOListElement>(
    document,
    '#file-list ol'
  )

  if (!this.files || this.files.length === 0) {
    for (const child of olElement.children) {
      child.remove()
    }
  } else {
    const liElements = []

    for (const { name } of this.files) {
      const liElement = document.createElement('li')
      liElement.textContent = name
      liElements.push(liElement)
    }

    olElement.replaceChildren(...liElements)
  }
}

export default handleFilesChange
