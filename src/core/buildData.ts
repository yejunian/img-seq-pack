import sha1 from 'hash.js/lib/hash/sha/1'
import type PackedData from './PackedData'
import decodeImage from './decodeImage'

const imageDataKeys: (keyof ImageData)[] = ['width', 'height', 'data']

async function buildData(fileList: FileList): Promise<PackedData> {
  const hashToRefIndex = new Map<string, number>()
  const imageRefs: string[] = []
  const refToFileIndex: number[] = []
  const pageList: number[] = []

  for (let i = 0; i < fileList.length; i += 1) {
    const canvas = await decodeImage(fileList[i])
    const looseHash = hashImageData(getImageData(canvas, 64, 64))

    if (hashToRefIndex.has(looseHash)) {
      const refIndex = hashToRefIndex.get(looseHash)!

      if (refIndex >= 0) {
        const fileIndex = refToFileIndex[refIndex]
        const priorCanvas = await decodeImage(fileList[fileIndex])
        const priorImageData = getImageData(priorCanvas)
        const priorFullHash = hashImageData(priorImageData)

        hashToRefIndex.set(priorFullHash, refIndex)
        hashToRefIndex.set(looseHash, -1)
      }

      const currentImageData = getImageData(canvas)
      const currentFullHash = hashImageData(currentImageData)

      if (hashToRefIndex.has(currentFullHash)) {
        const refIndex = hashToRefIndex.get(currentFullHash)!
        pageList.push(refIndex)
      } else {
        const refIndex = createNewImageRef(i, canvas, currentFullHash)
        pageList.push(refIndex)
      }
    } else {
      const refIndex = createNewImageRef(i, canvas, looseHash)
      pageList.push(refIndex)
    }
  }

  function createNewImageRef(
    fileIndex: number,
    canvas: HTMLCanvasElement,
    hash: string
  ): number {
    const refIndex = imageRefs.length

    hashToRefIndex.set(hash, refIndex)
    imageRefs.push(canvas.toDataURL('image/webp', 0.7))
    refToFileIndex.push(fileIndex)

    return refIndex
  }

  return { imageRefs, pageList }
}

function getImageData(
  source: HTMLCanvasElement,
  width?: number,
  height?: number
): ImageData {
  let canvas = source
  if (width && height && width > 0 && height > 0) {
    canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return new ImageData(canvas.width, canvas.height)
  }

  if (width && height) {
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function hashImageData(imageData: ImageData): string {
  const hashes: number[] = []

  for (const key of imageDataKeys) {
    const value = imageData[key]
    const sha = sha1()
    if (typeof value === 'number') {
      sha.update(value.toString(16), 'hex')
    } else {
      sha.update(value)
    }
    hashes.push(...sha.digest())
  }

  return sha1().update(hashes).digest('hex')
}

export default buildData
