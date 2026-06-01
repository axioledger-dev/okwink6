<template>
  <div class="art-card p-5 mb-5 h-105 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Xu hướng bán hàng</h4>
        <p>So sánh doanh số theo tháng</p>
      </div>
    </div>

    <ArtDualBarCompareChart
      :positiveData="[50, 80, 120, 90, 60]"
      :negativeData="[30, 60, 90, 70, 40]"
      :xAxisData="['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5']"
      height="19rem"
    />
  </div>
</template>
