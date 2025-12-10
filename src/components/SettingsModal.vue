<template>
  <div class="mask" @click.self="$emit('close')">
    <div class="panel">
      <div class="header">
        <div>设置</div>
        <button @click="$emit('close')">关闭</button>
      </div>
      <div class="body">
        <label>OpenAI API Key</label>
        <input :value="apiKey" placeholder="sk-..." @input="onInput" />
        <div class="actions">
          <button @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({ apiKey: { type: String, default: '' } })
const emit = defineEmits(['close', 'saveApiKey'])
let temp = props.apiKey || ''
const onInput = e => { temp = e.target.value }
const save = () => { emit('saveApiKey', temp); emit('close') }
</script>
<style>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: grid; place-items: center; }
.panel { width: 480px; max-width: 90vw; background: #fff; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
.header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eee; }
.body { padding: 12px; display: grid; gap: 10px; }
.actions { display: flex; gap: 8px; }
</style>
