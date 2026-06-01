<template>
  <div class="pt-5">
    <h1 class="page-title">cơsở & tự定义theo钮+背景色</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="数据中心运行状态"
          subtitle="hệ统访问量cùng比增长 23%，sởCó服务运行稳定，数据监控正常。"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="欢迎sử dụngdùng Art Design Pro"
          subtitle="cơtại Vue 3 + TypeScript + Element Plus 构建现代化管理hệ统。"
          titleColor="#333"
          subtitleColor="#666"
          boxStyle="!bg-[#D4F1F7]"
          :buttonConfig="{
            show: true,
            text: '开始探索',
            color: 'var(--art-success)',
            textColor: '#fff',
            radius: '6px'
          }"
          @buttonClick="handleBannerClick"
        />
      </ElCol>
    </ElRow>

    <h1 class="page-title">tự定义图mảnh & sử dụngdùng slot tự定义内容</h1>

    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          title="探索星空计划"
          subtitle="加入tôi天文观测活动，发现宇宙奥秘"
          boxStyle="!bg-[#FF8AAB]"
          :buttonConfig="{
            show: true,
            text: '立tức参và',
            color: '#FF5A89',
            textColor: '#fff'
          }"
          :imageConfig="{
            src: icon3
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner
          boxStyle="!bg-[#70B1FF]"
          :imageConfig="{
            src: icon5
          }"
        >
          <template #title>
            <h2 style="margin: 0; font-size: 1.6rem; color: #fff !important">智có thểtổviệchệ统</h2>
          </template>

          <template #subtitle>
            <div style="margin-top: 12px">
              <p style="position: relative; z-index: 10; font-style: italic"
                >灵活配trí，强大扩展，支持tự定义插槽内容</p
              >
            </div>
          </template>

          <template #button>
            <div style="margin-top: 12px">
              <ElButton type="primary" color="#04A1FF"> Xem文档 </ElButton>
            </div>
          </template>
        </ArtBasicBanner>
      </ElCol>
    </ElRow>

    <h1 class="page-title">抽象配tríphươngán（Preset 模thức）</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner v-bind="PresetBanners.marketing" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" class="mb-5">
        <ArtBasicBanner v-bind="PresetBanners.info" />
      </ElCol>
    </ElRow>

    <h1 class="page-title">卡mảnh横幅</h1>
    <ElRow :gutter="20">
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          title="hệ统运行正常"
          description="sởCó核心服务运行稳定，响nên时giantrong正常范围内。"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon2"
          title="重cần消息thông知"
          description="BạnCó 3 điều待xứ理重cần消息，Vui lòngvà时Xem。"
          :button="{
            show: true,
            text: 'Xem详情',
            color: 'var(--art-warning)',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon3"
          title="数据phần析报告"
          description="本周nghiệp务数据phần析报告đã完成，Vui lòngXem关键指标。"
          :button="{
            show: true,
            text: 'Tải xuống报告',
            color: 'var(--art-error)',
            textColor: '#fff'
          }"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="12" :lg="6" class="mb-5">
        <ArtCardBanner
          :image="icon4"
          title="版本hơn新提醒"
          description="Art Design Pro v2.1.0 đã发布，包含性có thể优化và新côngcó thể。"
          :button="{
            show: true,
            text: '立tứchơn新',
            color: 'var(--theme-color)',
            textColor: '#fff'
          }"
          :cancelButton="{
            show: true,
            text: '稍后提醒',
            color: '#eee',
            textColor: '#333'
          }"
          @click="handleConfirm"
          @cancel="handleCancel"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import icon2 from '@imgs/3d/icon2.webp'
  import icon3 from '@imgs/3d/icon3.webp'
  import icon4 from '@imgs/3d/icon4.webp'
  import icon5 from '@imgs/3d/icon7.webp'

  defineOptions({ name: 'TemplateBanners' })

  const handleBannerClick = () => {
    console.log('banner clicked')
  }

  const handleConfirm = () => {
    console.log('confirm clicked')
  }

  const handleCancel = () => {
    console.log('cancel clicked')
  }

  const PresetBanners = {
    marketing: {
      title: '限时优惠活动',
      subtitle: '精选thươngphẩm 48 小时闪购，nhất高享受 7 折优惠，数量Có限！',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      boxStyle: '!bg-success/15',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: '立tức抢购',
        color: 'var(--art-success)',
        textColor: '#fff'
      }
    },
    info: {
      title: '服务đếnkỳ提醒',
      subtitle: 'Bạn高cấp服务sẽtrong 7 天后đếnkỳ，Vui lòngvà时续费để继续享受完整côngcó thể。',
      titleColor: 'var(--art-gray-900)',
      subtitleColor: 'var(--art-gray-900)',
      boxStyle: '!bg-theme/15',
      meteorConfig: { enabled: true, count: 15 },
      buttonConfig: {
        show: true,
        text: '立tức续费',
        color: 'var(--art-secondary)',
        textColor: '#fff'
      }
    }
  } as const
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .page-title {
    @apply my-5 text-xl font-medium first:mt-0;
  }
</style>
