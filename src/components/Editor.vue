<template>
  <div class="wrap" v-if="note">
    <input class="title" :value="note.name" placeholder="输入标题" @input="$emit('updateTitle', $event.target.value)" />
    <div class="toolbar">
      <div class="group">
        <button class="icon small" @click="cmd('bold')" title="加粗">B</button>
        <button class="icon small" @click="cmd('italic')" title="斜体">I</button>
        <button class="icon small" @click="cmd('underline')" title="下划线">U</button>
        <select class="select small" :value="fontSize" @change="onSize($event)">
          <option value="3">标准</option>
          <option value="2">小</option>
          <option value="4">中</option>
          <option value="5">大</option>
          <option value="6">特大</option>
        </select>
        <input class="color small" type="color" :value="color" @input="onColor($event)" />
      </div>
    </div>
    <div ref="editor" class="rich" contenteditable="true" data-placeholder="在这里书写内容..." @input="onInput" @compositionstart="isComposing = true" @compositionend="onCompositionEnd"></div>
  </div>
  <div v-else class="empty">请选择一条笔记开始编辑</div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch, nextTick } from 'vue'
const props = defineProps({ note: { type: Object, default: null } })
const emit = defineEmits(['updateTitle','updateContent'])
const fontSize = ref('3')
const color = ref('#000000')
const cmd = c => document.execCommand(c, false, null)
const onSize = e => { fontSize.value = e.target.value; document.execCommand('fontSize', false, fontSize.value) }
const onColor = e => { color.value = e.target.value; document.execCommand('foreColor', false, color.value) }
const editor = ref(null)
let isComposing = false
const onInput = e => { if (isComposing) return; const html = e.target.innerHTML; emit('updateContent', html) }
const onCompositionEnd = () => { isComposing = false; if (editor.value) emit('updateContent', editor.value.innerHTML) }

watch(() => props.note && props.note.id, async () => {
  await nextTick()
  if (editor.value) editor.value.innerHTML = (props.note && props.note.content) || ''
})

watch(() => props.note && props.note.content, async (val) => {
  await nextTick()
  if (isComposing) return
  if (editor.value && editor.value.innerHTML !== (val || '')) editor.value.innerHTML = val || ''
})
</script>
<style>
.wrap { display: flex; flex-direction: column; height: 100%; }
.title { padding: 16px 24px; font-size: 18px; border: none; border-bottom: 1px solid #eee; outline: none; }
.toolbar { display: flex; align-items: center; gap: 16px; padding: 10px 12px; border-bottom: 1px solid var(--border); background: var(--surface); }
.group { display: inline-flex; align-items: center; gap: 16px; }
.icon { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); display: grid; place-items: center; }
.icon.small { width: 24px; height: 24px; font-size: 14px; }
.select.small { height: 24px; border-radius: 8px; padding: 0 8px; }
.color.small { width: 24px; height: 24px; }
.select { padding: 6px 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); }
.color { width: 36px; height: 32px; border: none; background: none; }
.rich { flex: 1; padding: 16px; outline: none; overflow: auto; }
.rich:empty:before { content: attr(data-placeholder); color: #aaa; }
.empty { display: grid; place-items: center; height: 100%; color: #999; }
</style>
