import imageCompression from 'browser-image-compression'
import jsPDF, { TextOptionsLight } from 'jspdf'
import type ImageInfo from './ImageInfo'

type RenderArea = {
  x: number
  y: number
  width: number
  height: number
}

type PageOptions = {
  pageNumber: number
  description: string
}

type BuilderOptions = {
  filename: string
  width: number
  height: number
  enlargeImage: boolean
  jpegQuality: number
  backgroundColor: string
  pageNumber: boolean
  pageDescription: boolean
}

class DocumentBuilder {
  static readonly IMAGE_INDEX_TO_COLLISION = -1
  static readonly IMAGE_INDEX_TO_INVALID = -2

  static readonly DEFAULT_OPTIONS: Readonly<BuilderOptions> = {
    filename: 'img-seq-pack',
    width: 960,
    height: 540,
    enlargeImage: true,
    jpegQuality: 0.9,
    backgroundColor: '#5e5e5e',
    pageNumber: true,
    pageDescription: false,
  }

  static readonly COLOR_BLACK = '#000000'
  static readonly COLOR_WHITE = '#ffffff'
  static readonly IMAGE_MAX_SIZE = 65535
  static readonly DESCRIPTION_TEXT_OPTIONS: Readonly<TextOptionsLight> = {
    baseline: 'middle',
  }
  static readonly PAGE_NUMBER_OPTIONS_FILL: Readonly<TextOptionsLight> = {
    align: 'right',
    baseline: 'top',
  }
  static readonly PAGE_NUMBER_OPTIONS_STROKE: Readonly<TextOptionsLight> = {
    ...DocumentBuilder.PAGE_NUMBER_OPTIONS_FILL,
    renderingMode: 'stroke',
  }

  private hashToImageIndex = new Map<string, number>()
  private images: ImageInfo[] = []
  private imageIndexToFirstFileIndex: number[] = []

  private doc: jsPDF

  private options: BuilderOptions = { ...DocumentBuilder.DEFAULT_OPTIONS }

  private readonly shortSide: number
  private readonly descriptionHeight: number
  private readonly descriptionFontSize: number
  private readonly descriptionPosition: Readonly<[number, number]>
  private readonly pageNumberFontSize: number
  private readonly pageNumberLineWidth: number
  private readonly pageNumberPosition: Readonly<[number, number]>
  private readonly pageBackgroundRect: Readonly<
    [number, number, number, number]
  >

  constructor(options: Partial<BuilderOptions>) {
    this.overrideOptions(options)

    this.shortSide = Math.min(this.options.width, this.options.height)
    this.descriptionHeight = this.options.pageDescription
      ? (5 / 64) * this.shortSide // 7.8125vmin
      : 0
    this.descriptionFontSize = (3 / 4) * this.descriptionHeight
    this.descriptionPosition = [
      (1 / 4) * this.descriptionHeight,
      (1 / 2) * this.descriptionHeight,
    ]

    const pageHeight = this.options.height + this.descriptionHeight

    this.pageNumberFontSize = (3 / 32) * this.shortSide // 9.375vmin
    this.pageNumberLineWidth = (1 / 64) * this.shortSide // 1.5625vmin
    this.pageNumberPosition = [
      (15 / 16) * this.options.width, // 93.75vw
      (1 / 16) * this.options.height + this.descriptionHeight, // 6.25vh
    ]
    this.pageBackgroundRect = [-2, -2, this.options.width + 4, pageHeight + 4]

    this.doc = new jsPDF({
      orientation: this.options.width >= pageHeight ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [this.options.width, pageHeight],
    })
      .deletePage(1)
      .setFont('Helvetica', '', 'Bold')
  }

  private overrideOptions({
    filename,
    width,
    height,
    enlargeImage,
    jpegQuality,
    backgroundColor,
    pageNumber,
    pageDescription,
  }: Partial<BuilderOptions>): void {
    let trimmedTitle = filename && filename.trim()
    if (filename && trimmedTitle && !trimmedTitle.startsWith('.')) {
      this.options.filename = trimmedTitle
    }
    if (width && width >= 1 && width <= DocumentBuilder.IMAGE_MAX_SIZE) {
      this.options.width = width
    }
    if (height && height >= 1 && height <= DocumentBuilder.IMAGE_MAX_SIZE) {
      this.options.height = height
    }
    if (typeof enlargeImage === 'boolean') {
      this.options.enlargeImage = enlargeImage
    }
    if (
      typeof jpegQuality === 'number' &&
      jpegQuality >= 0 &&
      jpegQuality <= 1
    ) {
      this.options.jpegQuality = jpegQuality
    }
    if (backgroundColor) {
      this.options.backgroundColor = backgroundColor
    }
    if (typeof pageNumber === 'boolean') {
      this.options.pageNumber = pageNumber
    }
    if (typeof pageDescription === 'boolean') {
      this.options.pageDescription = pageDescription
    }
  }

  hasHash(hash: string): boolean {
    return this.hashToImageIndex.has(hash)
  }

