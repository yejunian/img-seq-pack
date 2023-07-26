import getMainOptions from './getMainOptions'
import getNamedItemElement from './getNamedItemElement'
import ProgressUpdater from './ProgressUpdater'
import toggleFormEditability from './toggleFormEditability'

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

  const mainOptions = getMainOptions(this)

  const buildDocument = (await import('../core/buildDocument')).default
  await buildDocument(filesElement.files, mainOptions, progressUpdater)

  await progressUpdater.updateProgress(1)
  toggleFormEditability(this, true)
}

export default handleRootFormSubmit
