import buildData from './buildData'
import bundleData from './bundleData'
import downloadBlob from './downloadBlob'
import getNamedItemElement from './getNamedItemElement'
import { getNamedItemKVPairs } from './NamedItemKVPairs'
import toggleFormEditability from './toggleFormEditability'

async function handleRootFormSubmit(
  this: HTMLFormElement,
  event: SubmitEvent
): Promise<void> {
  event.preventDefault()

  toggleFormEditability(this, false)

  const filesElement = getNamedItemElement(this, 'files')
  if (!filesElement.files || filesElement.files.length === 0) {
    throw new Error('No file is selected.')
  }

  const namedItemKVPairs = getNamedItemKVPairs(this)

  const data = await buildData(filesElement.files, namedItemKVPairs)
  const blob = await bundleData(JSON.stringify(data), namedItemKVPairs.title)
  downloadBlob(blob, namedItemKVPairs.title)

  toggleFormEditability(this, true)
}

export default handleRootFormSubmit
