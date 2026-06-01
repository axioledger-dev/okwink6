export default [
  {
    path: '/im',
    component: () => import('@/views/im/ImLayout.vue'),
    redirect: '/im/chats',
    children: [
      {
        path: 'chats',
        name: 'ImChats',
        component: () => import('@/views/im/ConversationList.vue'),
        meta: { title: 'Tin nhắn', requiresAuth: true }
      },
      {
        path: 'contacts',
        name: 'ImContacts',
        component: () => import('@/views/im/Contacts.vue'),
        meta: { title: 'Danh bạ', requiresAuth: true }
      },
      {
        path: 'mine',
        name: 'ImMine',
        component: () => import('@/views/im/Mine.vue'),
        meta: { title: 'Của tôi', requiresAuth: true }
      }
    ]
  },
  {
    path: '/im/friend-requests',
    name: 'FriendRequests',
    component: () => import('@/views/im/FriendRequests.vue'),
    meta: {
      title: 'Bạn bè mới',
      requiresAuth: true
    }
  },
  {
    path: '/im/add-friend',
    name: 'AddFriend',
    component: () => import('@/views/im/AddFriend.vue'),
    meta: {
      title: 'Thêm bạn bè',
      requiresAuth: true
    }
  },
  {
    path: '/im/chat/:chatId',
    name: 'ImChat',
    component: () => import('@/views/im/Chat.vue'),
    meta: {
      title: 'Trò chuyện',
      requiresAuth: true
    }
  },
  {
    path: '/im/group/:groupId/members',
    name: 'GroupMembers',
    component: () => import('@/views/im/GroupMembers.vue'),
    meta: {
      title: 'Thành viên nhóm',
      requiresAuth: true
    }
  },
  {
    path: '/im/user/:userId',
    name: 'UserProfile',
    component: () => import('@/views/im/UserProfile.vue'),
    meta: {
      title: 'Thông tin người dùng',
      requiresAuth: true
    }
  }
]
