
<template>
  <div class="w-full py-2">
    
    <div class="mb-6">
      <h2 class="m-0 mb-2 text-xl font-medium">{{
        $t('menus.examples.permission.pageVisibility')
      }}</h2>
      <p class="m-0 text-sm leading-[1.6] text-g-700">
        Trang này chỉ hiển thị với<strong class="font-semibold text-warning">Siêu quản trị viên</strong
        >người dùng, demo điều khiển quyền hạn cấp trang. Nếu bạn có thể thấy trang này, có nghĩa là bạn có quyền truy cập tương ứng.
      </p>
    </div>

    <div class="mb-6">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-c gap-2 font-semibold">
            <span>Xác thực quyền hạn thành công</span>
          </div>
        </template>
        <div>
          <div class="flex-c gap-5">
            <div>
              <h3 class="m-0 mb-2 text-lg font-semibold">Bạn có quyền truy cập trang này</h3>
              <p class="my-1 text-sm text-g-700">
                hiện tạiNgười dùng：<strong class="font-semibold">{{ currentUser.userName }}</strong>
              </p>
              <p class="my-1 text-sm text-g-700">
                Người dùngVai trò：
                <ElTag type="warning">{{ getRoleDisplayName(currentUser.roles?.[0] || '') }}</ElTag>
              </p>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    
    <div class="mb-6 last:mb-0">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="flex-c font-semibold">
            <span>Giải thích điều khiển quyền hạn cấp trang</span>
          </div>
        </template>
        <div>
          <ElTimeline>
            <ElTimelineItem timestamp="Chế độ điều khiển frontend" type="primary" size="large">
              <ElCard shadow="never">
                <h4 class="m-0 mb-2 text-base font-semibold">Điều khiển quyền hạn dựa trên vai trò</h4>
                <p class="m-0 mb-2 leading-[1.6] text-g-700">
                  Trong chế độ điều khiển frontend, quyền truy cập trang được định nghĩa bởi
                  <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                    >meta.roles</code
                  >
                  trường trong file cấu hình route, frontend sẽ lọc và điều khiển route và menu dựa trên vai trò mà người dùng sở hữu
                </p>
                <pre
                  class="p-4 mt-3 mb-0 overflow-x-auto font-mono text-xs leading-[1.5] bg-g-200 border-full-d rounded-md"
                ><code class="">{
  path: 'page-visibility',
  name: 'PermissionPageVisibility',
  component: '/examples/permission/page-visibility',
  meta: {
    title: 'menus.permission.pageVisibility',
    roles: ['R_SUPER'], // Chỉ siêu quản trị viên có thể truy cập
    keepAlive: true
  }
}</code></pre>
                <p class="m-0 mb-2 leading-[1.6] text-g-700"><strong>Quy trình xác thực quyền hạn：</strong></p>
                <ul class="pl-5 my-2">
                  <li class="my-1 leading-[1.5] text-g-700"
                    >Sau khi người dùng đăng nhập, API trả về thông tin vai trò người dùng (ví dụ: R_SUPER, R_ADMIN, R_USER)</li
                  >
                  <li class="my-1 leading-[1.5] text-g-700">
                    trong
                    <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                      >beforeEach</code
                    >
                    Trong route guard kiểm tra
                    <code class="px-1.5 py-0.5 font-mono text-xs text-theme bg-theme/12 rounded"
                      >roles</code
                    >
                    Cấu hình
                  </li>
                  <li class="my-1 leading-[1.5] text-g-700"
                    >So sánh vai trò người dùng có nằm trong danh sách vai trò được phép truy cập không</li
                  >
                  <li class="my-1 leading-[1.5] text-g-700">Không đủ quyền thì chuyển hướng đến trang 403</li>
                </ul>
              </ElCard>
            </ElTimelineItem>

            <ElTimelineItem timestamp="Chế độ điều khiển backend" type="warning" size="large">
              <ElCard shadow="never">
                <h4 class="m-0 mb-2 text-base font-semibold">Điều khiển quyền hạn dựa trên API menu</h4>
                <p class="m-0 mb-2 leading-[1.6] text-g-700"
                  >Trong chế độ điều khiển backend, quyền truy cập trang được quản lý thống nhất bởi backend, frontend tạo route có thể truy cập bằng cách phân tích danh sách menu trả về từ API backend, từ đó thực hiện điều khiển quyền hạn</p
                >
                <p class="m-0 mb-2 leading-[1.6] text-g-700"
                  >Địa chỉ API：src/api/menuApi.ts getMenuList</p
                >
                <pre
                  class="p-4 mt-3 mb-0 overflow-x-auto font-mono text-xs leading-[1.5] bg-g-200 border-full-d rounded-md"
                ><code class="">
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "path": "/permission",
      "name": "Permission",
      "component": "Layout",
      "meta": {
        "title": "menus.permission.title",
        "icon": ""
      },
      "children": [
        {
          "id": 11,
          "path": "page-visibility",
          "name": "PermissionPageVisibility",
          "component": "permission/page-visibility/index",
          "meta": {
            "title": "menus.permission.pageVisibility",
            "keepAlive": true
          }
        }
      ]
    }
  ]
}</code></pre>
                <p><strong>Quy trình xác thực quyền hạn：</strong></p>
                <ul>
                  <li>Sau khi người dùng đăng nhập thành công lấy Token</li>
                  <li>Frontend gọi API menu để lấy danh sách menu người dùng có thể truy cập</li>
                  <li>Frontend đăng ký route động dựa trên danh sách menu</li>
                  <li>Người dùng có thể truy cập bình thường các trang tồn tại trong menu, các trang không tồn tại sẽ chuyển hướng đến 404</li>
                </ul>
              </ElCard>
            </ElTimelineItem>

            <ElTimelineItem timestamp="Điều khiển hiển thị menu" type="success" size="large">
              <ElCard shadow="never">
                <h4>Khả năng hiển thị menu thanh bên</h4>
                <p><strong>Chế độ điều khiển frontend：</strong></p>
                <ul>
                  <li>Người dùng có quyền: Mục menu hiển thị bình thường, có thể click để truy cập</li>
                  <li>Người dùng không có quyền: Mục menu không hiển thị, không thể điều hướng đến trang qua menu</li>
                  <li>Ngay cả khi cố gắng truy cập bằng cách nhập trực tiếp URL, cũng sẽ bị route guard chặn</li>
                </ul>
                <p><strong>Chế độ điều khiển backend：</strong></p>
                <ul>
                  <li>Menu thanh bên được render dựa trên danh sách menu trả về từ backend</li>
                  <li>Backend nên lọc theo quyền hạn người dùng, chỉ trả về các mục menu người dùng có quyền truy cập</li>
                  <li>Frontend chỉ hiển thị menu trả về từ backend, đảm bảo người dùng chỉ có thể thấy và truy cập các trang có quyền</li>
                </ul>
              </ElCard>
            </ElTimelineItem>
          </ElTimeline>
        </div>
      </ElCard>
    </div>

    
    <div class="best-practices">
      <ElCard shadow="never" class="art-card-xs">
        <template #header>
          <div class="card-header">
            <span>Thực hành tốt nhất về điều khiển quyền hạn</span>
          </div>
        </template>
        <div class="practices-content">
          <ElRow :gutter="24">
            <ElCol :span="12" class="!mb-5">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#409EFF"><Lock /></ElIcon>
                </div>
                <div>
                  <h4>Xác thực quyền hạn nhiều lớp</h4>
                  <p class="text-g-700 text-sm"
                    >Thực hiện điều khiển quyền hạn ở nhiều cấp độ như route frontend, API backend, component UI để đảm bảo tính bảo mật.</p
                  >
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#67C23A"><User /></ElIcon>
                </div>
                <div>
                  <h4>Điều khiển truy cập dựa trên vai trò</h4>
                  <p class="text-g-700 text-sm"
                    >Áp dụng mô hình RBAC, phân bổ quyền hạn thông qua vai trò, đơn giản hóa độ phức tạp quản lý quyền hạn.</p
                  >
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#E6A23C"><Key /></ElIcon>
                </div>
                <div>
                  <h4>Điều khiển quyền hạn chi tiết</h4>
                  <p class="text-g-700 text-sm">Hỗ trợ điều khiển quyền hạn ở nhiều mức độ chi tiết như cấp trang, cấp nút, cấp dữ liệu.</p>
                </div>
              </div>
            </ElCol>
            <ElCol :span="12">
              <div class="flex-c">
                <div class="size-10 bg-g-200 flex-cc rounded mr-2">
                  <ElIcon size="20" color="#F56C6C"><View /></ElIcon>
                </div>
                <div>
                  <h4>Nguyên tắc ưu tiên bảo mật</h4>
                  <p class="text-g-700 text-sm"
                    >Luôn tuân theo nguyên tắc quyền hạn tối thiểu, đảm bảo người dùng chỉ có thể truy cập các chức năng và dữ liệu cần thiết.</p
                  >
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import { Lock, User, Key, View } from '@element-plus/icons-vue'
  import { useUserStore } from '@/store/modules/user'

  defineOptions({ name: 'PermissionPageVisibility' })

  const userStore = useUserStore()

  const currentUser = computed(() => userStore.info)

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      R_SUPER: 'Siêu quản trị viên',
      R_ADMIN: 'Quản trị viên',
      R_USER: 'Người dùng thường'
    }
    return roleMap[role] || 'Vai trò không xác định'
  }
</script>
