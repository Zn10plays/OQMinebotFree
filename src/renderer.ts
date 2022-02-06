import { LiteGraph, LGraphCanvas, LGraphNode, ContextMenuItem, LGraphGroup } from 'litegraph.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Bot } from 'mineflayer'

render()
async function render () {
  const folders = readdirSync(join(__dirname, 'nodes'))
  for (const folder of folders) {
    const files = readdirSync(join(__dirname, 'nodes', folder))
    for (const file of files) {
      const node = (await import(join(__dirname, 'nodes', folder, file))).node
      LiteGraph.registerNodeType(`${node.category}/${node.title}`, node.class)
    }
  }

  const ignoredCategories = [
    'graph',
    'events',
    'network',
    'audio',
    'midi',
    'geometry',
    'color',
    'graphics',
    'logic',
    'math3d',
    'input'
  ]
  
  const ignoredNodes = [
    'Combo',
    'Const File',
    'Const Data',
    'Table[row][col]',
    'Object property',
    'Merge Objects',
    'Watch',
    'Cast',
    'Download',
    'Data Store',
    'Knob',
    'H.Slider',
    'Panel'
  ]

  LGraphCanvas.prototype.getCanvasMenuOptions = () => {
    return [
      {
        content: 'Add Node',
        has_submenu: true,
        callback: LGraphCanvas.onMenuAdd
      },
      {
        content: 'Add Group',
        callback: LGraphCanvas.onGroupAdd
      }
    ]
  }

  LGraphCanvas.onMenuAdd = (node, options, ev, prevMenu, callback) => {
    const canvas = LGraphCanvas.active_canvas as any
    const refWindow = canvas.getCanvasWindow()
    const graph = canvas.graph
    if (graph == null) return
  
    function onMenuAdded (baseCategory: string, prevMenu) {
      const categories: string[] = LiteGraph.getNodeTypesCategories(canvas.filter || graph.filter).filter(function (category) { return category.startsWith(baseCategory) })
      const entries: ContextMenuItem[] = []
  
      categories.filter(category => category && !ignoredCategories.includes(category)).forEach(category => {
        const data = {
          type: `${category}/`,
          content: category,
          has_submenu: true,
          callback: (value, event, mouseEvent, contextMenu) => {
            onMenuAdded(value.type, contextMenu)
          }
        }
  
        entries.push(data)
      })
  
      const nodes = LiteGraph.getNodeTypesInCategory(baseCategory.replace('/', ''), canvas.filter ?? graph.filter) as unknown as LGraphNode[]
      nodes.filter(node => !ignoredNodes.includes(node.title)).forEach(node => {
        const entry= {
          type: node.type,
          content: node.title,
          has_submenu: false,
          callback: (value, event, mouseEvent, contextMenu) => {
            canvas.graph.beforeChange()
  
            const firstEv = contextMenu?.getFirstEvent()
            const node = LiteGraph.createNode(value.type)
            if (node) {
              node.pos = canvas.convertEventToCanvasOffset(firstEv)
              canvas.graph.add(node)
            }
  
            if (callback) {
              // @ts-expect-error
              callback(node)
            }
  
            canvas.graph.afterChange()
          }
        }
  
        entries.push(entry)
      })
  
      new LiteGraph.ContextMenu(entries, { event: ev, parentMenu: prevMenu }, refWindow)
    }
  
    onMenuAdded('', prevMenu)
  }
  
  const graph = new LiteGraph.LGraph()
  
  const el = document.querySelector<HTMLCanvasElement>('#canvas')
  const canvas = new LGraphCanvas('#canvas', graph)
  const nodes = {
    create: LiteGraph.createNode('Bot/Create'),
    spawn: LiteGraph.createNode('Events/Spawn'),
    alert: LiteGraph.createNode('Notifications/Alert')
  }

  nodes.create.pos = [ window.innerWidth / 3, window.innerHeight / 3 ]
  graph.add(nodes.create)

  nodes.spawn.pos = [ 1.5 * window.innerWidth / 3 , window.innerHeight / 3 ]
  graph.add(nodes.spawn)

  nodes.alert.pos = [ 1.5 * window.innerWidth / 3, 1.5 * window.innerHeight / 3 ]
  graph.add(nodes.alert)

  nodes.create.connect(0, nodes.spawn, 0)
  nodes.create.connect(1, nodes.alert, 0)
  nodes.create.connect(2, nodes.alert, 1)

  if (el !== null) {
    el.height = window.innerHeight
    el.width = window.innerWidth
  }
  
  window.onresize = () => {
    if (el === null) return
    el.height = window.innerHeight
    el.width = window.innerWidth
  }
  
  graph.start()
}

let bot: Bot | null
function getBot () {
  return bot
}

function assignBot (assign: Bot) {
  bot = assign
}

export {
  getBot,
  assignBot
}
