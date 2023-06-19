import handleRootFormSubmit from './core/handleRootFormSubmit'
import strictQuerySelector from './core/strictQuerySelector'
import './index.css'

function initialize(): void {
  const rootForm = strictQuerySelector<HTMLFormElement>(document, '#app')
  rootForm.addEventListener('submit', handleRootFormSubmit)
}

initialize()
