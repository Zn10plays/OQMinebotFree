import { LGraphNode, LiteGraph } from 'litegraph.js'
import { getBot } from '../../renderer.js'

export const node = {
  category: 'Events',
  title: 'Chat',
  class: class Chat extends LGraphNode {
    constructor () {
      super('Chat')

      this.title = 'Chat'
      this.addInput('Execute Event', LiteGraph.EVENT)
      this.addOutput('Chat Event', LiteGraph.EVENT)
      this.addOutput('Chat Username', 'string')
      this.addOutput('Chat Message', 'string')
    }

    onAction () {
      getBot()?.on('chat', (username, message) => {
        this.setOutputData(1, username)
        this.setOutputData(2, message)
        this.triggerSlot(0, null)
      })
    }

    onRemoved () {
      getBot()?.removeAllListeners('messagestr')
    }
  }
}
