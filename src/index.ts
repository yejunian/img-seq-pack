import { updateDisabledProperties } from './dom/disabledProperties'
import handleBodyDrop from './dom/handleBodyDrop'
import handleFilesChange from './dom/handleFilesChange'
import handlePackButtonClick from './dom/handlePackButtonClick'
import handleRootFormClick from './dom/handleRootFormClick'
import strictQuerySelector from './dom/strictQuerySelector'
import './index.css'

function initialize(): void {
  const rootForm = strictQuerySelector<HTMLFormElement>(document, '#app')
  updateDisabledProperties(rootForm)
  rootForm.addEventListener('click', handleRootFormClick)

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

  document.body.addEventListener('dragover', (event) => event.preventDefault())
  document.body.addEventListener('drop', handleBodyDrop)
}

initialize()
