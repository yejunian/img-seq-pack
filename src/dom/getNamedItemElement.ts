function getNamedItemElement(
  form: HTMLFormElement,
  name: string
): HTMLInputElement {
  const item = form.elements.namedItem(name)

  if (item instanceof HTMLInputElement) {
    return item
  } else if (item instanceof RadioNodeList) {
    throw new Error(`"${name}" in "#${form.id}" is a RadioNodeList.`)
  } else {
    throw new Error(
      `"${name}" as an HTMLInputelement is not found in "#${form.id}".`
    )
  }
}

export default getNamedItemElement
