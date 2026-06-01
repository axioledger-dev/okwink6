<template>
  <div class="xoso-province-tabs">
    <div class="tabs-container">
      <div
        v-for="region in regions"
        :key="region.key"
        class="tab-item"
        :class="{ active: activeRegion === region.key }"
        @click="selectRegion(region.key)"
      >
        <span class="tab-text">{{ region.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  regions: {
    type: Array,
    required: true
  },
  activeRegion: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeRegion'])

const selectRegion = (regionKey) => {
  emit('update:activeRegion', regionKey)
}
</script>

<style scoped lang="scss">
.xoso-province-tabs {
  width: 100%;
}

.tabs-container {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 12px;
}

.tab-item {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:active {
    transform: scale(0.95);
  }

  &.active {
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .tab-text {
      color: #667eea;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 14px;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}
</style>