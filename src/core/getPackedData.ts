import type PackedData from './PackedData'
import strictQuerySelector from './strictQuerySelector'

async function getPackedData(): Promise<PackedData> {
  const dataElement = strictQuerySelector<HTMLScriptElement>(document, '#data')

  if (import.meta.env.DEV) {
    console.warn('Development Mode')

    try {
      const data = (await import('../data/sample.json')).default
      dataElement.textContent = JSON.stringify(data)
    } catch (error) {
      console.error(error)
    }
  }

  return parseAndValidateData(dataElement.textContent ?? '')
}

function parseAndValidateData(jsonText: string): PackedData {
  try {
    const { imageRefs, pageList } = JSON.parse(jsonText) as PackedData

    for (let i = 0; i < imageRefs.length; i += 1) {
      if (
        typeof imageRefs[i] !== 'string' ||
        !imageRefs[i].startsWith('data:image/')
      ) {
        imageRefs[i] = ''
      }
    }

    for (let i = 0; i < pageList.length; i += 1) {
      if (typeof pageList[i] !== 'number') {
        pageList[i] = -1
      }
    }

    return {
      imageRefs,
      pageList,
    }
  } catch (error) {
    return {
      imageRefs: [],
      pageList: [],
    }
  }
}

export default getPackedData
