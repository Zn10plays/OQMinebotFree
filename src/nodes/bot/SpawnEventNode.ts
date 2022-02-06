import { LGraphNode, LiteGraph } from 'litegraph.js'

export const node = {
  category: 'Events',
  title: 'Spawn',
  class: class Spawn extends LGraphNode {
    constructor () {
      super('Spawn')

      this.title = 'Spawn'
      this.addInput('Spawn Event', LiteGraph.EVENT)
      this.addOutput('Execute Event', LiteGraph.EVENT)
    }

    onAction () {
      this.triggerSlot(0, null)
    }
  }
}
