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
    const { images, pages, names } = JSON.parse(jsonText) as PackedData

    for (let i = 0; i < images.length; i += 1) {
      if (
        typeof images[i] !== 'string' ||
        !images[i].startsWith('data:image/')
      ) {
        images[i] = ''
      }
    }

    if (pages.length !== names.length) {
      names.length = pages.length
    }

    for (let i = 0; i < pages.length; i += 1) {
      if (typeof pages[i] !== 'number') {
        pages[i] = -1
      }

      if (typeof names[i] !== 'string') {
        names[i] = `(${i + 1})`
      }
    }

    return {
      images,
      pages,
      names,
    }
  } catch (error) {
    return {
      images: [],
      pages: [],
      names: [],
    }
  }
}

export default getPackedData
