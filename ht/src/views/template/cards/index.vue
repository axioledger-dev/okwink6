<template>
  <div class="py-5">
    <h1 class="page-title">统计卡mảnh（文字）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id" class="mb-5">
        <ArtStatsCard
          :icon="card.icon"
          :iconStyle="card.iconStyle"
          :title="card.title"
          :description="card.description"
          :showArrow="card.showArrow"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">统计卡mảnh（数字滚动）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id" class="mb-5">
        <ArtStatsCard
          :icon="card.icon"
          :iconStyle="card.iconStyle"
          :count="card.count"
          :description="card.description"
          :decimals="0"
          :showArrow="card.showArrow"
          separator=","
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">统计卡mảnh（tự定义dạngthức）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id" class="mb-5">
        <ArtStatsCard
          :icon="card.icon"
          :iconStyle="card.customIconStyle"
          :boxStyle="card.boxStyle"
          :title="card.title"
          :description="card.description"
          :textColor="card.textColor"
          :showArrow="card.showArrow"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">进độ卡mảnh</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id" class="mb-5">
        <ArtProgressCard :percentage="card.percentage" :title="card.title" :color="card.color" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">进độ卡mảnh（icon）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id" class="mb-5">
        <ArtProgressCard
          :percentage="card.percentage"
          :title="card.title"
          :color="card.color"
          :icon="card.icon"
          :iconStyle="card.iconStyle"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">图表卡mảnh（小图表）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtLineChartCard
          :isMiniChart="true"
          :value="2545"
          label="新dùnghộ"
          date="qua去7天"
          :percentage="1.2"
          :height="9.5"
          :chartData="[120, 132, 101, 134, 90, 230, 210]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtBarChartCard
          :isMiniChart="true"
          :value="15480"
          label="浏览量"
          date="qua去 14 天"
          :percentage="-4.15"
          :height="9.5"
          :barWidth="'45%'"
          :chartData="[120, 100, 150, 140, 90, 120, 130]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtLineChartCard
          :isMiniChart="true"
          :value="2545"
          label="hồng丝数"
          date="qua去 30 天"
          :percentage="1.2"
          :height="9.5"
          :showAreaColor="true"
          :chartData="[150, 180, 160, 200, 180, 220, 240]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtDonutChartCard
          :value="36358"
          title="hồng丝量"
          :percentage="18"
          percentageLabel="较去年"
          :data="[50, 40]"
          :height="9.5"
          currentValue="2022"
          previousValue="2021"
          :radius="['50%', '70%']"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">图表卡mảnh（大图表）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtLineChartCard
          :value="2545"
          label="新dùnghộ"
          :percentage="1.2"
          :height="11"
          :chartData="[120, 132, 101, 134, 90, 230, 210]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtBarChartCard
          :value="15480"
          label="浏览量"
          :percentage="-4.15"
          :height="11"
          :chartData="[120, 100, 150, 140, 90, 120, 130, 110]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtLineChartCard
          :value="2545"
          label="hồng丝数"
          :percentage="1.2"
          :height="11"
          :showAreaColor="true"
          :chartData="[150, 180, 160, 200, 180, 220, 240]"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6" class="mb-5">
        <ArtDonutChartCard
          :value="36358"
          title="hồng丝量"
          :percentage="-18"
          percentageLabel="较2021年"
          :data="[70, 30]"
          :height="11"
          currentValue="12月"
          previousValue="11月"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">数据dãy表卡mảnh</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :lg="8" class="mb-5">
        <ArtDataListCard :list="dataList" title="Việc cần làmsựmục" subtitle="今日待xứ理任务" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :lg="8" class="mb-5">
        <ArtDataListCard
          :maxCount="4"
          :list="dataList"
          title="nhất近活动"
          subtitle="近kỳ活动dãy表"
          :showMoreButton="true"
          @more="handleMore"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :lg="8" class="mb-5">
        <ArtTimelineListCard :list="timelineData" title="nhất近交易" subtitle="2024年12月20日" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">图mảnh卡mảnh</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="6" v-for="card in imageCards" :key="card.id" class="mb-5">
        <ArtImageCard
          :imageUrl="card.imageUrl"
          :title="card.title"
          :category="card.category"
          :readTime="card.readTime"
          :views="card.views"
          :comments="card.comments"
          :date="card.date"
          @click="handleImageCardClick(card)"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import cover1 from '@imgs/cover/img1.webp'
  import cover2 from '@imgs/cover/img2.webp'
  import cover3 from '@imgs/cover/img3.webp'
  import cover4 from '@imgs/cover/img4.webp'

  defineOptions({ name: 'TemplateCards' })

  const statsCards = [
    {
      id: 1,
      title: '销售sảnphẩm',
      count: 1235,
      description: '鞋子、牛仔裤、派với服装、手表',
      icon: 'ri:bar-chart-box-line',
      boxStyle: '!bg-theme/10',
      customIconStyle: '!text-theme !text-3xl',
      iconStyle: 'bg-info',
      textColor: 'var(--theme-color)',
      showArrow: false
    },
    {
      id: 2,
      title: '活跃dùnghộ',
      count: 5000,
      description: '日活跃dùnghộ超qua5,000+',
      icon: 'ri:account-box-2-line',
      boxStyle: '!bg-warning/10',
      customIconStyle: '!text-warning !text-3xl',
      iconStyle: 'bg-warning',
      textColor: 'var(--art-warning)',
      showArrow: false
    },
    {
      id: 3,
      title: '总收入',
      count: 35000,
      description: '月收入超qua¥350,000+',
      icon: 'ri:money-cny-box-line',
      boxStyle: '!bg-secondary/10',
      customIconStyle: '!text-secondary !text-3xl',
      iconStyle: 'bg-secondary',
      textColor: 'var(--art-secondary)',
      showArrow: false
    },
    {
      id: 4,
      title: '客hộ评价',
      count: 4800,
      description: '平均评phần4.8/5',
      icon: 'ri:message-3-line',
      boxStyle: '!bg-error/10',
      customIconStyle: '!text-error !text-3xl',
      iconStyle: 'bg-error',
      textColor: 'var(--art-error)',
      showArrow: false
    }
  ]

  const progressCards = [
    {
      id: 1,
      title: '完成进độ',
      percentage: 75,
      color: 'var(--art-success)',
      icon: 'ri:arrow-up-circle-line',
      iconStyle: 'bg-success/12 text-success'
    },
    {
      id: 2,
      title: 'dự án进độ',
      percentage: 65,
      color: 'var(--theme-color)',
      icon: 'ri:twitch-line',
      iconStyle: 'bg-theme/12 text-theme'
    },
    {
      id: 3,
      title: '学习进độ',
      percentage: 45,
      color: 'var(--art-error)',
      icon: 'ri:game-line',
      iconStyle: '!bg-error/12 text-error'
    },
    {
      id: 4,
      title: '任务进độ',
      percentage: 90,
      color: 'var(--art-secondary)',
      icon: 'ri:flag-2-line',
      iconStyle: 'bg-secondary/12 text-secondary'
    }
  ]

  const imageCards = [
    {
      id: 1,
      imageUrl: cover1,
      title: 'AI技术trong医疗领vực创新nêndùngvà发展前景',
      category: '社交',
      readTime: '2phần钟',
      views: 9125,
      comments: 3,
      date: '12月19日 周一'
    },
    {
      id: 2,
      imageUrl: cover2,
      title: '大数据phần析助力doanhnghiệp决策实践ánví dụ',
      category: '技术',
      readTime: '3phần钟',
      views: 7234,
      comments: 5,
      date: '12月20日 周二'
    },
    {
      id: 3,
      imageUrl: cover3,
      title: 'khukhối链技术trong供nên链管理中nêndùng',
      category: 'khoa技',
      readTime: '4phần钟',
      views: 5678,
      comments: 8,
      date: '12月21日 周三'
    },
    {
      id: 4,
      imageUrl: cover4,
      title: 'mây计算技术发展趋势vàchưa来展望',
      category: 'mây技术',
      readTime: '5phần钟',
      views: 4321,
      comments: 6,
      date: '12月22日 周四'
    }
  ]

  const dataList = [
    {
      title: '新加dốc之行',
      status: '进行中',
      time: '5phần钟',
      class: 'bg-theme/12 text-theme',
      icon: 'ri:camera-4-line'
    },
    {
      title: '归档数据',
      status: '进行中',
      time: '10phần钟',
      class: 'bg-secondary/12 text-secondary',
      icon: 'ri:bar-chart-box-line'
    },
    {
      title: '客hộsẽ议',
      status: '待xứ理',
      time: '15phần钟',
      class: 'bg-warning/12 text-warning',
      icon: 'ri:user-3-line'
    },
    {
      title: '筛选任务团đội',
      status: '进行中',
      time: '20phần钟',
      class: 'bg-error/12 text-error',
      icon: 'ri:account-circle-line'
    },
    {
      title: '发送信封cho小王',
      status: 'đã完成',
      time: '20phần钟',
      class: 'bg-success/12 text-success',
      icon: 'ri:message-3-line'
    }
  ]

  const timelineData = [
    {
      time: '上午 09:30',
      status: 'rgb(73, 190, 255)',
      content: '收đến John Doe 支付 385.90 美元'
    },
    {
      time: '上午 10:00',
      status: 'rgb(54, 158, 255)',
      content: '新销售记录',
      code: 'ML-3467'
    },
    {
      time: '上午 12:00',
      status: 'rgb(103, 232, 207)',
      content: 'hướng Michael 支付 64.95 美元'
    },
    {
      time: '下午 14:30',
      status: 'rgb(255, 193, 7)',
      content: 'hệ统维护thông知',
      code: 'MT-2023'
    },
    {
      time: '下午 15:45',
      status: 'rgb(255, 105, 105)',
      content: '紧急订单Hủy提醒',
      code: 'OR-9876'
    },
    {
      time: '下午 17:00',
      status: 'rgb(103, 232, 207)',
      content: '完成mỗi日销售报表'
    }
  ]

  const handleMore = () => {
    ElMessage.info('Xemhơn多')
  }

  interface ImageCard {
    id: number
    imageUrl: string
    title: string
    category: string
    readTime: string
    views: number
    comments: number
    date: string
  }

  const handleImageCardClick = (card: ImageCard) => {
    console.log('điểm击卡mảnh:', card)
  }
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .page-title {
    @apply my-5 text-xl font-medium first:mt-0;
  }
</style>
