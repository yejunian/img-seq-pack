import sha1 from 'hash.js/lib/hash/sha/1'

export type DecodeResult = {
  canvas: HTMLCanvasElement
  hash: string
}

const decodableTypes = {
  ImageBitmap: new Set(['image/avif', 'image/webp', 'image/jpeg', 'image/png']),
}

const imageDataKeys: (keyof ImageData)[] = ['width', 'height', 'data']

async function decodeImage(file: File): Promise<DecodeResult> {
  let decoded: DecodeResult

  if (decodableTypes.ImageBitmap.has(file.type)) {
    decoded = await decodeByImageBitmap(file)
  } else {
    const extension = file.name.replace(/^.+\.(.+?)$/, '$1')
    throw new Error(`*.${extension} (${file.type}) is not supported.`)
  }

  return decoded
}

async function decodeByImageBitmap(file: File): Promise<DecodeResult> {
  const imageBitmap = await window.createImageBitmap(file)
  const { width, height } = imageBitmap

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  imageBitmap.close()

  const imageData =
    ctx?.getImageData(0, 0, canvas.width, canvas.height) ??
    new ImageData(canvas.width, canvas.height)
  const hash = hashImageData(imageData)

  return { canvas, hash }
}

function hashImageData(imageData: ImageData): string {
  const hashes: number[] = []

  for (const key of imageDataKeys) {
    const value = imageData[key]
    const messageDigest = sha1()
    if (typeof value === 'number') {
      messageDigest.update(value.toString(16), 'hex')
    } else {
      messageDigest.update(value)
    }
    hashes.push(...messageDigest.digest())
  }

  return sha1().update(hashes).digest('hex')
}

export default decodeImage
