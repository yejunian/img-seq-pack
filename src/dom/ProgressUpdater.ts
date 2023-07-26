import strictQuerySelector from './strictQuerySelector'

class ProgressUpdater {
  private progressElement: HTMLProgressElement
  private descriptionElement: HTMLElement
  private begin: number

  constructor(progressSelector: string, descriptionSelector: string) {
    this.progressElement = strictQuerySelector(document, progressSelector)
    this.descriptionElement = strictQuerySelector(document, descriptionSelector)
    this.begin = Date.now()
  }

  async update(progress: number): Promise<void> {
    const percentage = Math.floor(progress * 100)
    const seconds = Math.ceil((Date.now() - this.begin) / 1000)

    this.progressElement.value = progress
    this.descriptionElement.textContent = `${percentage}% (${seconds}초)`

    await Promise.resolve()
  }

  async complete(): Promise<void> {
    const seconds = Math.ceil((Date.now() - this.begin) / 1000)

    this.progressElement.value = 1
    this.descriptionElement.textContent = `완료 (${seconds}초)`

    await Promise.resolve()
  }

  async cancel(progress: number): Promise<void> {
    await this.update(progress)
    this.descriptionElement.textContent =
      '취소됨: ' + (this.descriptionElement.textContent ?? '')

    await Promise.resolve()
  }

  static async withUpdate(
    progressSelector: string,
    descriptionSelector: string,
    progress: number
  ): Promise<ProgressUpdater> {
    const updater = new ProgressUpdater(progressSelector, descriptionSelector)
    await updater.update(progress)

    return updater
  }
}

export default ProgressUpdater
