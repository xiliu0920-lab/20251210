<template>
  <div class="layout">
    <aside class="left">
      <LeftSidebar
        :tree="displayTree"
        :selectedFolderId="selectedFolderId"
        :counts="folderNoteCounts"
        @createNotebook="onCreateNotebook"
        @createNote="onCreateNote"
        @openAi="showAiModal = true"
        @openSettings="showSettings = true"
        @openSchedule="showSchedule = true"
        @selectFolder="onSelectFolder"
        @renameFolder="onRenameFolder"
        @toggleVisibility="onToggleVisibility"
        @deleteFolder="onDeleteFolder"
      />
    </aside>
    <main class="middle">
      <NoteList
        :notes="notesInFolder"
        :selectedNoteId="selectedNoteId"
        :sortBy="sortBy"
        @selectNote="id => (selectedNoteId = id)"
        @changeSort="v => (sortBy = v)"
        @deleteNote="onDeleteNote"
      />
    </main>
    <section class="right">
      <Editor
        :note="currentNote"
        @updateContent="onUpdateContent"
        @updateTitle="onUpdateTitle"
      />
    </section>
    <AiModal v-if="showAiModal" @close="showAiModal = false" :allNotes="allNotes" @createNote="addNoteFromAi" />
    <SettingsModal v-if="showSettings" @close="showSettings = false" :apiKey="apiKey" @saveApiKey="onSaveApiKey" />
    <ScheduleModal v-if="showSchedule" :schedules="schedules" @close="showSchedule=false" @add="onAddSchedule" @delete="onDeleteSchedule" />
    <DraggableFloat icon="🤖" storageKey="float_ai" :defaultX="600" :defaultY="80" @click="showAiModal = true" />
    <DraggableFloat icon="⚙️" storageKey="float_settings" :defaultX="660" :defaultY="140" @click="showSettings = true" />
    <DraggableFloat icon="📅" storageKey="float_schedule" :defaultX="720" :defaultY="200" @click="showSchedule = true" />
  </div>
  <div class="statusbar">
    <div>当前笔记本：{{ selectedFolderLabel }}</div>
    <div>当前笔记：{{ currentNote ? currentNote.name : '未选择' }}</div>
  </div>
  
</template>
<script setup>
import { ref, computed } from 'vue'
import LeftSidebar from './components/LeftSidebar.vue'
import NoteList from './components/NoteList.vue'
import Editor from './components/Editor.vue'
import AiModal from './components/AiModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import DraggableFloat from './components/DraggableFloat.vue'
import ScheduleModal from './components/ScheduleModal.vue'
import { loadData, saveData, loadApiKey, saveApiKey, createNotebook, createNote, renameNode, setFolderCollapsed, findById, deleteNode, loadSchedules, saveSchedules, addScheduleItem, deleteScheduleItem } from './storage'

const data = ref(loadData())
const apiKey = ref(loadApiKey())
const showAiModal = ref(false)
const showSettings = ref(false)
const showSchedule = ref(false)
const sortBy = ref('updatedAt')
const selectedFolderId = ref(null)
const selectedNoteId = ref(null)
const schedules = ref(loadSchedules())

const tree = computed(() => data.value.notebookTree)

const displayTree = computed(() => {
  const isFolder = n => n && n.type === 'folder'
  const cloneFolderShallow = src => ({ id: src.id, name: src.name, type: 'folder', collapsed: !!src.collapsed, createdAt: src.createdAt, children: [] })
  const rootFolders = (tree.value || []).filter(isFolder).map(cloneFolderShallow)
  return rootFolders
})

const allNotes = computed(() => {
  const result = []
  const walk = nodes => nodes.forEach(n => {
    if (n.type === 'note') result.push(n)
    if (n.children) walk(n.children)
  })
  walk(tree.value)
  return result
})

const folderNoteCounts = computed(() => {
  const map = {}
  const walkFolder = node => {
    if (node.type !== 'folder') return
    let count = 0
    const stack = [...(node.children || [])]
    while (stack.length) {
      const item = stack.shift()
      if (item.type === 'note') count++
      if (item.children) stack.push(...item.children)
    }
    map[node.id] = count
    ;(node.children || []).forEach(walkFolder)
  }
  (tree.value || []).forEach(walkFolder)
  return map
})

