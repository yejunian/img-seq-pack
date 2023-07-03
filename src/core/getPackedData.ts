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
    const { images, pages } = JSON.parse(jsonText) as PackedData

    for (let i = 0; i < images.length; i += 1) {
      if (
        typeof images[i] !== 'string' ||
        !images[i].startsWith('data:image/')
      ) {
        images[i] = ''
      }
    }

    for (let i = 0; i < pages.length; i += 1) {
      if (typeof pages[i] !== 'number') {
        pages[i] = -1
      }
    }

    return {
      images,
      pages,
    }
  } catch (error) {
    return {
      images: [],
      pages: [],
    }
  }
}

export default getPackedData
