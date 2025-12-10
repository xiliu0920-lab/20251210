<template>
  <div class="mask" @click.self="$emit('close')">
    <div class="panel">
      <div class="header">
        <div>时间表</div>
        <button class="close" @click="$emit('close')">关闭</button>
      </div>
      <div class="body">
        <div class="form">
          <input v-model="title" placeholder="事项标题" />
          <input v-model="datetime" type="datetime-local" />
          <button class="add" @click="add">添加</button>
        </div>
        <ul class="list">
          <li v-for="s in schedules" :key="s.id" class="item">
            <div class="left">
              <div class="t">{{ s.title }}</div>
              <div class="d">{{ formatDT(s.datetime) }}</div>
            </div>
            <button class="del" @click="$emit('delete', s.id)">删除</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
const props = defineProps({ schedules: { type: Array, default: () => [] } })
const emit = defineEmits(['close','add','delete'])
const title = ref('')
const datetime = ref(new Date().toISOString().slice(0,16))
const add = () => { if (!title.value.trim()) return; emit('add', { title: title.value, datetime: datetime.value }); title.value=''; }
const formatDT = v => { try { const d = new Date(v); return d.toLocaleString() } catch { return v }
}
</script>
<style>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: grid; place-items: center; z-index: 2000; }
.panel { width: 720px; max-width: 92vw; background: #fff; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.25); overflow: hidden; }
.header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eee; }
.body { padding: 12px; display: grid; gap: 12px; }
.form { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; }
.add { padding: 8px 12px; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.item { display: grid; grid-template-columns: 1fr auto; align-items: center; padding: 10px; border: 1px solid #eef2f7; border-radius: 8px; }
.t { font-weight: 600; }
.d { color: #64748b; font-size: 12px; }
.del { color: #ef4444; border: 1px solid #ef4444; background: #fff; padding: 6px 10px; border-radius: 8px; }
.close { border: 1px solid #ddd; background: #fff; border-radius: 8px; padding: 6px 10px; }
</style>
