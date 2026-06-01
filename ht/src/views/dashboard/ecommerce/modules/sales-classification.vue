<template>
  <div class="art-card p-5 mb-5 h-105 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Phân loại bán hàng</h4>
        <p>Theo danh mục sản phẩm</p>
      </div>
    </div>

    <ArtRingChart
      :data="[
        { value: 30, name: 'Điện tử' },
        { value: 55, name: 'Thời trang' },
        { value: 36, name: 'Gia dụng' }
      ]"
      :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
      :radius="['70%', '80%']"
      height="16.5rem"
      :showLabel="false"
      :borderRadius="0"
      centerText="¥300,458"
    />
    <div class="flex justify-around">
      <div class="flex-c">
        <div class="flex-cc size-10.5 mr-2.5 text-theme bg-theme/10 rounded-lg">
          <ArtSvgIcon icon="ri:money-cny-circle-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥500,458</p>
          <span class="text-sm">Tổng doanh thu</span>
        </div>
      </div>
      <div class="flex-c">
        <div class="flex-cc size-10.5 mr-2.5 text-theme bg-theme/10 rounded-lg">
          <ArtSvgIcon icon="ri:heart-3-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥130,580</p>
          <span class="text-sm">Lợi nhuận ròng</span>
        </div>
      </div>
    </div>
  </div>
</template>
