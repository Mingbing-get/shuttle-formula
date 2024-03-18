export interface MessageData<T> {
  route: string
  executeId: string
  data: T
}

type RouterFunction<T> = (executeId: string, data: T) => Promise<void> | void

export default class MessageRouter {
  private routers: Record<string, RouterFunction<any>> = {}

  use<T>(route: string, fn: RouterFunction<T>) {
    this.routers[route] = fn
  }

  async onMessage<T>(messageData: MessageData<T>) {
    await this.routers[messageData.route]?.(
      messageData.executeId,
      messageData.data,
    )
  }
}
