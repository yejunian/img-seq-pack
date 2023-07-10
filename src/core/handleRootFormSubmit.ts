import buildData from './buildData'
import bundleData from './bundleData'
import downloadBlob from './downloadBlob'
import getNamedItemElement from './getNamedItemElement'
import { getNamedItemKVPairs } from './NamedItemKVPairs'
import toggleFormEditability from './toggleFormEditability'
import ProgressUpdater from './ProgressUpdater'
import prerenderData from './prerenderData'

async function handleRootFormSubmit(
  this: HTMLFormElement,
  event: SubmitEvent
): Promise<void> {
  event.preventDefault()

  toggleFormEditability(this, false)
  const progressUpdater = await ProgressUpdater.withUpdate(
    '#pack-progress',
    '#pack-description',
    0
  )

  const filesElement = getNamedItemElement(this, 'files')
  if (!filesElement.files || filesElement.files.length === 0) {
    throw new Error('No file is selected.')
  }

  const namedItemKVPairs = getNamedItemKVPairs(this)

  const data = await buildData(
    filesElement.files,
    namedItemKVPairs,
    progressUpdater
  )
  const { style, markup } = prerenderData(data)
  const blob = await bundleData(style, markup, namedItemKVPairs.title)
  downloadBlob(blob, namedItemKVPairs.title)

  await progressUpdater.updateProgress(1)
  toggleFormEditability(this, true)
}

export default handleRootFormSubmit
