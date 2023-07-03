import type PackedData from './PackedData'

class DataBuilder {
  static IMAGE_INDEX_TO_COLLISION = -1
  static IMAGE_INDEX_TO_INVALID = -2

  private hashToImageIndex = new Map<string, number>()
  private images: string[] = []
  private imageIndexToFirstFileIndex: number[] = []
  private pageContents: number[] = []

  hasHash(hash: string): boolean {
    return this.hashToImageIndex.has(hash)
  }

  hasHashWithCollision(hash: string): boolean {
    return (
      this.hashToImageIndex.get(hash) === DataBuilder.IMAGE_INDEX_TO_COLLISION
    )
  }

  getImageIndex(hash: string): number {
    return this.hashToImageIndex.get(hash) ?? DataBuilder.IMAGE_INDEX_TO_INVALID
  }

  getFirstFileIndex(imageIndex: number): number {
    return this.imageIndexToFirstFileIndex[imageIndex]
  }

  replaceCollidingHash(oldHash: string, newHash: string): void {
    const imageIndex = this.getImageIndex(oldHash)
    this.hashToImageIndex.set(newHash, imageIndex)
    this.hashToImageIndex.set(oldHash, DataBuilder.IMAGE_INDEX_TO_COLLISION)
  }

  addPage(imageIndex: number): void {
    this.pageContents.push(imageIndex)
  }

  registerHashAndCreateData(
    hash: string,
    canvas: HTMLCanvasElement,
    fileIndex: number
  ): number {
    const imageIndex = this.images.length

    this.hashToImageIndex.set(hash, imageIndex)
    this.images.push(canvas.toDataURL('image/webp', 0.7))
    this.imageIndexToFirstFileIndex.push(fileIndex)

    return imageIndex
  }

  getData(): PackedData {
    return {
      images: [...this.images],
      pages: [...this.pageContents],
    }
  }
}

export default DataBuilder
