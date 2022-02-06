import { LGraphNode, LiteGraph } from 'litegraph.js'
import { getBot } from '../../renderer.js'

export const node = {
  category: 'Bot',
  title: 'Chat',
  class: class Chat extends LGraphNode {
    constructor () {
      super('Chat')

      this.title = 'Chat'
      this.addInput('Chat Event', LiteGraph.EVENT)
      this.addInput('Chat Message', 'string')
    }

    onAction () {
      if (this.getInputData(1) == null) return
      getBot()?.chat(this.getInputData(1))
    }
  }
}
