import strictQuerySelector from './strictQuerySelector'

class ProgressUpdater {
  private progressElement: HTMLProgressElement
  private descriptionElement: HTMLElement
  private aborted: boolean
  private begin: number

  constructor(progressSelector: string, descriptionSelector: string) {
    this.progressElement = strictQuerySelector(document, progressSelector)
    this.descriptionElement = strictQuerySelector(document, descriptionSelector)
    this.aborted = false
    this.begin = Date.now()
  }

  async update(progress: number): Promise<boolean> {
    if (this.aborted) {
      return false
    }

    const percentage = Math.floor(progress * 100)
    const seconds = Math.ceil((Date.now() - this.begin) / 1000)

    this.progressElement.value = progress
    this.descriptionElement.textContent = `${percentage}% (${seconds}초)`

    await Promise.resolve()
    return true
  }

  async reset(progress: number): Promise<boolean> {
    if (this.aborted) {
      return false
    }

    this.begin = Date.now()

    return await this.update(progress)
  }

  async complete(): Promise<boolean> {
    if (this.aborted) {
      return false
    }

    const seconds = Math.ceil((Date.now() - this.begin) / 100) / 10

    this.progressElement.value = 1
    this.descriptionElement.textContent = `완료 (${seconds}초)`

    await Promise.resolve()
    return true
  }

  async cancel(): Promise<false> {
    this.aborted = true

    this.descriptionElement.textContent =
      '취소됨: ' + (this.descriptionElement.textContent ?? '')

    await Promise.resolve()
    return false
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
