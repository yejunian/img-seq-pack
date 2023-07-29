const fontURL =
  'https://cdn.jsdelivr.net/gh/sunn-us/SUIT@1.2.5/fonts/static/ttf/SUIT-ExtraBold.ttf'

let cached = ''

async function getFont(): Promise<string> {
  if (!cached) {
    try {
      const response = await fetch(fontURL)
      cached = convertToBase64(await response.arrayBuffer())
    } catch (error) {
      console.error(`Failed to fetch font from ${fontURL}`)
      cached = ''
    }
  }

  return cached
}

function convertToBase64(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer)
  let binary = ''

  for (let i = 0; i < buffer.byteLength; i += 1) {
    binary += String.fromCharCode(view[i])
  }

  return window.btoa(binary)
}

export default getFont
