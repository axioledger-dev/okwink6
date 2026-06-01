<template>
  <div class="xoso-countdown" :class="{ warning: isWarning }">
    <span class="countdown-text">{{ displayTime }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  endTime: {
    type: [Date, String, Number],
    required: true
  },
  warningSeconds: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['expired', 'warning'])

const remainingSeconds = ref(0)
let timer = null

const displayTime = computed(() => {
  const hours = Math.floor(remainingSeconds.value / 3600)
  const minutes = Math.floor((remainingSeconds.value % 3600) / 60)
  const seconds = remainingSeconds.value % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const isWarning = computed(() => {
  return remainingSeconds.value > 0 && remainingSeconds.value <= props.warningSeconds
})

const calculateRemaining = () => {
  const end = new Date(props.endTime).getTime()
  const now = Date.now()
  const diff = Math.floor((end - now) / 1000)

  if (diff <= 0) {
    remainingSeconds.value = 0
    stopTimer()
    emit('expired')
    return
  }

  remainingSeconds.value = diff

  if (isWarning.value) {
    emit('warning', remainingSeconds.value)
  }
}

const startTimer = () => {
  calculateRemaining()
  timer = setInterval(calculateRemaining, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped lang="scss">
.xoso-countdown {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 6px;
  transition: all 0.3s ease;

  &.warning {
    background: #ff6b6b;
    animation: pulse 1s ease-in-out infinite;

    .countdown-text {
      color: white;
    }
  }
}

.countdown-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>