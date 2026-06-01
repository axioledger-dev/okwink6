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
  },
  {
    path: '/payment/deposit',
    name: 'PaymentDeposit',
    component: () => import('@/views/payment/DepositNew.vue'),
    meta: {
      title: 'Nạp tiền',
      requiresAuth: true
    }
  },
  {
    path: '/payment/withdraw',
    name: 'PaymentWithdraw',
    component: () => import('@/views/payment/WithdrawNew.vue'),
    meta: {
      title: 'Rút tiền',
      requiresAuth: true
    }
  },
  {
    path: '/account/transfer',
    name: 'AccountTransfer',
    component: () => import('@/views/account/WalletTransfer.vue'),
    meta: {
      title: 'Chuyển quỹ',
      requiresAuth: true
    }
  },
  {
    path: '/account/user-transfer',
    name: 'AccountUserTransfer',
    component: () => import('@/views/account/UserTransfer.vue'),
    meta: {
      title: 'Chuyển tiền người dùng',
      requiresAuth: true
    }
  },
  {
    path: '/account/fanshui',
    name: 'AccountFanshui',
    component: () => import('@/views/account/Fanshui.vue'),
    meta: {
      title: 'Hoàn trả',
      requiresAuth: true
    }
  },
  {
    path: '/account/fanshui-rate',
    name: 'AccountFanshuiRate',
    component: () => import('@/views/account/FanshuiRate.vue'),
    meta: {
      title: 'Tỷ lệ hoàn trả',
      requiresAuth: false
    }
  },
  {
    path: '/account/today-stats',
    name: 'AccountTodayStats',
    component: () => import('@/views/account/TodayStats.vue'),
    meta: {
      title: 'Thống kê hôm nay',
      requiresAuth: true
    }
  },
  {
    path: '/account/bill',
    name: 'AccountBill',
    component: () => import('@/views/account/TimiBillRecord.vue'),
    meta: {
      title: 'Lịch sử giao dịch',
      requiresAuth: true
    }
  },
  {
    path: '/yue-bao-center',
    name: 'YueBaoCenter',
    redirect: '/interest'
  },
  {
    path: '/yue-bao/transfer-out',
    name: 'YueBaoTransferOut',
    redirect: '/interest'
  },
  {
    path: '/yue-bao/transfer-in',
    name: 'YueBaoTransferIn',
    redirect: '/interest'
  },
  {
    path: '/yue-bao/service',
    name: 'YueBaoService',
    redirect: '/service/online'
  },
  {
    path: '/service',
    name: 'Service',
    redirect: '/service/online',
    children: [
      {
        path: 'online',
        name: 'ServiceOnline',
        component: () => import('@/views/service/Chat.vue'),
        meta: { title: 'CSKH Trực tuyến' }
      },
      {
        path: 'chat',
        name: 'ServiceChat',
        component: () => import('@/views/service/Chat.vue'),
        meta: { title: 'Hội thoại CSKH' }
      }
    ]
  },
  {
    path: '/help',
    name: 'HelpCenter',
    component: () => import('@/views/userCenter/HelpCenter.vue'),
    meta: { title: 'Trung tâm trợ giúp' }
  },
  {
    path: '/notice',
    name: 'NoticeCenter',
    component: () => import('@/views/other/MessageCenter.vue'),
    meta: { title: 'Trung tâm thông báo' }
  },
  {
    path: '/notice/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/other/NoticeDetail.vue'),
    meta: { title: 'Chi tiết thông báo' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/other/About.vue'),
    meta: { title: 'Về chúng tôi' }
  }
]
