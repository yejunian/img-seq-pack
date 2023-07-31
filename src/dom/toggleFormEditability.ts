const inputTypes = new Set(['checkbox', 'file', 'number', 'radio', 'text'])

function toggleFormEditability(form: HTMLFormElement, activate: boolean): void {
  for (let i = 0; i < form.elements.length; i += 1) {
    const element = form.elements.item(i)
    if (element instanceof HTMLInputElement && inputTypes.has(element.type)) {
      element.disabled = !activate
    }
  }

  const packButton = form.elements.namedItem('button-pack')
  if (packButton && packButton instanceof HTMLButtonElement) {
    packButton.textContent = activate ? '변환하기' : '취소'
  }

  if (activate) {
    form.classList.remove('packing')
  } else {
    form.classList.add('packing')
  }
}

export default toggleFormEditability
