import getPackedData from './core/getPackedData'
import renderImageList from './core/renderImageList'
import './template.css'

async function initialize(): Promise<void> {
  renderImageList(await getPackedData())
}

initialize()
