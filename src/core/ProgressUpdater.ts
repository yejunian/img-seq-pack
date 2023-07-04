import strictQuerySelector from './strictQuerySelector'

class ProgressUpdater {
  private progressElement: HTMLElement
  private descriptionElement: HTMLElement
  private begin: number

  constructor(progressSelector: string, descriptionSelector: string) {
    this.progressElement = strictQuerySelector(document, progressSelector)
    this.descriptionElement = strictQuerySelector(document, descriptionSelector)
    this.begin = Date.now()
  }

  async updateProgress(progress: number): Promise<void> {
    const percentage = Math.floor(progress * 100)
    const seconds = Math.ceil((Date.now() - this.begin) / 1000)

    this.progressElement.setAttribute('value', progress.toString(10))
    this.descriptionElement.textContent = `${percentage}% (${seconds}초)`

    await Promise.resolve()
  }

  static async withUpdate(
    progressSelector: string,
    descriptionSelector: string,
    progress: number
  ): Promise<ProgressUpdater> {
    const updater = new ProgressUpdater(progressSelector, descriptionSelector)
    await updater.updateProgress(progress)

    return updater
  }
}

export default ProgressUpdater
