export default class Base<T extends HTMLElement | SVGSVGElement> {
  protected _root: T

  constructor(root: T) {
    this._root = root
  }

  root() {
    return this._root
  }
}
