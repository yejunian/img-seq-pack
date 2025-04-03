import { applyDisabledProperties, getChildrenData } from './disabledProperties'

function handleRootFormClick(this: HTMLFormElement, event: MouseEvent) {
  if (
    event.target instanceof HTMLInputElement &&
    event.target.type === 'checkbox'
  ) {
    const children = getChildrenData(event.target)
    applyDisabledProperties(this, !event.target.checked, children)
  }
}

export default handleRootFormClick
