import buildData from './buildData'
import bundleData from './bundleData'
import downloadBlob from './downloadBlob'
import { getNamedItemElement } from './getNamedItem'

async function handleRootFormSubmit(
  this: HTMLFormElement,
  event: SubmitEvent
): Promise<void> {
  event.preventDefault()

  const filesElement = getNamedItemElement(this, 'files')
  if (!filesElement.files) {
    throw new Error('No file is selected.')
  }

  const data = await buildData(filesElement.files)
  const blob = await bundleData(JSON.stringify(data))
  downloadBlob(blob)
}

export default handleRootFormSubmit
