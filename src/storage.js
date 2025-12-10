const LS_TREE = 'notebookTree'
const LS_API = 'userApiKey'

const now = () => new Date().toISOString()
const genId = () => 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)

const defaultData = () => {
  const folderId = genId()
  return {
    notebookTree: [
      {
        id: folderId,
        name: '示例笔记本',
        type: 'folder',
        collapsed: false,
        createdAt: now(),
        children: [
          {
            id: genId(),
            name: '欢迎使用',
            parentId: folderId,
            type: 'note',
            content: '欢迎使用 AI 原生笔记本',
            createdAt: now(),
            updatedAt: now()
          }
        ]
      }
    ]
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(LS_TREE)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed)) return defaultData()
    return { notebookTree: parsed }
  } catch (e) {
    return defaultData()
  }
}

export function saveData(data) {
  const serialized = JSON.stringify(data.notebookTree)
  localStorage.setItem(LS_TREE, serialized)
}

export function loadApiKey() {
  return localStorage.getItem(LS_API) || ''
}

export function saveApiKey(key) {
  localStorage.setItem(LS_API, key || '')
}

export function findById(tree, id) {
  const stack = [...tree]
  while (stack.length) {
    const item = stack.shift()
    if (item.id === id) return item
    if (item.children) stack.push(...item.children)
  }
  return null
}

export function createNotebook(data, parentId) {
  const node = { id: genId(), name: '新建笔记本', type: 'folder', collapsed: false, createdAt: now(), children: [] }
  if (!parentId) { data.notebookTree.push(node); return node }
  const parent = findById(data.notebookTree, parentId)
  if (parent && parent.type === 'folder') { parent.children = parent.children || []; parent.children.push(node) }
  return node
}

export function createNote(data, parentId, title = '无标题', content = '') {
  const node = { id: genId(), name: title, parentId: parentId || null, type: 'note', content, createdAt: now(), updatedAt: now() }
  if (!parentId) { data.notebookTree.push(node); return node }
  const parent = findById(data.notebookTree, parentId)
  if (parent && parent.type === 'folder') { parent.children = parent.children || []; parent.children.push(node) }
  return node
}

export function renameNode(data, id, newName) {
  const node = findById(data.notebookTree, id)
  if (!node) return null
  node.name = newName
  if (node.type === 'note') node.updatedAt = now()
  return node
}

export function setFolderCollapsed(data, id, collapsed) {
  const node = findById(data.notebookTree, id)
  if (!node || node.type !== 'folder') return null
  node.collapsed = !!collapsed
  return node
}

export function deleteNode(data, id) {
  const remove = arr => {
    for (let i = 0; i < arr.length; i++) {
      const n = arr[i]
      if (n.id === id) { arr.splice(i, 1); return true }
      if (n.children && remove(n.children)) return true
    }
    return false
  }
  return remove(data.notebookTree)
}