  hasHashWithCollision(hash: string): boolean {
    return (
      this.hashToImageIndex.get(hash) === DocumentBuilder.IMAGE_INDEX_TO_COLLISION
    )
  }

  getImageIndex(hash: string): number {
    return this.hashToImageIndex.get(hash) ?? DocumentBuilder.IMAGE_INDEX_TO_INVALID
  }

  getFirstFileIndex(imageIndex: number): number {
    return this.imageIndexToFirstFileIndex[imageIndex]
  }

  replaceCollidingHash(oldHash: string, newHash: string): void {
    const imageIndex = this.getImageIndex(oldHash)
    this.hashToImageIndex.set(newHash, imageIndex)
    this.hashToImageIndex.set(oldHash, DocumentBuilder.IMAGE_INDEX_TO_COLLISION)
  }

  addPage(
    imageIndex: number,
    { pageNumber, description }: Partial<PageOptions> = {}
  ): void {
    const image = this.images[imageIndex]

    this.doc
      .addPage()
      .setFillColor(DocumentBuilder.COLOR_BLACK)
      .rect(...this.pageBackgroundRect, 'F')

    if (this.options.pageDescription && description) {
      this.doc
        .setFontSize(this.descriptionFontSize)
        .setTextColor(DocumentBuilder.COLOR_WHITE)
        .text(
          description,
          ...this.descriptionPosition,
          DocumentBuilder.DESCRIPTION_TEXT_OPTIONS
        )
    }

    this.doc.addImage(
      image.binary,
      image.format,
      image.x,
      image.y + this.descriptionHeight,
      image.width,
      image.height,
      `${imageIndex}`
    )

    if (this.options.pageNumber && pageNumber) {
      this.doc
        .setFontSize(this.pageNumberFontSize)
        .setLineWidth(this.pageNumberLineWidth)
        .setDrawColor(DocumentBuilder.COLOR_WHITE)
        .setTextColor(DocumentBuilder.COLOR_BLACK)
        .text(
          `${pageNumber}`,
          ...this.pageNumberPosition,
          DocumentBuilder.PAGE_NUMBER_OPTIONS_STROKE
        )
        .text(
          `${pageNumber}`,
          ...this.pageNumberPosition,
          DocumentBuilder.PAGE_NUMBER_OPTIONS_FILL
        )
    }
  }

  async registerImage(
    canvas: HTMLCanvasElement,
    fileIndex: number
  ): Promise<number> {
    const imageIndex = this.images.length

    this.images.push(await this.getImageInfo(canvas))
    this.imageIndexToFirstFileIndex.push(fileIndex)

    return imageIndex
  }

  private async getImageInfo(canvas: HTMLCanvasElement): Promise<ImageInfo> {
    const opaqueCanvas = this.getOpaqueCanvas(canvas)
    const lossless = await imageCompression.canvasToFile(
      opaqueCanvas,
      'image/png',
      '',
      0
    )
    const lossy = await imageCompression.canvasToFile(
      opaqueCanvas,
      'image/jpeg',
      '',
      0,
      this.options.jpegQuality
    )

    if (lossless.size <= lossy.size * 1.1) {
      return {
        ...this.getRenderArea(canvas),
        binary: new Uint8Array(await lossless.arrayBuffer()),
        format: 'PNG',
      }
    } else {
      return {
        ...this.getRenderArea(canvas),
        binary: new Uint8Array(await lossy.arrayBuffer()),
        format: 'JPEG',
      }
    }
  }

  private getOpaqueCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const opaqueCanvas = document.createElement('canvas')
    opaqueCanvas.width = canvas.width
    opaqueCanvas.height = canvas.height

    const ctx = opaqueCanvas.getContext('2d')
    if (!ctx) {
      return canvas
    }

    ctx.fillStyle = this.options.backgroundColor
    ctx.fillRect(-2, -2, canvas.width + 4, canvas.height + 4)

    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)

    return opaqueCanvas
  }

  private getRenderArea(canvas: HTMLCanvasElement): RenderArea {
    const { width: pageWidth, height: pageHeight } = this.options

    let imageWidth: number
    let imageHeight: number

    if (this.options.enlargeImage) {
      const canvasRatio = canvas.width / canvas.height
      const pageRatio = pageWidth / pageHeight

      if (canvasRatio >= pageRatio) {
        imageWidth = pageWidth
        imageHeight = pageWidth / canvasRatio
      } else {
        imageWidth = pageHeight * canvasRatio
        imageHeight = pageHeight
      }
    } else {
      imageWidth = canvas.width
      imageHeight = canvas.height
    }

    return {
      x: (pageWidth - imageWidth) / 2,
      y: (pageHeight - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
    }
  }

  registerHash(hash: string, imageIndex: number): void {
    this.hashToImageIndex.set(hash, imageIndex)
  }

  download(): void {
    this.doc.save(`${this.options.filename}.pdf`)
  }
}

export default DocumentBuilder
