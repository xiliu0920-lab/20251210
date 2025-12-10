<template>
  <li>
    <div v-if="node.type==='folder'" :class="['folder', selectedFolderId===node.id ? 'active' : '']" @click="$emit('select-folder', node.id)" @contextmenu="onContextmenu">
      <span class="toggle" @click.stop="open=!open">{{ open ? '📂' : '📁' }}</span>
      <span v-if="!renaming" class="name">{{ node.name }}</span>
      <span v-if="!renaming" class="count">{{ (counts && counts[node.id]) ? counts[node.id] : 0 }}</span>
      <input v-else class="rename-input" v-model="tempName" @keyup.enter="commitRename" @blur="commitRename" />
    </div>
    <div v-else class="note-leaf">📝 {{ node.name }}</div>
    <ul v-if="open && node.children && node.children.length" class="list">
      <TreeNode v-for="c in node.children" :key="c.id" :node="c" :selectedFolderId="selectedFolderId" @select-folder="$emit('select-folder', $event)" @rename-folder="$emit('rename-folder', $event)" />
    </ul>
    <div v-if="showMenu" class="menu-mask" @click="showMenu=false"></div>
    <div v-if="showMenu" class="context-menu" :style="{ '--x': menuX+'px', '--y': menuY+'px' }">
      <div class="item" @click="renameFromMenu">重命名</div>
      <div class="item danger" @click="deleteFromMenu">删除</div>
    </div>
  </li>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ node: { type: Object, required: true }, selectedFolderId: { type: String, default: null }, counts: { type: Object, default: () => ({}) } })
const emit = defineEmits(['select-folder','rename-folder','delete-folder'])
const open = ref(true)
const renaming = ref(false)
const tempName = ref(props.node.name)
const startRename = () => { renaming.value = true; tempName.value = props.node.name }
const commitRename = () => { renaming.value = false; const name = (tempName.value || '').trim(); if (name && name !== props.node.name) emit('rename-folder', { id: props.node.id, name }) }
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const onContextmenu = e => { e.preventDefault(); showMenu.value = true; menuX.value = e.clientX; menuY.value = e.clientY }
const renameFromMenu = () => { showMenu.value = false; startRename() }
const deleteFromMenu = () => { showMenu.value = false; emit('delete-folder', { id: props.node.id }) }
</script>
<style>
.list { list-style: none; padding-left: 12px; margin: 0; }
.folder { padding: 6px; border-radius: 6px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
.folder.active { background: #f5f5f5; }
.note-leaf { color: #999; padding: 4px 0; }
.toggle { width: 20px; display: inline-block; text-align: center; }
.name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.count { color: #999; font-size: 12px; margin-left: 6px; }
.rename-input { flex: 1; padding: 4px 8px; }
.menu-mask { position: fixed; inset: 0; }
.context-menu { position: fixed; top: 0; left: 0; transform: translate(var(--x), var(--y)); background: #fff; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); min-width: 120px; z-index: 1000; }
.context-menu .item { padding: 8px 12px; cursor: pointer; color: #000; }
.context-menu .item:hover { background: #f5f5f5; }
.context-menu .item.danger { color: #000; }
</style>
