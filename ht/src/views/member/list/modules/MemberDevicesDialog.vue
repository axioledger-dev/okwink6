<template>
  <ElDialog
    v-model="visible"
    title="Thiết bị đăng nhập"
    width="800px"
  >
    <ElTable :data="devices" border stripe v-loading="loading">
      <ElTableColumn prop="browser_type" label="Trình duyệt" width="140" />
      <ElTableColumn prop="os_type" label="Hệ điều hành" width="80" />
      <ElTableColumn prop="os_version" label="Phiên bản hệ thống" width="100" />
      <ElTableColumn prop="device_brand" label="Thương hiệu thiết bị" width="80" />
      <ElTableColumn prop="device_model" label="Model thiết bị" width="140" />
      <ElTableColumn prop="ip" label="IP" width="130" />
      <ElTableColumn prop="ip_region" label="IPKhu vực" min-width="150" />
      <ElTableColumn prop="last_login_at" label="Đăng nhậpThời gian" width="160" />
      <ElTableColumn label="Trạng thái" width="80">
        <template #default="{ row }">
          <ElTag v-if="row.is_current" type="success" size="small">Hiện tại</ElTag>
        </template>
      </ElTableColumn>
    </ElTable>
    <template #footer>
      <ElButton @click="visible = false">Đóng</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import request from '@/utils/http'

const props = withDefaults(defineProps<{
  modelValue: boolean
  memberId: number
}>(), {
  memberId: 0
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const devices = ref<any[]>([])

const loadDevices = async () => {
  if (!props.memberId) return
  loading.value = true
  try {
    const res: any = await request.get({
      url: '/app/admin/member/devices',
      params: { id: props.memberId }
    })
    let list = []
    if (res?.data?.data?.list) {
      list = res.data.data.list
    } else if (res?.data?.list) {
      list = res.data.list
    } else if (res?.list) {
      list = res.list
    }
    devices.value = list
  } catch (e) {}
  loading.value = false
}

watch(() => props.modelValue, (val) => {
  if (val) loadDevices()
})
</script>
