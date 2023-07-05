import { NamedItemKVPairs } from './NamedItemKVPairs'
import TgaLoader from 'tga-js'

const decodableTypePatterns = {
  ImageBitmap: /^image\/(?:avif|gif|jpeg|png|webp)$/,
  TgaLoader: /^(?:application|image)\/(?:x-)?(?:targa|tga)$/,
}

async function decodeImage(
  file: File,
  options: NamedItemKVPairs
): Promise<HTMLCanvasElement> {
  if (decodableTypePatterns.ImageBitmap.test(file.type)) {
    return await decodeByImageBitmap(file, options)
  } else if (decodableTypePatterns.TgaLoader.test(file.type)) {
    return decodeByTgaLoader(file, options)
  } else {
    const extension = file.name.replace(/^.+\.(.+?)$/, '$1')
    throw new Error(`*.${extension} (${file.type}) is not supported.`)
  }
}

async function decodeByImageBitmap(
  file: File,
  options: NamedItemKVPairs
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(file)
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeByTgaLoader(
  file: File,
  options: NamedItemKVPairs
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(
    await decodeTargaIntoImageData(file)
  )
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeTargaIntoImageData(file: File): Promise<ImageData> {
  const tga = new TgaLoader()
  tga.load(new Uint8Array(await file.arrayBuffer()))
  return tga.getImageData()
}

function getCanvasFromImageBitmap(
  imageBitmap: ImageBitmap,
  options: NamedItemKVPairs
): HTMLCanvasElement {
  const [width, height] = getLimitedSize(
    imageBitmap.width,
    imageBitmap.height,
    options
  )

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  return canvas
}

function getLimitedSize(
  width: number,
  height: number,
  options: NamedItemKVPairs
): [number, number] {
  const {
    'max-size': enabled,
    'max-size-width': maxWidth,
    'max-size-height': maxHeight,
  } = options

  if (!enabled || (width <= maxWidth && height <= maxHeight)) {
    return [width, height]
  }

  const sourceRatio = width / height
  const maxRatio = maxWidth / maxHeight

  if (sourceRatio >= maxRatio) {
    return [maxWidth, maxWidth / sourceRatio]
  } else {
    return [maxHeight * sourceRatio, maxHeight]
  }
}

export default decodeImage
