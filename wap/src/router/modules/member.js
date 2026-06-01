export default [
  {
    path: '/member/records',
    name: 'MemberRecords',
    component: () => import('@/views/member/MemberRecords.vue'),
    meta: {
      title: 'Lịch sử giao dịch',
      requiresAuth: true
    }
  },
  {
    path: '/member',
    name: 'MemberCenter',
    component: () => import('@/views/member/MemberIndexNew.vue'),
    meta: {
      title: 'Trang cá nhân',
      requiresAuth: true
    }
  },
  {
    path: '/security',
    name: 'SecurityCenter',
    component: () => import('@/views/security/V5SecurityCenter.vue'),
    meta: {
      title: 'Trung tâm bảo mật',
      requiresAuth: true
    }
  },
  {
    path: '/security/realname',
    name: 'SecurityRealName',
    component: () => import('@/views/security/RealName.vue'),
    meta: { title: 'Xác thực danh tính', requiresAuth: true }
  },
  {
    path: '/security/phone',
    name: 'SecurityPhone',
    component: () => import('@/views/security/V5PhoneBind.vue'),
    meta: { title: 'Số điện thoại bảo mật', requiresAuth: true }
  },
  {
    path: '/security/email',
    name: 'SecurityEmail',
    component: () => import('@/views/security/V5EmailBind.vue'),
    meta: { title: 'Email bảo mật', requiresAuth: true }
  },
  {
    path: '/security/google',
    name: 'SecurityGoogle',
    component: () => import('@/views/security/V5GoogleBind.vue'),
    meta: { title: 'Liên kết Google Authenticator', requiresAuth: true }
  },
  {
    path: '/security/question',
    name: 'SecurityQuestion',
    component: () => import('@/views/security/V5SecurityQuestion.vue'),
    meta: { title: 'Câu hỏi bảo mật', requiresAuth: true }
  },
  {
    path: '/security/login-pwd',
    name: 'SecurityLoginPwd',
    component: () => import('@/views/security/V5LoginPwd.vue'),
    meta: { title: 'Đổi mật khẩu đăng nhập', requiresAuth: true }
  },
  {
    path: '/security/fund-pwd',
    name: 'SecurityFundPwd',
    component: () => import('@/views/security/V5FundPwd.vue'),
    meta: { title: 'Đổi mật khẩu giao dịch', requiresAuth: true }
  },
  {
    path: '/security/devices',
    name: 'LoginDevice',
    component: () => import('@/views/security/LoginDevice.vue'),
    meta: { title: 'Thiết bị đăng nhập', requiresAuth: true }
  },
  {
    path: '/member/history',
    name: 'MemberGameHistory',
    component: () => import('@/views/member/GameHistory.vue'),
    meta: {
      title: 'Lịch sử đặt cược',
      requiresAuth: true
    }
  },
  {
    path: '/member/invite',
    name: 'MemberInvite',
    component: () => import('@/views/invite/ShareEarn.vue'),
    meta: {
      title: 'Mời bạn nhận thưởng',
      requiresAuth: true
    }
  },
  {
    path: '/account/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/account/ChangePassword.vue'),
    meta: {
      title: 'Đổi mật khẩu',
      requiresAuth: true
    }
  },
  {
    path: '/member/recover-balance',
    name: 'RecoverBalance',
    component: () => import('@/views/member/RecoverBalance.vue'),
    meta: {
      title: 'Khôi phục số dư',
      requiresAuth: true
    }
  }
]
