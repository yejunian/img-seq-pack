declare module 'tga-js' {
  export default class TgaLoader {
    open(path: string | URL, callback: CallableFunction): void
    load(data: Uint8Array): void
    getImageData(imageData?: ImageData): ImageData
    getCanvas(): HTMLCanvasElement
    getDataURL(type?: string): string
  }
}
