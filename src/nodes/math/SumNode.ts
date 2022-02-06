import { LGraphNode } from 'litegraph.js'

export const node = {
  category: 'Math',
  title: 'Sum',
  class: class Sum extends LGraphNode {
    constructor () {
      super('Sum')

      this.title = 'Sum'
      this.addInput('A', 'number')
      this.addInput('B', 'number')
      this.addOutput('A + B', 'number')
    }

    onExecute () {
      let A = this.getInputData(0)
      if (!A) A = 0
      let B = this.getInputData(1)
      if (!B) B = 0
      this.setOutputData(0, A + B)
    }
  }
}
