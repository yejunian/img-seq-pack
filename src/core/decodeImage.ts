import TgaLoader from 'tga-js'
import type { MainOptions } from './MainOptions'

const decodableTypePatterns = {
  ImageBitmap: /^image\/(?:avif|gif|jpeg|png|webp)$/,
  TgaLoader: /^(?:application|image)\/(?:x-)?(?:targa|tga)$/,
}

async function decodeImage(
  file: File,
  options: MainOptions
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
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(file)
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeByTgaLoader(
  file: File,
  options: MainOptions
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
  options: MainOptions
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
  options: MainOptions
): [number, number] {
  const { 'page-width': pageWidth, 'page-height': pageHeight } = options

  if (width <= pageWidth && height <= pageHeight) {
    return [width, height]
  }

  const sourceRatio = width / height
  const pageRatio = pageWidth / pageHeight

  if (sourceRatio >= pageRatio) {
    return [pageWidth, pageWidth / sourceRatio]
  } else {
    return [pageHeight * sourceRatio, pageHeight]
  }
}

export default decodeImage
