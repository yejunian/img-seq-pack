import getMainOptions from './getMainOptions'
import getNamedItemElement from './getNamedItemElement'
import ProgressUpdater from './ProgressUpdater'
import toggleFormEditability from './toggleFormEditability'

let progressUpdater: ProgressUpdater | null = null

async function handlePackButtonClick(this: HTMLButtonElement): Promise<void> {
  const form = this.form
  if (!form) {
    throw new Error("This pack button doesn't belong to the root form element.")
  }

  if (progressUpdater) {
    progressUpdater.cancel()
    progressUpdater = null
  } else {
    const filesElement = getNamedItemElement(form, 'files')
    if (!filesElement?.files?.length) {
      form.reportValidity()
      return
    }

    toggleFormEditability(form, false)

    const mainOptions = getMainOptions(form)

    progressUpdater = await ProgressUpdater.withUpdate(
      '#pack-progress',
      '#pack-description',
      0
    )
    const buildDocument = (await import('../core/buildDocument')).default

    if (await buildDocument(filesElement.files, mainOptions, progressUpdater)) {
      await progressUpdater.complete()
    }
  }

  progressUpdater = null
  toggleFormEditability(form, true)
}

export default handlePackButtonClick
