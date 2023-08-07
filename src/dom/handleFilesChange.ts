import filterFiles from '../core/filterFiles'
import alertFilterResult from './alertFilterResult'
import updateSelectedFileList from './updateSelectedFileList'

function handleFilesChange(this: HTMLInputElement): void {
  const filtered = filterFiles(this.files ?? new FileList())
  if (filtered.discardedCount) {
    alertFilterResult(filtered)
  }

  this.files = filtered.files
  updateSelectedFileList(filtered.files)
}

export default handleFilesChange
