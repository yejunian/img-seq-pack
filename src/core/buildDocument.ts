import sha1 from 'hash.js/lib/hash/sha/1'
import type ProgressUpdater from '../dom/ProgressUpdater'
import decodeImage from './decodeImage'
import DocumentBuilder from './DocumentBuilder'
import getFont from './getFont'
import type { MainOptions } from './MainOptions'
import { buildPageMetadata } from './PageMetadata'

const imageDataKeys: (keyof ImageData)[] = ['width', 'height', 'data']

async function buildDocument(
  fileList: FileList,
  options: MainOptions,
  progressUpdater?: ProgressUpdater
): Promise<boolean> {
  const pageMetadata = buildPageMetadata(fileList, options)
  const builder = new DocumentBuilder({
    filename: options['title'],
    width: options['page-width'],
    height: options['page-height'],
    enlargeImage: options['image-enlarge'],
    jpegQuality: options['quality-jpeg'] / 100,
    backgroundColor: options['background-color'],
    pageNumber: options['page-number'],
    pageDescription: options['page-description'],
  })
  builder.addAndSetFont('SUIT-ExtraBold.ttf', await getFont(), 'SUIT', '', 800)

  if (progressUpdater && !(await progressUpdater.reset(0))) {
    return false
  }

  for (let i = 0; i < pageMetadata.length; i += 1) {
    const file = fileList[pageMetadata[i].fileIndex]

    let canvas: HTMLCanvasElement
    try {
      canvas = await decodeImage(file, options)
    } catch (error) {
      console.error(error)
      await progressUpdater?.cancel()
      alert(`"${file.name}" 파일을 읽을 수 없습니다.`)
      return false
    }

    const looseHash = hashImageData(getImageData(canvas, 64, 64))

    let imageIndex: number
    if (builder.hasHash(looseHash)) {
      imageIndex = builder.getImageIndex(looseHash)

      if (imageIndex !== DocumentBuilder.IMAGE_INDEX_TO_COLLISION) {
        const fileIndex = builder.getFirstFileIndex(imageIndex)
        const priorCanvas = await decodeImage(fileList[fileIndex], options)
        const priorImageData = getImageData(priorCanvas)
        const priorFullHash = hashImageData(priorImageData)

        builder.replaceCollidingHash(looseHash, priorFullHash)
      }

      const currentFullHash = hashImageData(getImageData(canvas))

      if (builder.hasHash(currentFullHash)) {
        imageIndex = builder.getImageIndex(currentFullHash)
      } else {
        imageIndex = await builder.registerImage(canvas, i)
        builder.registerHash(currentFullHash, imageIndex)
      }
    } else {
      imageIndex = await builder.registerImage(canvas, i)
      builder.registerHash(looseHash, imageIndex)
    }
    builder.addPage(imageIndex, {
      pageNumber: i + options['page-number-start'],
      description: pageMetadata[i].name,
    })

    if (
      progressUpdater &&
      !(await progressUpdater.update((i + 1) / (fileList.length + 1)))
    ) {
      return false
    }
  }

  builder.download()

  return true
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

export default buildDocument
