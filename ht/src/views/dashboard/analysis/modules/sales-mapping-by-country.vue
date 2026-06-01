<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Phân bố doanh số toàn quốc</h4>
      </div>
    </div>

    <ArtRingChart
      :data="[
        { value: 30, name: 'Bắc Kinh' },
        { value: 25, name: 'Thượng Hải' },
        { value: 45, name: 'Quảng Châu' }
      ]"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['46%', '60%']"
    />
  </div>
</template>
