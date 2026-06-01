<template>
  <div class="xoso-category">
    <div class="category-tabs">
      <div
        v-for="category in categories"
        :key="category.key"
        class="category-tab"
        :class="{ active: activeCategory === category.key }"
        @click="selectCategory(category.key)"
      >
        <span class="tab-text">{{ category.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeCategory'])

const selectCategory = (categoryKey) => {
  emit('update:activeCategory', categoryKey)
}
</script>

<style scoped lang="scss">
.xoso-category {
  margin-bottom: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;

    &:hover {
      background: #999;
    }
  }
}

.category-tab {
  flex-shrink: 0;
  padding: 10px 20px;
  background: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);

    .tab-text {
      color: white;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  transition: all 0.3s ease;
}
</style>