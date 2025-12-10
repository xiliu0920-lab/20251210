<template>
  <div class="wrap">
    <div class="toolbar">
      <div class="title">笔记列表</div>
      <select class="select" :value="sortBy" @change="$emit('changeSort', $event.target.value)">
        <option value="updatedAt">按修改时间</option>
        <option value="createdAt">按创建时间</option>
      </select>
    </div>
    <ul class="list">
      <li v-for="n in notes" :key="n.id" :class="['item', selectedNoteId === n.id ? 'active' : '']" @click="$emit('selectNote', n.id)" @contextmenu="onContext($event, n)">
        <div class="title">{{ n.name }}</div>
        <div class="excerpt">{{ plain(n.content) }}</div>
        <div class="meta">{{ formatDate(n.updatedAt) }}</div>
      </li>
    </ul>
    <div v-if="showMenu" class="menu-mask" @click="showMenu=false"></div>
    <div v-if="showMenu" class="context-menu" :style="{ '--x': menuX+'px', '--y': menuY+'px' }">
      <div class="item danger" @click="deleteCurrent">删除</div>
    </div>
  </div>
  
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
const props = defineProps({ notes: { type: Array, required: true }, selectedNoteId: { type: String, default: null }, sortBy: { type: String, default: 'updatedAt' } })
const emit = defineEmits(['selectNote','changeSort','deleteNote'])
const formatDate = s => new Date(s).toLocaleString()
const plain = html => String(html || '').replace(/<[^>]+>/g,'').trim()
const snippet = html => {
  const text = String(html || '').replace(/<[^>]+>/g,'').trim()
  return text.length > 80 ? text.slice(0, 80) + '…' : text
}
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
let currentId = null
const onContext = (e, n) => { e.preventDefault(); showMenu.value = true; menuX.value = e.clientX; menuY.value = e.clientY; currentId = n.id }
const deleteCurrent = () => { showMenu.value = false; if (currentId) emit('deleteNote', currentId) }
</script>
<style>
.wrap { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--border); background: var(--surface); }
.toolbar .title { font-weight: 600; color: #0f172a; }
.select { padding: 6px 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); }
.list { list-style: none; padding: 0; margin: 0; overflow: auto; }
.item { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 12px 12px 1cm; border-bottom: 1px solid #edf2f7; cursor: pointer; text-align: left; }
.item.active { background: #f1f5f9; }
.title { font-weight: 600; margin: 0; padding: 0; color: #0f172a; font-size: 12px; line-height: 1.4; text-align: left; }
.excerpt { color: #64748b; font-size: 12px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; padding: 0; text-align: left; }
.meta { color: #94a3b8; font-size: 12px; margin: 0; padding: 0; text-align: left; }
.menu-mask { position: fixed; inset: 0; }
.context-menu { position: fixed; top: 0; left: 0; transform: translate(var(--x), var(--y)); background: #fff; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); min-width: 120px; z-index: 1000; }
.context-menu .item { padding: 8px 12px; cursor: pointer; color: #000; }
.context-menu .item:hover { background: #f5f5f5; }
.context-menu .item.danger { color: #000; }
</style>
