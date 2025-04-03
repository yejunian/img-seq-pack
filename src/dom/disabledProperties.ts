export function updateDisabledProperties(form: HTMLFormElement): void {
  for (let index = 0; index < form.elements.length; index += 1) {
    const item = form.elements[index]

    if (!(item instanceof HTMLInputElement)) {
      continue
    }

    if (item.type === 'checkbox') {
      const children = getChildrenData(item)
      applyDisabledProperties(form, !item.checked, children)
    }
  }
}

export function applyDisabledProperties(
  form: HTMLFormElement,
  disabled: boolean,
  names: string[]
): void {
  for (const name of names) {
    const item = form.elements.namedItem(name)

    if (!(item instanceof HTMLInputElement)) {
      continue
    }

    item.disabled = disabled
    if (item.type === 'checkbox' && (disabled || item.checked)) {
      const children = getChildrenData(item)
      applyDisabledProperties(form, disabled, children)
    }
  }
}

export function getChildrenData(element: HTMLInputElement): string[] {
  const childrenString = (element.dataset.children ?? '').trim()
  return childrenString ? childrenString.split(/\s+/) : []
}
