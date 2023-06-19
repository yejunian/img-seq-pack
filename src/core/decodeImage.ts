export type DecodeResult = {
  canvas: HTMLCanvasElement
  hash: string
}

const decodableTypes = {
  ImageBitmap: new Set(['image/avif', 'image/webp', 'image/jpeg', 'image/png']),
}

async function decodeImage(file: File): Promise<DecodeResult> {
  let decoded: DecodeResult

  if (decodableTypes.ImageBitmap.has(file.type)) {
    decoded = await decodeByImageBitmap(file)
  } else {
    throw new Error(`${file.type} is not supported.`)
  }

  return decoded
}

async function decodeByImageBitmap(file: File): Promise<DecodeResult> {
  const imageBitmap = await window.createImageBitmap(file)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  ctx?.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height)

  imageBitmap.close()

  const hash = file.name

  return { canvas, hash }
}

export default decodeImage
