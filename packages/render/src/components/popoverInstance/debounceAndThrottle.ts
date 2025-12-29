export default function debounceAndThrottle<T extends any[]>(
  cb: (...augment: T) => any,
  delay: number = 60,
) {
  let timer: number = 0
  let timer1: boolean = false

  const fn = (...augment: T) => {
    clearTimeout(timer)
    timer = setTimeout(cb, delay, ...augment)

    if (timer1) return
    timer1 = true
    cb(...augment)
    setTimeout(() => {
      timer1 = false
    }, delay)
  }

  return fn
}
