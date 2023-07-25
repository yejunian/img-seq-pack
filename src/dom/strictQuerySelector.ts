function strictQuerySelector<T extends Element>(
  element: Element | Document,
  selectors: string
): T {
  const selected = element.querySelector<T>(selectors)

  if (!selected) {
    throw new Error(`"${selectors}" is not found.`)
  }

  return selected
}

export default strictQuerySelector
