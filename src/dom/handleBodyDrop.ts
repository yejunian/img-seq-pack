import filterFiles from '../core/filterFiles'
import alertFilterResult from './alertFilterResult'
import updateSelectedFileList from './updateSelectedFileList'

function handleBodyDrop(event: DragEvent) {
  event.preventDefault()

  if (document.body.classList.contains('packing')) {
    return
  } else if (!event.dataTransfer?.files?.length) {
    return
  }

  const filtered = filterFiles(event.dataTransfer.files)
  if (filtered.discardedCount) {
    alertFilterResult(filtered)
  }

  const filesInput = document.forms
    .namedItem('app')
    ?.elements.namedItem('files')

  if (filesInput instanceof HTMLInputElement && filesInput.type === 'file') {
    filesInput.files = filtered.files
  }
  updateSelectedFileList(filtered.files)
}

export default handleBodyDrop
