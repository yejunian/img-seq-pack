import sha1 from 'hash.js/lib/hash/sha/1'
import type PackedData from './PackedData'
import decodeImage from './decodeImage'
import { NamedItemKVPairs } from './NamedItemKVPairs'
import DataBuilder from './DataBuilder'
import ProgressUpdater from './ProgressUpdater'
import buildPageMetadata from './buildPageMetadata'

const imageDataKeys: (keyof ImageData)[] = ['width', 'height', 'data']

async function buildData(
  fileList: FileList,
  options: NamedItemKVPairs,
  progressUpdater?: ProgressUpdater
): Promise<PackedData> {
  const fileOrder = buildPageMetadata(fileList, options)
  const builder = new DataBuilder(options)

  for (let i = 0; i < fileOrder.length; i += 1) {
    const file = fileList[fileOrder[i].fileIndex]

    const canvas = await decodeImage(file, options)
    const looseHash = hashImageData(getImageData(canvas, 64, 64))

    if (builder.hasHash(looseHash)) {
      const imageIndex = builder.getImageIndex(looseHash)

      if (imageIndex !== DataBuilder.IMAGE_INDEX_TO_COLLISION) {
        const fileIndex = builder.getFirstFileIndex(imageIndex)
        const priorCanvas = await decodeImage(fileList[fileIndex], options)
        const priorImageData = getImageData(priorCanvas)
        const priorFullHash = hashImageData(priorImageData)

        builder.replaceCollidingHash(looseHash, priorFullHash)
      }

      const currentFullHash = hashImageData(getImageData(canvas))

      if (builder.hasHash(currentFullHash)) {
        const imageIndex = builder.getImageIndex(currentFullHash)
        builder.addPage(imageIndex)
      } else {
        const imageIndex = builder.registerHashAndCreateData(
          currentFullHash,
          canvas,
          i
        )
        builder.addPage(imageIndex)
      }
    } else {
      const imageIndex = builder.registerHashAndCreateData(looseHash, canvas, i)
      builder.addPage(imageIndex)
    }

    await progressUpdater?.updateProgress((i + 1) / fileList.length)
  }

  return builder.getData()
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
