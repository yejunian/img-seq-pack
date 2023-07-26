import TgaLoader from 'tga-js'
import type { MainOptions } from './MainOptions'

async function decodeImage(
  file: File,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  try {
    if (isTGAFile(file)) {
      return decodeByTgaLoader(file, options)
    } else {
      return await decodeByImageBitmap(file, options)
    }
  } catch (error) {
    console.warn(`${file.type} file will be decoded by fallback method.`)
    return await decodeByHTMLImageElement(file, options)
  }
}

function isTGAFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.tga') ||
    /^(?:application|image)\/(?:x-)?(?:targa|tga)$/i.test(file.type)
  )
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

async function decodeByImageBitmap(
  file: File,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(file)
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeByHTMLImageElement(
  file: File,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageURL = URL.createObjectURL(file)

  const img = document.createElement('img')
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject()
    img.src = imageURL
  })

  const imageBitmap = await window.createImageBitmap(img)
  URL.revokeObjectURL(imageURL)

  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
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
