<template>
  <div class="mask" @click.self="$emit('close')">
    <div class="panel">
      <div class="header">
        <div>AI 对话</div>
        <button @click="$emit('close')">关闭</button>
      </div>
      <div class="body">
        <textarea v-model="prompt" placeholder="输入你的主题或问题" />
        <div class="actions">
          <button @click="createNoteFromPrompt">生成为新笔记</button>
        </div>
        <div class="hint">后续将集成 OpenAI，以本地所有笔记为上下文进行回答</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ allNotes: { type: Array, default: () => [] } })
const emit = defineEmits(['close', 'createNote'])
const prompt = ref('')
const createNoteFromPrompt = () => {
  if (!prompt.value.trim()) return
  emit('createNote', { title: prompt.value.slice(0, 30), content: prompt.value })
  emit('close')
}
</script>
<style>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: grid; place-items: center; }
.panel { width: 720px; max-width: 90vw; background: #fff; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
.header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eee; }
.body { padding: 12px; display: grid; gap: 10px; }
.body textarea { min-height: 140px; padding: 12px; font-size: 14px; }
.actions { display: flex; gap: 8px; }
.hint { color: #999; font-size: 12px; }
</style>
