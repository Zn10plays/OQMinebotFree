import { LGraphNode, LiteGraph } from 'litegraph.js'
import { createBot } from 'mineflayer'
import { assignBot } from '../../renderer.js'

export const node = {
  category: 'Bot',
  title: 'Create',
  class: class Create extends LGraphNode {
    constructor () {
      super('Create')

      this.title = 'Create'
      this.serialize_widgets = true
      this.properties = {
        username: 'Bot',
        password: '',
        host: 'localhost',
        port: '25565',
        version: ''
      }
      this.addWidget('text', 'Email/Username', this.properties.username, { property: 'username' } as any)
      this.addWidget('text', 'Password', this.properties.password, { property: 'password' } as any)
      this.addWidget('text', 'Host', this.properties.host, { property: 'host' } as any)
      this.addWidget('text', 'Port', this.properties.port, { property: 'port' } as any)
      this.addWidget('text', 'Version', this.properties.version, { property: 'version' } as any)
      this.addWidget('button', 'Start', '', () => this.onAction())
      this.addOutput('Spawn Event', LiteGraph.EVENT)
      this.addOutput('Error/Kicked Event', LiteGraph.EVENT)
      this.addOutput('Error/Kicked Message', 'string')
    }

    onAction () {
      let once = false
      const bot = createBot({
        username: this.properties.username ?? 'Bot',
        password: this.properties.password ?? null,
        host: this.properties.host ?? 'localhost',
        port: parseInt(this.properties.port ?? '25565'),
        version: this.properties.version ?? false
      })

      bot.on('error', (error) => {
        if (once) return
        this.setOutputData(2, error)
        this.triggerSlot(1, error)
        once = true
      })

      bot.on('kicked', (reason) => {
        this.setOutputData(2, reason)
        this.triggerSlot(1, reason)
      })

      bot.on('spawn', () => {
        assignBot(bot)
        this.triggerSlot(0, null)
      })
    }
  }
}
