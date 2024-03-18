class IndexManager {
  private currentIndex: number
  constructor(startIndex: number = 1) {
    this.currentIndex = startIndex
  }

  getIndex() {
    return this.currentIndex++
  }
}

export default new IndexManager(1000)
