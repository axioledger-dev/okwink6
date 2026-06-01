<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Bảng xếp hạng đại lý</h4>
        <p>Xếp hạng theo hiệu suất đội nhóm</p>
      </div>
    </div>
    <div class="h-full overflow-hidden pb-8">
      <ElTable :data="rankList" style="width: 100%" height="100%">
        <ElTableColumn type="index" label="Xếp hạng" width="60" align="center">
          <template #default="{ $index }">
            <span
              class="inline-block w-5 h-5 rounded-full text-xs leading-5 text-center text-white"
              :class="$index < 3 ? 'bg-warning' : 'bg-g-400'"
            >
              {{ $index + 1 }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="username" label="Tài khoản đại lý" show-overflow-tooltip />
        <ElTableColumn prop="teamCount" label="Số người trong đội" width="100" align="center" />
        <ElTableColumn prop="performance" label="Hiệu suất đội nhóm" align="right">
          <template #default="{ row }">
            <span class="text-success">¥{{ row.performance.toLocaleString() }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>

<script setup lang="ts">

  const props = defineProps<{
    data?: any[]
  }>()

  const rankList = computed(() => props.data || [])
</script>
