
<template>
  <div class="w-full py-2">
    
    <div class="mb-6">
      <h2 class="m-0 mb-2 text-xl font-medium">{{ $t('menus.examples.permission.buttonAuth') }}</h2>
      <p class="m-0 text-sm leading-[1.6] text-g-700">
        此页mặt演示theo钮cấpđừng权限控制，khôngcùngdùnghộ身份下có thể见theo钮sẽCósởkhôngcùng。权限控制cơtạidùnghộ角色và权限码实现。
      </p>
    </div>

    <div class="mb-6">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">当前dùnghộ权限信息</span>
          </div>
        </template>
        <div>
          <div class="flex items-start mb-4 last:mb-0">
            <span class="min-w-20 font-semibold">dùnghộ角色：</span>
            <ElTag :type="getRoleTagType(currentUserRole)">
              {{ getRoleDisplayName(currentUserRole) }}
            </ElTag>
          </div>
          <div class="flex items-start mb-4 last:mb-0">
            <span class="min-w-20 font-semibold">权限码：</span>
            <div class="flex flex-wrap gap-2">
              <ElTag
                v-for="permission in currentUserPermissions"
                :key="permission"
                size="small"
                type="info"
                class="m-0"
              >
                {{ permission }}
              </ElTag>
              <span v-if="!currentUserPermissions.length" class="italic text-red-500"
                >Không权限码</span
              >
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">cơtại角色权限控制（v-roles 指令）</span>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            sử dụngdùng
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >v-roles</code
            >
            指令控制theo钮Hiển thị，chỉCó拥Có指定角色dùnghộmớicó thể看đếnvớinêntheo钮。
          </p>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <div class="flex flex-col gap-2">
              <ElButton type="primary" plain v-roles="'R_SUPER'"> 超cấp管理员có thể见 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="'R_SUPER'"</code
                >
                <span class="text-g-700">chỉCó超cấp管理员có thể见</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton type="warning" plain v-roles="['R_SUPER', 'R_ADMIN']">
                管理员có thể见
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="['R_SUPER', 'R_ADMIN']"</code
                >
                <span class="text-g-700">超cấp管理员và管理员có thể见</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton type="success" plain v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']">
                sởCódùnghộcó thể见
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-roles="['R_SUPER', 'R_ADMIN', 'R_USER']"</code
                >
                <span class="text-g-700">sởCóđã登录dùnghộcó thể见</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">后端模thức权限控制（v-auth 指令）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模thức</ElTag>
            <ElTag v-else type="info" size="small">không当前模thức</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >v-auth</code
            >
            指令trong后端模thức下根据当前đườngbởi
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >meta.authList</code
            >
            配trí检查权限。 权限dãy表来nguồntạiđườngbởi元数据，适dùngtại权限配tríbởi后端统一管理sân景。
          </p>

          <div class="mb-5">
            <h4 class="m-0 mb-2 text-sm font-semibold"> 当前đườngbởi权限配trí： </h4>
            <div
              class="max-h-30 p-3 overflow-y-auto font-mono text-xs break-all whitespace-pre-wrap bg-g-200 border-full-d rounded"
            >
              <code>{{ JSON.stringify(backendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            
            <div class="flex flex-col gap-2">
              <ElButton type="primary" plain v-auth="'add'"> Thêm mới </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'add'"</code
                >
                <span class="text-g-700">检查đườngbởi meta.authList 中là否存trong authMark: 'add'</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton type="warning" plain v-auth="'edit'"> Chỉnh sửa </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'edit'"</code
                >
                <span class="text-g-700">检查đườngbởi meta.authList 中là否存trong authMark: 'edit'</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton type="danger" plain v-auth="'delete'"> Xóa </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'delete'"</code
                >
                <span class="text-g-700">检查đườngbởi meta.authList 中là否存trong authMark: 'delete'</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton type="info" plain v-auth="'export'"> Xuất </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-auth="'export'"</code
                >
                <span class="text-g-700">检查đườngbởi meta.authList 中là否存trong authMark: 'export'</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <ElAlert
              :type="isFrontendMode ? 'warning' : 'success'"
              :title="
                isFrontendMode
                  ? '注意：当前là前端模thức，v-auth 指令trong后端模thức下mới生效'
                  : '当前là后端模thức，v-auth 指令正常工作'
              "
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">前端模thức权限控制（hasAuth phương pháp）</span>
            <ElTag v-if="isFrontendMode" type="success" size="small">当前模thức</ElTag>
            <ElTag v-else type="info" size="small">không当前模thức</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >hasAuth</code
            >
            phương pháptrong前端模thức下根据dùnghộ信息中
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >buttons</code
            >
            字đoạn检查权限。 权限dãy表存储trongdùnghộ状态中，适dùngtại权限完全bởi前端管理sân景。
          </p>

          <div class="mb-5">
            <h4 class="m-0 mb-2 text-sm font-semibold">当前dùnghộ权限dãy表（buttons 字đoạn）：</h4>
            <div
              class="max-h-30 p-3 overflow-y-auto font-mono text-xs break-all whitespace-pre-wrap bg-g-200 border-full-d rounded"
            >
              <code>{{ JSON.stringify(frontendAuthList, null, 2) }}</code>
            </div>
          </div>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            
            <div class="flex flex-col gap-2">
              <ElButton v-if="hasAuth('view')" type="primary"> Xem详情 </ElButton>
              <ElButton v-else type="info" disabled> KhôngXem权限 </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-if="hasAuth('view')"</code
                >
                <span class="text-g-700">检查dùnghộ buttons 数tổlà否包含 'view'</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElButton
                :disabled="!hasAuth('publish')"
                :type="hasAuth('publish') ? 'success' : 'info'"
                @click="handlePublish"
              >
                {{ hasAuth('publish') ? '发布' : 'Không发布权限' }}
              </ElButton>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >:disabled="!hasAuth('publish')"</code
                >
                <span class="text-g-700">检查dùnghộ buttons 数tổlà否包含 'publish'</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <ElDropdown @command="handleBatchAction" :disabled="!hasBatchPermissions">
                <ElButton :type="hasBatchPermissions ? 'warning' : 'info'">
                  lô量操作
                  <ElIcon class="el-icon--right">
                    <ArrowDown />
                  </ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="batchEdit" :disabled="!hasAuth('edit')">
                      lô量Chỉnh sửa
                    </ElDropdownItem>
                    <ElDropdownItem command="batchDelete" :disabled="!hasAuth('delete')">
                      lô量Xóa
                    </ElDropdownItem>
                    <ElDropdownItem command="batchExport" :disabled="!hasAuth('export')">
                      lô量Xuất
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >computed(() => hasAuth('edit') || hasAuth('delete'))</code
                >
                <span class="text-g-700">复合权限检查，检查多权限并集</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">后端模thức权限控制（hasAuth phương pháp）</span>
            <ElTag v-if="!isFrontendMode" type="success" size="small">当前模thức</ElTag>
            <ElTag v-else type="info" size="small">không当前模thức</ElTag>
          </div>
        </template>
        <div>
          <p class="p-3 m-0 mb-5 text-sm leading-[1.6] text-g-700 bg-g-200 rounded">
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >hasAuth</code
            >
            phương pháptrong后端模thức下根据当前đườngbởi
            <code class="px- 1.5 py-0.5 font-mono text-xs text-theme bg-theme/10 rounded"
              >meta.authList</code
            >
            配trí检查权限。và v-auth 指令sử dụngdùngtươngcùng权限来nguồn，但提供编程thức权限检查có thể力。
          </p>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            
            <div class="flex flex-col gap-2">
              <ElSwitch
                v-model="dynamicFeatureEnabled"
                :disabled="!hasAuth('config')"
                active-text="côngcó thể开启"
                inactive-text="côngcó thểĐóng"
              />
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >:disabled="!hasAuth('config')"</code
                >
                <span class="text-g-700">检查đườngbởi权限控制côngcó thể开关</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <div v-if="hasAuth('manage')" class="flex gap-2 p-3 bg-g-200 border-full-d rounded">
                <ElButton type="primary" size="small">管理操作</ElButton>
                <ElButton type="warning" size="small">高cấp设trí</ElButton>
              </div>
              <div
                v-else
                class="flex-c gap-2 p-3 text-g-500 bg-g-200 border border-dashed border-g-400 rounded"
              >
                <ElIcon><Lock /></ElIcon>
                <span class="text-sm">cầncần管理权限mớicó thểXem此khuvực</span>
              </div>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >v-if="hasAuth('manage')"</code
                >
                <span class="text-g-700">cơtại后端đườngbởi权限điềuviệc渲染</span>
              </div>
            </div>

            
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap gap-3">
                <ElBadge
                  :value="hasAuth('add') ? '✓' : '✗'"
                  :type="hasAuth('add') ? 'success' : 'danger'"
                >
                  <ElButton size="small">Thêm mới权限</ElButton>
                </ElBadge>
                <ElBadge
                  :value="hasAuth('edit') ? '✓' : '✗'"
                  :type="hasAuth('edit') ? 'success' : 'danger'"
                >
                  <ElButton size="small">Chỉnh sửa权限</ElButton>
                </ElBadge>
                <ElBadge
                  :value="hasAuth('delete') ? '✓' : '✗'"
                  :type="hasAuth('delete') ? 'success' : 'danger'"
                >
                  <ElButton size="small">Xóa权限</ElButton>
                </ElBadge>
              </div>
              <div class="text-xs">
                <code class="block p-1 px-2 mb-1 font-mono bg-g-200 border-full-d rounded"
                  >hasAuth('permission')</code
                >
                <span class="text-g-700">实时权限状态指示器</span>
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-cb font-semibold">
            <span class="flex-1">权限控制模thứcvới比</span>
          </div>
        </template>
        <div>
          <div class="mt-4">
            <ElTable :data="comparisonData" border>
              <ElTableColumn prop="feature" label="côngcó thể特性" width="150" />
              <ElTableColumn prop="frontend" label="前端模thức" />
              <ElTableColumn prop="backend" label="后端模thức" />
            </ElTable>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ArrowDown, Lock } from '@element-plus/icons-vue'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useUserStore } from '@/store/modules/user'
  import { useAppMode } from '@/hooks/core/useAppMode'
  import { useRoute } from 'vue-router'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'PermissionButtonAuth' })

  const { hasAuth } = useAuth()
  const { isFrontendMode } = useAppMode()
  const userStore = useUserStore()
  const route = useRoute()

  const dynamicFeatureEnabled = ref(false)

  const currentUserRole = computed(() => {
    return userStore.info?.roles?.[0] || ''
  })

  const currentUserPermissions = computed(() => {
    return userStore.info?.buttons || []
  })

  const frontendAuthList = computed(() => {
    return userStore.info?.buttons || []
  })

  const backendAuthList = computed(() => {
    type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number]
    return Array.isArray(route.meta.authList) ? (route.meta.authList as AuthItem[]) : []
  })

  const hasBatchPermissions = computed(() => {
    return hasAuth('edit') || hasAuth('delete') || hasAuth('export')
  })

  const comparisonData = computed(() => [
    {
      feature: '权限来nguồn',
      frontend: 'dùnghộ状态中 buttons 字đoạn',
      backend: 'đườngbởi配trí中 meta.authList'
    },
    {
      feature: 'v-auth 指令',
      frontend: 'khôngcó thểdùng（前端模thức下指令Không效）',
      backend: 'có thểdùng（根据đườngbởi权限配trí检查）'
    },
    {
      feature: 'hasAuth phương pháp',
      frontend: 'có thểdùng（检查 buttons 数tổ）',
      backend: 'có thểdùng（检查 meta.authList）'
    },
    {
      feature: '权限管理',
      frontend: '完全bởi前端控制，灵活độ高',
      backend: '后端统一管理，An toàn性hơn高'
    },
    {
      feature: '适dùngsân景',
      frontend: '快速原kiểu、简单nêndùng',
      backend: 'doanhnghiệpcấpnêndùng、复杂权限体hệ'
    }
  ])

  const getRoleTagType = (role: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
    const roleMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
      R_SUPER: 'warning',
      R_ADMIN: 'primary',
      R_USER: 'success'
    }
    return roleMap[role] || 'info'
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      R_SUPER: '超cấp管理员',
      R_ADMIN: '管理员',
      R_USER: '普thôngdùnghộ'
    }
    return roleMap[role] || 'chưa知角色'
  }

  const handlePublish = () => {
    if (hasAuth('publish')) {
      ElMessage.success('发布成công！')
    } else {
      ElMessage.warning('Bạn没Có发布权限')
    }
  }

  const handleBatchAction = (command: string) => {
    const actions: Record<string, string> = {
      batchEdit: 'lô量Chỉnh sửa',
      batchDelete: 'lô量Xóa',
      batchExport: 'lô量Xuất'
    }

    const permission = command.replace('batch', '').toLowerCase()

    if (hasAuth(permission)) {
      ElMessage.success(`${actions[command]}操作执行成công！`)
    } else {
      ElMessage.warning(`Bạn没Có${actions[command]}权限`)
    }
  }
</script>
