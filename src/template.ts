import './template.css'

async function initialize(): Promise<void> {
  if (import.meta.env.DEV) {
    console.warn('Development Mode')

    const renderSample = (await import('./data/renderSample')).default
    renderSample()
  }
}

initialize()
