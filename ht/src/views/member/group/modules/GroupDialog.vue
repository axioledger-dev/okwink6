<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? 'Thêm nhóm thành viên' : 'Chỉnh sửa nhóm thành viên'"
    width="500px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="Tên nhóm" prop="groupname">
        <ElInput v-model="formData.groupname" placeholder="Vui lòng nhập tên nhóm" />
      </ElFormItem>
      <ElFormItem label="Danh hiệu" prop="touhan">
        <ElInput v-model="formData.touhan" placeholder="Vui lòng nhập danh hiệu" />
      </ElFormItem>
      <ElFormItem label="Mã đánh thăng cấp" prop="shengjiedu">
        <ElInput v-model="formData.shengjiedu" type="number" placeholder="Lượng mã đánh cần để thăng cấp">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Tiền thưởng thăng cấp" prop="jjje">
        <ElInput v-model="formData.jjje" type="number" placeholder="Tiền thưởng nhận được khi thăng cấp">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Rút tiền miễn phí" prop="free_withdraw_times">
        <ElInput v-model="formData.free_withdraw_times" type="number" placeholder="Số lần rút tiền miễn phí mỗi ngày">
          <template #append>lần/ngày</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Yêu cầu mã đánh tuần" prop="weekly_betting">
        <ElInput v-model="formData.weekly_betting" type="number" placeholder="Yêu cầu mã đánh mỗi tuần">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Tiền thưởng tuần" prop="weekly_bonus">
        <ElInput v-model="formData.weekly_bonus" type="number" placeholder="Tiền thưởng tuần">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Yêu cầu mã đánh tháng" prop="monthly_betting">
        <ElInput v-model="formData.monthly_betting" type="number" placeholder="Yêu cầu mã đánh mỗi tháng">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Tiền thưởng tháng" prop="monthly_bonus">
        <ElInput v-model="formData.monthly_bonus" type="number" placeholder="Tiền thưởng tháng">
          <template #append>đồng</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="Cài đặt hoàn nước" prop="fanshui">
        <ElInput v-model="formData.fanshui" placeholder="Vui lòng nhập cài đặt hoàn nước" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit">Gửi</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { MemberGroup, createMemberGroup, updateMemberGroup } from '@/api/member'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  interface Props {
    visible: boolean
    type: 'add' | 'edit'
    data?: Partial<MemberGroup>
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

  const dialogType = computed(() => props.type)


  const formRef = ref<FormInstance>()


  const formData = reactive<Partial<MemberGroup>>({
    groupname: '',
    touhan: '',
    shengjiedu: '',
    jjje: '',
    free_withdraw_times: '',
    weekly_betting: '',
    weekly_bonus: '',
    monthly_betting: '',
    monthly_bonus: '',
    fanshui: ''
  })


  const rules: FormRules = {
    groupname: [
      { required: true, message: 'Vui lòng nhập tên nhóm', trigger: 'blur' }
    ]
  }



  const initFormData = () => {
    if (props.type === 'edit' && props.data) {
      Object.assign(formData, props.data)
    } else {
      Object.assign(formData, {
        groupname: '',
        touhan: '',
        shengjiedu: '',
        jjje: '',
        free_withdraw_times: '',
        weekly_betting: '',
        weekly_bonus: '',
        monthly_betting: '',
        monthly_bonus: '',
        fanshui: ''
      })
    }
  }



  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    }
  )



  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (dialogType.value === 'add') {
            await createMemberGroup(formData)
            ElMessage.success('Thêm thành công')
          } else {

             if (props.data?.groupid) {
                await updateMemberGroup({ ...formData, groupid: props.data.groupid })
                ElMessage.success('Sửa thành công')
             }
          }
          dialogVisible.value = false
          emit('submit')
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
</script>
