
<template>
  <div class="page-content flex !p-0 max-md:flex-col" :style="{ height: containerMinHeight }">
    <ElRow>
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple" />
      </ElCol>
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple-light" />
      </ElCol>
    </ElRow>
    <div
      class="box-border w-90 h-full p-5 border-r border-g-300 max-md:w-full max-md:h-42 max-md:border-r-0"
    >
      <div class="pb-5 max-md:!hidden">
        <div class="flex-c gap-3">
          <ElAvatar :size="50" :src="selectedPerson?.avatar" />
          <div>
            <div class="text-base font-medium">{{ selectedPerson?.name }}</div>
            <div class="mt-1 text-xs text-g-500">{{ selectedPerson?.email }}</div>
          </div>
        </div>
        <div class="mt-3">
          <ElInput v-model="searchQuery" placeholder="Tìm kiếm liên hệ" prefix-icon="Search" clearable />
        </div>
        <ElDropdown trigger="click" placement="bottom-start">
          <span class="mt-5 c-p">
            Cách sắp xếp
            <ElIcon class="el-icon--right">
              <arrow-down />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>Sắp xếp theo thời gian</ElDropdownItem>
              <ElDropdownItem>Sắp xếp theo tên</ElDropdownItem>
              <ElDropdownItem>Đánh dấu tất cả là đã đọc</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
      <ElScrollbar>
        <div
          v-for="item in personList"
          :key="item.id"
          class="flex-c p-3 c-p rounded-lg tad-200 hover:bg-active-color/30 mb-1"
          :class="{ 'bg-active-color': selectedPerson?.id === item.id }"
          @click="selectPerson(item)"
        >
          <div class="relative mr-3">
            <ElAvatar :size="40" :src="item.avatar">
              {{ item.name.charAt(0) }}
            </ElAvatar>
            <div
              class="absolute right-1 bottom-1 size-2 rounded-full"
              :class="item.online ? 'bg-success/100' : 'bg-error/100'"
            ></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex-cb mb-1">
              <span class="text-sm font-medium">{{ item.name }}</span>
              <span class="text-xs text-g-600">{{ item.lastTime }}</span>
            </div>
            <div class="flex-cb">
              <span class="overflow-hidden text-xs text-g-600 text-ellipsis whitespace-nowrap">{{
                item.email
              }}</span>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <div class="box-border flex-1 h-full max-md:h-[calc(70%-30px)]">
      <div class="flex-cb pt-4 px-4 pb-0 mb-5">
        <div>
          <span class="text-base font-medium">Art Bot</span>
          <div class="flex-c gap-1 mt-1.5">
            <div
              class="w-2 h-2 rounded-full"
              :class="isOnline ? 'bg-success/100' : 'bg-danger/100'"
            ></div>
            <span class="text-xs text-g-600">{{ isOnline ? 'Trực tuyến' : 'Ngoại tuyến' }}</span>
          </div>
        </div>
        <div class="flex-c gap-2">
          <ArtIconButton icon="ri:phone-line" circle class="size-11 text-g-600" />
          <ArtIconButton icon="ri:video-on-line" circle class="size-11 text-g-600" />
          <ArtIconButton icon="ri:more-2-fill" circle class="size-11 text-g-600" />
        </div>
      </div>
      <div class="flex flex-col h-[calc(100%-85px)]">
        
        <div
          class="flex-1 py-7.5 px-4 overflow-y-auto border-t-d [&::-webkit-scrollbar]:!w-1"
          ref="messageContainer"
        >
          <template v-for="message in messages" :key="message.id">
            <div
              :class="[
                'flex gap-2 items-start w-full mb-7.5',
                message.isMe ? 'flex-row-reverse' : 'flex-row justify-start'
              ]"
            >
              <ElAvatar :size="32" :src="message.avatar" class="flex-shrink-0" />
              <div
                class="flex flex-col max-w-[70%]"
                :class="message.isMe ? 'items-end' : 'items-start'"
              >
                <div
                  class="flex gap-2 mb-1 text-xs"
                  :class="message.isMe ? 'flex-row-reverse' : 'flex-row'"
                >
                  <span class="font-medium">{{ message.sender }}</span>
                  <span class="text-g-600">{{ message.time }}</span>
                </div>
                <div
                  class="py-2.5 px-3.5 text-sm leading-[1.4] rounded-md"
                  :class="message.isMe ? '!bg-theme/15' : '!bg-active-color'"
                  >{{ message.content }}</div
                >
              </div>
            </div>
          </template>
        </div>

        
        <div class="p-4">
          <ElInput
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="Nhập tin nhắn"
            resize="none"
            @keyup.enter.prevent="sendMessage"
          >
            <template #append>
              <div class="flex gap-2 py-2">
                <ElButton :icon="Paperclip" circle plain />
                <ElButton :icon="Picture" circle plain />
                <ElButton type="primary" @click="sendMessage" v-ripple>Gửi</ElButton>
              </div>
            </template>
          </ElInput>
          <div class="flex-cb mt-3">
            <div class="flex-c">
              <ArtSvgIcon icon="ri:image-line" class="mr-5 c-p text-g-600 text-lg" />
              <ArtSvgIcon icon="ri:emotion-happy-line" class="mr-5 c-p text-g-600 text-lg" />
            </div>
            <ElButton type="primary" @click="sendMessage" v-ripple class="min-w-20">Gửi</ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Picture, Paperclip, ArrowDown } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import meAvatar from '@/assets/images/avatar/avatar5.webp'
  import aiAvatar from '@/assets/images/avatar/avatar10.webp'
  import avatar2 from '@/assets/images/avatar/avatar2.webp'
  import avatar3 from '@/assets/images/avatar/avatar3.webp'
  import avatar4 from '@/assets/images/avatar/avatar4.webp'
  import avatar5 from '@/assets/images/avatar/avatar5.webp'
  import avatar6 from '@/assets/images/avatar/avatar6.webp'
  import avatar7 from '@/assets/images/avatar/avatar7.webp'
  import avatar8 from '@/assets/images/avatar/avatar8.webp'
  import avatar9 from '@/assets/images/avatar/avatar9.webp'
  import avatar10 from '@/assets/images/avatar/avatar10.webp'
  import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight'

  defineOptions({ name: 'TemplateChat' })

  const { containerMinHeight } = useAutoLayoutHeight()

  interface Person {
    id: number
    name: string
    email: string
    avatar: string
    online?: boolean
    lastTime: string
    unread?: number
  }

  const searchQuery = ref('')
  const isDrawerVisible = ref(false)
  const isOnline = ref(true)
  const selectedPerson = ref<Person | null>(null)
  const messageText = ref('')
  const messageId = ref(10)
  const userAvatar = ref(meAvatar)
  const messageContainer = ref<HTMLElement | null>(null)

  const personList = ref<Person[]>([
    {
      id: 1,
      name: 'Melody·Messi',
      email: 'melody@altbox.com',
      avatar: meAvatar,
      online: true,
      lastTime: '20giờ trước',
      unread: 0
    },
    {
      id: 2,
      name: 'Mark·Smith',
      email: 'max@kt.com',
      avatar: avatar2,
      online: true,
      lastTime: '2tuần trước',
      unread: 6
    },
    {
      id: 3,
      name: 'Sean·Bean',
      email: 'sean@dellito.com',
      avatar: avatar3,
      online: false,
      lastTime: '5giờ trước',
      unread: 5
    },
    {
      id: 4,
      name: 'Alice·Johnson',
      email: 'alice@domain.com',
      avatar: avatar4,
      online: true,
      lastTime: '1giờ trước',
      unread: 2
    },
    {
      id: 5,
      name: 'Bob·Brown',
      email: 'bob@domain.com',
      avatar: avatar5,
      online: false,
      lastTime: '3ngày trước',
      unread: 1
    },
    {
      id: 6,
      name: 'Charlie·Davis',
      email: 'charlie@domain.com',
      avatar: avatar6,
      online: true,
      lastTime: '10phút trước',
      unread: 0
    },
    {
      id: 7,
      name: 'Diana·Prince',
      email: 'diana@domain.com',
      avatar: avatar7,
      online: true,
      lastTime: '15phút trước',
      unread: 3
    },
    {
      id: 8,
      name: 'Ethan·Hunt',
      email: 'ethan@domain.com',
      avatar: avatar8,
      online: true,
      lastTime: '5phút trước',
      unread: 0
    },
    {
      id: 9,
      name: 'Jessica·Jones',
      email: 'jessica@domain.com',
      avatar: avatar9,
      online: false,
      lastTime: '1ngày trước',
      unread: 4
    },
    {
      id: 10,
      name: 'Peter·Parker',
      email: 'peter@domain.com',
      avatar: avatar10,
      online: true,
      lastTime: '2giờ trước',
      unread: 1
    },
    {
      id: 11,
      name: 'Clark·Kent',
      email: 'clark@domain.com',
      avatar: avatar3,
      online: true,
      lastTime: '30phút trước',
      unread: 2
    },
    {
      id: 12,
      name: 'Bruce·Wayne',
      email: 'bruce@domain.com',
      avatar: avatar5,
      online: false,
      lastTime: '3ngày trước',
      unread: 0
    },
    {
      id: 13,
      name: 'Wade·Wilson',
      email: 'wade@domain.com',
      avatar: avatar6,
      online: true,
      lastTime: '10phút trước',
      unread: 5
    }
  ])

  const selectPerson = (person: Person) => {
    selectedPerson.value = person
  }

  const messages = ref([
    {
      id: 1,
      sender: 'Art Bot',
      content: 'Xin chào! Tôi là trợ lý AI của bạn, tôi có thể giúp gì cho bạn?',
      time: '10:00',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 2,
      sender: 'Ricky',
      content: 'Tôi muốn tìm hiểu cách sử dụng hệ thống.',
      time: '10:01',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 3,
      sender: 'Art Bot',
      content: 'Được, tôi sẽ giới thiệu các chức năng chính của hệ thống. Đầu tiên, bạn có thể truy cập các module chức năng khác nhau qua menu bên trái...',
      time: '10:02',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 4,
      sender: 'Ricky',
      content: 'Nghe có vẻ tốt, bạn có thể nói cụ thể về phần phân tích dữ liệu không?',
      time: '10:05',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 5,
      sender: 'Art Bot',
      content: 'Tất nhiên. Module phân tích dữ liệu có thể giúp bạn giám sát các chỉ số quan trọng theo thời gian thực và tạo báo cáo chi tiết...',
      time: '10:06',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 6,
      sender: 'Ricky',
      content: 'Tuyệt vời, vậy tôi bắt đầu sử dụng như thế nào?',
      time: '10:08',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 7,
      sender: 'Art Bot',
      content: 'Bạn có thể tạo một dự án trước, sau đó thêm các nguồn dữ liệu liên quan vào dự án, hệ thống sẽ tự động phân tích.',
      time: '10:09',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 8,
      sender: 'Ricky',
      content: 'Hiểu rồi, cảm ơn bạn đã giúp đỡ!',
      time: '10:10',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 9,
      sender: 'Art Bot',
      content: 'Không có gì, có bất kỳ câu hỏi nào hãy liên hệ với tôi bất cứ lúc nào.',
      time: '10:11',
      isMe: false,
      avatar: aiAvatar
    }
  ])

  const sendMessage = () => {
    const text = messageText.value.trim()
    if (!text) return

    messages.value.push({
      id: messageId.value++,
      sender: 'Ricky',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: userAvatar.value
    })

    messageText.value = ''
    scrollToBottom()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }, 100)
  }

  const openChat = () => {
    isDrawerVisible.value = true
  }

  onMounted(() => {
    scrollToBottom()
    mittBus.on('openChat', openChat)
    selectedPerson.value = personList.value[0]
  })
</script>