const notesInFolder = computed(() => {
  const sortFn = (a, b) => {
    if (sortBy.value === 'createdAt') return b.createdAt.localeCompare(a.createdAt)
    return b.updatedAt.localeCompare(a.updatedAt)
  }
  if (!selectedFolderId.value) {
    const filtered = allNotes.value.filter(n => {
      const parent = n.parentId ? findById(tree.value, n.parentId) : null
      if (!parent || parent.type !== 'folder') return true
      return parent.collapsed !== true
    })
    return filtered.sort(sortFn)
  }
  const result = []
  const walk = nodes => nodes.forEach(n => {
    if (n.type === 'note' && n.parentId === selectedFolderId.value) result.push(n)
    if (n.children) walk(n.children)
  })
  walk(tree.value)
  return result.sort(sortFn)
})

const currentNote = computed(() => {
  return allNotes.value.find(n => n.id === selectedNoteId.value) || null
})

const selectedFolderLabel = computed(() => {
  if (!selectedFolderId.value) return '全部'
  const stack = [...tree.value]
  while (stack.length) {
    const item = stack.shift()
    if (item.type === 'folder' && item.id === selectedFolderId.value) return item.name
    if (item.children) stack.push(...item.children)
  }
  return '全部'
})

const onCreateNotebook = parentId => {
  createNotebook(data.value, parentId)
  saveData(data.value)
}

const onCreateNote = parentId => {
  const note = createNote(data.value, parentId)
  selectedNoteId.value = note.id
  saveData(data.value)
}

const onSelectFolder = id => {
  selectedFolderId.value = id
}

const onUpdateContent = content => {
  if (!currentNote.value) return
  currentNote.value.content = content
  currentNote.value.updatedAt = new Date().toISOString()
  saveData(data.value)
}

const onUpdateTitle = title => {
  if (!currentNote.value) return
  currentNote.value.name = title
  currentNote.value.updatedAt = new Date().toISOString()
  saveData(data.value)
}

const addNoteFromAi = payload => {
  const note = createNote(data.value, selectedFolderId.value, payload.title, payload.content)
  selectedNoteId.value = note.id
  saveData(data.value)
}

const onSaveApiKey = key => {
  apiKey.value = key
  saveApiKey(key)
}

const onRenameFolder = payload => {
  if (!payload || !payload.id) return
  renameNode(data.value, payload.id, payload.name)
  saveData(data.value)
}

const onToggleVisibility = payload => {
  if (!payload || !payload.id) return
  setFolderCollapsed(data.value, payload.id, payload.collapsed)
  saveData(data.value)
}

const onDeleteFolder = payload => {
  if (!payload || !payload.id) return
  const count = folderNoteCounts.value[payload.id] || 0
  if (count > 0) { alert('当前笔记本下有笔记，暂不支持删除'); return }
  deleteNode(data.value, payload.id)
  if (selectedFolderId.value === payload.id) selectedFolderId.value = null
  saveData(data.value)
}

const onDeleteNote = id => {
  if (!id) return
  deleteNode(data.value, id)
  if (selectedNoteId.value === id) selectedNoteId.value = null
  saveData(data.value)
}

const onAddSchedule = payload => {
  const item = addScheduleItem(payload.title, payload.datetime)
  schedules.value.push(item)
  saveSchedules(schedules.value)
}

const onDeleteSchedule = id => {
  deleteScheduleItem(schedules.value, id)
  saveSchedules(schedules.value)
}
</script>
<style>
.layout { display: flex; height: calc(100vh - 36px); }
.left { width: 300px; padding: 12px; background: linear-gradient(180deg, var(--sidebar-bg-1), var(--sidebar-bg-2)); }
.middle { width: 420px; border-right: 1px solid var(--border); background: var(--surface); }
.right { flex: 1; background: var(--surface); }
.statusbar { height: 36px; display: flex; align-items: center; gap: 16px; padding: 0 16px; border-top: 1px solid var(--border); color: #64748b; background: var(--surface); }
</style>
