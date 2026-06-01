<template>
  <ElDialog
    v-model="visible"
    title="sẽ员资料"
    width="600px"
  >
    <ElDescriptions :column="2" border>
      <ElDescriptionsItem label="sẽ员ID">{{ member.id }}</ElDescriptionsItem>
      <ElDescriptionsItem label="dùnghộ名">{{ member.username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="真实姓名">{{ member.userbankname }}</ElDescriptionsItem>
      <ElDescriptionsItem label="sẽ员tổ">{{ member.groupname }}</ElDescriptionsItem>
      <ElDescriptionsItem label="上cấp">{{ member.parent_username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="loạikiểu">{{ member.proxy_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="余额">{{ Number(member.balance || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="积phần">{{ member.point }}</ElDescriptionsItem>
      <ElDescriptionsItem label="余额宝">{{ Number(member.yebmoney || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="洗码余额">{{ Number(member.xima || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="登录时gian">{{ member.logintime_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="登录来nguồn">{{ member.loginsource }}</ElDescriptionsItem>
      <ElDescriptionsItem label="trongtuyến状态">{{ member.isonline_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="账số状态">{{ member.islock === 1 ? '冻结' : '正常' }}</ElDescriptionsItem>
      <ElDescriptionsItem label="手机">
        <template #default>
          <ElTag :type="security.phoneBind ? 'success' : 'info'">{{ security.phoneBind ? security.phone : 'chưa绑定' }}</ElTag>
          <ElButton v-if="security.phoneBind" type="warning" link @click="onUnbindPhone">解除绑定</ElButton>
        </template>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="邮箱">
        <template #default>
          <ElTag :type="security.emailBind ? 'success' : 'info'">{{ security.emailBind ? security.email : 'chưa绑定' }}</ElTag>
          <ElButton v-if="security.emailBind" type="warning" link @click="onUnbindEmail">解除绑定</ElButton>
        </template>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="GoogleXác thực器">
        <template #default>
          <ElTag :type="security.googleBind ? 'success' : 'info'">{{ security.googleBind ? 'đã绑定' : 'chưa绑定' }}</ElTag>
          <ElButton v-if="security.googleBind" type="danger" link @click="onResetGoogle">Đặt lại</ElButton>
        </template>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="资vàng密码">
        <template #default>
          <ElTag :type="security.hasFundPwd ? 'success' : 'info'">{{ security.hasFundPwd ? 'đã设trí' : 'chưa设trí' }}</ElTag>
          <ElButton type="warning" link @click="$emit('open-reset-fund-pwd', member)">Đặt lại</ElButton>
        </template>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="密保问题">
        <template #default>
          <ElTag :type="security.hasQuestion ? 'success' : 'info'">{{ security.hasQuestion ? 'đã设trí' : 'chưa设trí' }}</ElTag>
          <ElButton v-if="security.hasQuestion" type="danger" link @click="onResetQuestion">Đặt lại</ElButton>
        </template>
      </ElDescriptionsItem>
    </ElDescriptions>
    <template #footer>
      <ElButton @click="visible = false">Đóng</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Member } from '@/api/member'
import { fetchMemberSecurityInfo, resetMemberGoogle, unbindMemberPhone, unbindMemberEmail, resetMemberQuestion, type MemberSecurityInfo } from '@/api/member'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  member: Partial<Member>
}>()

const emit = defineEmits(['update:modelValue', 'open-reset-fund-pwd'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const security = ref<MemberSecurityInfo>({
  id: 0, username: '', phone: '', phoneBind: false, email: '', emailBind: false, googleBind: false, hasFundPwd: false, hasQuestion: false
})

const loadSecurity = async () => {
  if (!props.member?.id) return
  try {
    const res = await fetchMemberSecurityInfo(props.member.id)
    if (res) {
      security.value = res
    }
  } catch (e) {
    console.error('加载An toàn信息失败', e)
  }
}

watch(visible, (val) => { if (val) loadSecurity() })

const confirm = (title: string) => ElMessageBox.confirm(title, '提示', { type: 'warning' })

const onResetGoogle = async () => {
  if (!props.member?.id) return
  await confirm('确定cầnĐặt lạinêndùnghộGoogleXác thực器？')
  const res = await resetMemberGoogle(props.member.id)
  if ((res as any).code === 0) { ElMessage.success('đãĐặt lại'); loadSecurity() }
}
const onUnbindPhone = async () => {
  if (!props.member?.id) return
  await confirm('确定cần解除nêndùnghộ手机绑定？')
  const res = await unbindMemberPhone(props.member.id)
  if ((res as any).code === 0) { ElMessage.success('đã解除'); loadSecurity() }
}
const onUnbindEmail = async () => {
  if (!props.member?.id) return
  await confirm('确定cần解除nêndùnghộ邮箱绑定？')
  const res = await unbindMemberEmail(props.member.id)
  if ((res as any).code === 0) { ElMessage.success('đã解除'); loadSecurity() }
}
const onResetQuestion = async () => {
  if (!props.member?.id) return
  await confirm('确定cầnĐặt lạinêndùnghộ密保问题？')
  const res = await resetMemberQuestion(props.member.id)
  if ((res as any).code === 0) { ElMessage.success('đãĐặt lại'); loadSecurity() }
}
</script>
