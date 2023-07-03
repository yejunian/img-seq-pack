import handleFilesChange from './core/handleFilesChange'
import handleRootFormSubmit from './core/handleRootFormSubmit'
import strictQuerySelector from './core/strictQuerySelector'
import './index.css'

function initialize(): void {
  const rootForm = strictQuerySelector<HTMLFormElement>(document, '#app')
  rootForm.addEventListener('submit', handleRootFormSubmit)

  const filesInput = rootForm.elements.namedItem('files')
  if (!filesInput || !(filesInput instanceof HTMLInputElement)) {
    throw new Error('"files" as HTMLInputElement is not found.')
  }
  filesInput.addEventListener('change', handleFilesChange)
}

initialize()
