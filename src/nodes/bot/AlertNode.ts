import { LGraphNode, LiteGraph } from 'litegraph.js'
import { ipcRenderer } from 'electron'

export const node = {
  category: 'Notifications',
  title: 'Alert',
  class: class Alert extends LGraphNode {
    constructor () {
      super('Alert')

      this.title = 'Alert'
      this.addInput('Alert Event', LiteGraph.EVENT)
      this.addInput('Alert Message', 'string')
      this.addOutput('Execute Event', LiteGraph.EVENT)
      this.addOutput('Execute Message', 'string')
    }

    onAction () {
      if (this.getInputData(1) == null) return

      ipcRenderer.send('notification', {
        title: 'Alert',
        body: this.getInputData(1).toString(),
        silent: false
      })

      this.setOutputData(1, this.getInputData(1).toString())
      this.triggerSlot(0, null)
    }
  }
}
