export function sliceClass(
  dom: HTMLElement,
  excludes: string[],
  includes: string[],
) {
  excludes.forEach((item) => {
    if (dom.classList.contains(item)) {
      dom.classList.remove(item)
    }
  })

  includes.forEach((item) => {
    dom.classList.add(item)
  })
}

export function toggleClass(
  dom: HTMLElement,
  className: string,
  isAdd: boolean,
) {
  if (isAdd) {
    dom.classList.add(className)
  } else {
    dom.classList.remove(className)
  }
}
