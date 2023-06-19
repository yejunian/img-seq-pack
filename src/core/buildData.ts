import decodeImage, { DecodeResult } from './decodeImage'

async function buildData(fileList: FileList) {
  const hashToImageIndex = new Map<string, number>()
  const imageRefs: string[] = []
  const pageList: number[] = []

  for (const file of fileList ?? []) {
    const { canvas, hash }: DecodeResult = await decodeImage(file)

    if (hashToImageIndex.has(hash)) {
      const dataIndex = hashToImageIndex.get(hash)!
      pageList.push(dataIndex)
    } else {
      const dataIndex = imageRefs.length
      hashToImageIndex.set(hash, dataIndex)
      imageRefs.push(canvas.toDataURL('image/webp', 0.7))
      pageList.push(dataIndex)
    }
  }

  return { imageRefs, pageList }
}

export default buildData
