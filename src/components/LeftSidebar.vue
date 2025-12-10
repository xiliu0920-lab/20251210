<template>
  <div class="wrap">
    <div class="tree">
      <div :class="['node', !selectedFolderId ? 'active' : '']" @click="$emit('selectFolder', null)">全部</div>
      <ul class="list">
        <TreeNode v-for="n in tree" :key="n.id" :node="n" :selectedFolderId="selectedFolderId" :counts="counts" @select-folder="$emit('selectFolder', $event)" @rename-folder="$emit('renameFolder', $event)" @toggle-visibility="$emit('toggleVisibility', $event)" @delete-folder="$emit('deleteFolder', $event)" />
      </ul>
    </div>
    <div class="footer">
      <div class="primary">
        <button class="new-btn" @click="$emit('createNote', selectedFolderId)">
          <span class="new-icon">+</span>
          <span class="new-label">新建笔记</span>
        </button>
      </div>
      <div class="primary">
        <button class="new-btn" @click="$emit('createNotebook', selectedFolderId)">
          <span class="new-icon">+</span>
          <span class="new-label">新建笔记本</span>
        </button>
      </div>
    </div>
  </div>
  
</template>
<script setup>
import { defineProps } from 'vue'
import TreeNode from './TreeNode.vue'
const props = defineProps({ tree: { type: Array, required: true }, selectedFolderId: { type: String, default: null }, counts: { type: Object, default: () => ({}) } })
</script>
<style>
.wrap { display: flex; flex-direction: column; height: 100%; color: var(--sidebar-text); }
.primary { display: flex; width: 100%; justify-content: flex-start; background: transparent; border-radius: 0; padding: 0; }
.pill.full { width: 100%; justify-content: center; }
.new-btn { display: flex; align-items: center; gap: 12px; background: transparent; border: none; color: var(--sidebar-text); padding: 8px 10px; width: 100%; }
.new-icon { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(180deg, var(--brand), var(--brand-weak)); box-shadow: 0 6px 18px rgba(16,185,129,0.30); display: grid; place-items: center; color: #fff; font-size: 22px; line-height: 1; }
.new-label { color: #fff; font-weight: 600; font-size: 16px; }
.title { font-weight: 700; font-size: 16px; }
.actions { display: none; }
.footer { margin-top: auto; display: flex; flex-direction: column; align-items: stretch; gap: 8px; padding: 8px 12px; }
.pill { padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,0.08); color: var(--sidebar-text); border: 1px solid rgba(255,255,255,0.12); }
.pill.brand { background: linear-gradient(180deg, var(--brand), var(--brand-weak)); color: #ffffff; border: none; font-weight: 600; }
.icon { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); display: grid; place-items: center; }
.tree { padding: 8px 12px; overflow: auto; }
.list { list-style: none; padding-left: 0; margin: 0; }
.folder { padding: 8px 10px; border-radius: 8px; display: flex; align-items: center; gap: 8px; }
.folder.active { background: rgba(255,255,255,0.10); }
.node { padding: 8px 10px; cursor: pointer; border-radius: 8px; color: var(--sidebar-muted); }
.node.active { background: rgba(255,255,255,0.10); color: var(--sidebar-text); }
.note-leaf { color: var(--sidebar-muted); padding: 4px 0; }
.name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
