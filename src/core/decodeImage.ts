import { NamedItemKVPairs } from './NamedItemKVPairs'

const decodableTypes = {
  ImageBitmap: new Set(['image/avif', 'image/webp', 'image/jpeg', 'image/png']),
}

async function decodeImage(
  file: File,
  options: NamedItemKVPairs
): Promise<HTMLCanvasElement> {
  if (!decodableTypes.ImageBitmap.has(file.type)) {
    const extension = file.name.replace(/^.+\.(.+?)$/, '$1')
    throw new Error(`*.${extension} (${file.type}) is not supported.`)
  }

  return await decodeByImageBitmap(file, options)
}

async function decodeByImageBitmap(
  file: File,
  options: NamedItemKVPairs
): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(file)
  const { width: sourceWidth, height: sourceHeight } = imageBitmap
  const [width, height] = getLimitedSize(sourceWidth, sourceHeight, options)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  imageBitmap.close()

  return canvas
}

function getLimitedSize(
  width: number,
  height: number,
  options: NamedItemKVPairs
): [number, number] {
  const {
    'max-size-enabled': enabled,
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
