<template>
  <div
    class="float"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="onDown"
    @touchstart="onTouchDown"
    @click.stop="emit('click')"
  >
    <div class="icon">{{ icon }}</div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
const props = defineProps({ icon: { type: String, required: true }, storageKey: { type: String, required: true }, defaultX: { type: Number, default: 20 }, defaultY: { type: Number, default: 20 } })
const emit = defineEmits(['click'])
const x = ref(props.defaultX)
const y = ref(props.defaultY)
let dragging = false
let startX = 0
let startY = 0
let baseX = 0
let baseY = 0
const save = () => { try { localStorage.setItem(props.storageKey, JSON.stringify({ x: x.value, y: y.value })) } catch (e) {} }
const load = () => { try { const raw = localStorage.getItem(props.storageKey); if (raw) { const p = JSON.parse(raw); if (typeof p.x === 'number') x.value = p.x; if (typeof p.y === 'number') y.value = p.y } } catch (e) {} }
const clamp = () => { const w = window.innerWidth; const h = window.innerHeight; const size = 48; x.value = Math.max(4, Math.min(w - size - 4, x.value)); y.value = Math.max(4, Math.min(h - size - 4, y.value)) }
const onMove = e => { if (!dragging) return; x.value = baseX + (e.clientX - startX); y.value = baseY + (e.clientY - startY); clamp() }
const onUp = () => { if (!dragging) return; dragging = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); save() }
const onDown = e => { dragging = true; startX = e.clientX; startY = e.clientY; baseX = x.value; baseY = y.value; window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp) }
const onTouchMove = e => { if (!dragging) return; const t = e.touches[0]; x.value = baseX + (t.clientX - startX); y.value = baseY + (t.clientY - startY); clamp() }
const onTouchUp = () => { if (!dragging) return; dragging = false; window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', onTouchUp); save() }
const onTouchDown = e => { const t = e.touches[0]; dragging = true; startX = t.clientX; startY = t.clientY; baseX = x.value; baseY = y.value; window.addEventListener('touchmove', onTouchMove, { passive: true }); window.addEventListener('touchend', onTouchUp) }
onMounted(() => { load(); clamp() })
</script>
<style>
.float { position: fixed; z-index: 2000; width: 48px; height: 48px; border-radius: 999px; box-shadow: 0 10px 24px rgba(0,0,0,0.25); background: rgba(255,255,255,0.06); backdrop-filter: blur(6px); display: grid; place-items: center; border: 1px solid rgba(255,255,255,0.18); }
.icon { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-size: 22px; background: linear-gradient(180deg, var(--brand), var(--brand-weak)); color: #fff; }
</style>
