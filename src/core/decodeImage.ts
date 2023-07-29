import TgaLoader from 'tga-js'
import type { MainOptions } from './MainOptions'

async function decodeImage(
  file: File,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  try {
    if (isTGAFile(file)) {
      return decodeByTgaLoader(file, options)
    } else if (isSVGFile(file)) {
      const scaledSVGBlob = await get4xScaledSVGBlob(file)
      return await decodeByHTMLImageElement(scaledSVGBlob, options)
    }
  } catch (error) {
    console.error(error)
    console.warn(`Failed to decode "${file.name}" as "${file.type}" type`)
  }

  try {
    return await decodeByImageBitmap(file, options)
  } catch (error) {
    console.error(error)
    console.warn(`"${file.type}" type file will be decoded by fallback method.`)
    return await decodeByHTMLImageElement(file, options)
  }
}

function isTGAFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.tga') ||
    /^(?:application|image)\/(?:x-)?(?:targa|tga)$/i.test(file.type)
  )
}

function isSVGFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.svg') ||
    file.type.toLowerCase().includes('image/svg+xml')
  )
}

async function decodeByTgaLoader(
  blob: Blob,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(
    await decodeTargaIntoImageData(blob)
  )
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeTargaIntoImageData(blob: Blob): Promise<ImageData> {
  const tga = new TgaLoader()
  tga.load(new Uint8Array(await blob.arrayBuffer()))
  return tga.getImageData()
}

async function get4xScaledSVGBlob(file: File): Promise<Blob> {
  const svgElement = new DOMParser()
    .parseFromString(await file.text(), 'image/svg+xml')
    .getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')[0]

  if (svgElement.getAttribute('width') && svgElement.getAttribute('height')) {
    return file
  }

  const viewBox = svgElement.getAttribute('viewBox')
  if (!viewBox) {
    throw new Error(`Cannot read the dimension of "${file.name}"`)
  }

  const [, , width, height] = viewBox.trim().split(/\s+/)
  svgElement.setAttribute('width', width)
  svgElement.setAttribute('height', height)

  return new Blob([svgElement.outerHTML], { type: 'image/svg+xml' })
}

async function decodeByImageBitmap(
  blob: Blob,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(blob)
  const canvas = getCanvasFromImageBitmap(imageBitmap, options)
  imageBitmap.close()

  return canvas
}

async function decodeByHTMLImageElement(
  blob: Blob,
  options: MainOptions
): Promise<HTMLCanvasElement> {
  const imageURL = URL.createObjectURL(blob)

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
