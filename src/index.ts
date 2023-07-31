import handleFilesChange from './dom/handleFilesChange'
import handlePackButtonClick from './dom/handlePackButtonClick'
import strictQuerySelector from './dom/strictQuerySelector'
import './index.css'

function initialize(): void {
  const rootForm = strictQuerySelector<HTMLFormElement>(document, '#app')

  const packButton = rootForm.elements.namedItem('button-pack')
  if (!packButton || !(packButton instanceof HTMLButtonElement)) {
    throw new Error('"button-pack" as HTMLButtonElement is not found.')
  }
  packButton.addEventListener('click', handlePackButtonClick)

  const filesInput = rootForm.elements.namedItem('files')
  if (!filesInput || !(filesInput instanceof HTMLInputElement)) {
    throw new Error('"files" as HTMLInputElement is not found.')
  }
  filesInput.addEventListener('change', handleFilesChange)
}

initialize()
