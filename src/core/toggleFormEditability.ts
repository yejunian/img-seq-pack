const inputTypes = new Set(['checkbox', 'file', 'number', 'radio', 'text'])

function toggleFormEditability(form: HTMLFormElement, activate: boolean): void {
  for (let i = 0; i < form.elements.length; i += 1) {
    const element = form.elements.item(i)

    const isValidElement =
      (element instanceof HTMLInputElement && inputTypes.has(element.type)) ||
      (element instanceof HTMLButtonElement && element.type === 'submit')

    if (isValidElement) {
      element.disabled = !activate
    }
  }
}

export default toggleFormEditability
