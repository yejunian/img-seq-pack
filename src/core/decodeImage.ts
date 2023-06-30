const decodableTypes = {
  ImageBitmap: new Set(['image/avif', 'image/webp', 'image/jpeg', 'image/png']),
}

async function decodeImage(file: File): Promise<HTMLCanvasElement> {
  if (!decodableTypes.ImageBitmap.has(file.type)) {
    const extension = file.name.replace(/^.+\.(.+?)$/, '$1')
    throw new Error(`*.${extension} (${file.type}) is not supported.`)
  }

  return await decodeByImageBitmap(file)
}

async function decodeByImageBitmap(file: File): Promise<HTMLCanvasElement> {
  const imageBitmap = await window.createImageBitmap(file)
  const { width, height } = imageBitmap

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  imageBitmap.close()

  return canvas
}

export default decodeImage
