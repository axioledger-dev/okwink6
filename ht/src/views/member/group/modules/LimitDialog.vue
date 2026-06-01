<template>
  <ElDialog
    v-model="dialogVisible"
    :title="'Cài đặt hạn mức' + (groupName ? ' - ' + groupName : '')"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" label-width="120px">
      
      <ElFormItem label="Cược tối thiểu" prop="min_bet">
        <ElInput v-model="formData.min_bet" placeholder="Vui lòng nhập hạn mức cược tối thiểu" />
      </ElFormItem>
      <ElFormItem label="Cược tối đa" prop="max_bet">
        <ElInput v-model="formData.max_bet" placeholder="Vui lòng nhập hạn mức cược tối đa" />
      </ElFormItem>
      <ElFormItem label="Tối đa mỗi kỳ" prop="max_issue">
        <ElInput v-model="formData.max_issue" placeholder="Vui lòng nhập hạn mức tối đa mỗi kỳ" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit">Lưu</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { saveMemberGroupLimit, getMemberGroupLimit } from '@/api/member'
  import { ElMessage } from 'element-plus'

  interface Props {
    visible: boolean
    groupId?: number
    groupName?: string
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const formData = reactive({
    min_bet: '',
    max_bet: '',
    max_issue: ''
  })


  watch(
    () => props.visible,
    async (visible) => {
      if (visible && props.groupId) {
        try {



           formData.min_bet = ''
           formData.max_bet = ''
           formData.max_issue = ''
        } catch (e) {
          console.error(e)
        }
      }
    }
  )

  const handleSubmit = async () => {
    try {
      await saveMemberGroupLimit({ ...formData, groupid: props.groupId })
      ElMessage.success('Đã lưu cài đặt hạn mức')
      dialogVisible.value = false
      emit('submit')
    } catch (error) {
      console.error(error)
    }
  }
</script>
