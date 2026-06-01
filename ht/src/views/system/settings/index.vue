<template>
  <div class="p-4 min-h-[calc(100vh-100px)] relative pb-20">
    
    <div class="bg-box rounded-lg shadow-sm p-2 mb-4 sticky top-0 z-10 mx-[-16px] px-6 border-b border-full-d sm:mx-0 sm:px-2">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <template #label>
            <div class="flex items-center gap-2 px-2 py-1">
              <i :class="tab.icon" class="text-lg"></i>
              <span class="font-medium">{{ tab.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    
    <div class="space-y-4">
      <el-form 
        ref="formRef"
        :model="form" 
        label-position="top"
        class="w-full"
      >
        
        <div v-show="activeTab === 'basic'" class="animate-fade-in space-y-4">
          <div class="bg-box p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Thông tin cơ bản</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="Tên website">
                <el-input v-model="form.webtitle" placeholder="Vui lòng nhập tên website" />
              </el-form-item>
              <el-form-item label="Tên miền dễ nhớ">
                <el-input v-model="form.sitedomain" placeholder="Ví dụ: 2015.com">
                  <template #prefix><ArtSvgIcon icon="ri:global-line" /></template>
                </el-input>
                <div class="text-xs text-g-400 mt-1">Dùng để hiển thị tên miền dễ nhớ trong popup đăng nhập</div>
              </el-form-item>
              <el-form-item label="Từ khóa">
                <el-input v-model="form.keywords" placeholder="Từ khóa SEO, phân cách bằng dấu phẩy" />
              </el-form-item>
              <el-form-item label="Mô tả website" class="md:col-span-2">
                <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Thông tin mô tả website" />
              </el-form-item>
              <el-form-item label="Nội dung quảng cáo" class="md:col-span-2">
                <el-input v-model="form.promo_texts" type="textarea" :rows="4" placeholder="Khẩu hiệu quảng cáo popup đăng nhập, mỗi dòng một mục, Ví dụ:&#10;🥇Lựa chọn tốt nhất cho người yêu game toàn cầu🥇&#10;🌈Trải nghiệm giải trí game đa dạng🌈" />
                <div class="text-xs text-g-400 mt-1">Khẩu hiệu quảng cáo hiển thị trong popup đăng nhập/đăng ký, mỗi dòng một mục</div>
              </el-form-item>
              <el-form-item label="Mã giới thiệu mặc định">
                <el-input v-model="form.defaulttjcode">
                  <template #prefix><ArtSvgIcon icon="ri:share-forward-line" /></template>
                </el-input>
                <div class="text-xs text-g-400 mt-1">Chỉ hiển thị cho đăng ký người dùng thường</div>
              </el-form-item>
            </div>
          </div>

          <div class="bg-box p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Kiểm soát truy cập</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="Bảo vệ đăng nhập frontend">
                <div class="flex items-center gap-2 p-3 bg-g-50 rounded border-full-d w-full">
                  <span>Lỗi liên tục</span>
                  <el-input-number v-model="form.loginerrornum_q" :min="0" controls-position="right" class="!w-20" />
                  <span>lần, khóa</span>
                  <el-input-number v-model="form.loginerrorclosetime_q" :min="0" controls-position="right" class="!w-20" />
                  <span>giờ</span>
                </div>
              </el-form-item>
              
              <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border-full-d rounded-lg p-4">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-medium text-g-700">Danh sách IP đen</span>
                    <el-switch v-model="form.ipblackisopen" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-input v-model="form.ipblacklist" type="textarea" :rows="4" placeholder="Mỗi dòng một địa chỉ IP" :disabled="!form.ipblackisopen" />
                </div>
                <div class="border-full-d rounded-lg p-4">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-medium text-g-700">Danh sách IP trắng</span>
                    <el-switch v-model="form.ipwhiteisopen" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-input v-model="form.ipwhitelist" type="textarea" :rows="4" placeholder="Mỗi dòng một địa chỉ IP" :disabled="!form.ipwhiteisopen" />
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div v-show="activeTab === 'operation'" class="animate-fade-in space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 bg-box p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Quy tắc tài chính</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <el-form-item label="Thời gian mở rút tiền">
                  <div class="flex items-center gap-2 w-full">
                    <el-time-picker v-model="form.tikuanstart" value-format="HH:mm" format="HH:mm" class="!flex-1" placeholder="Bắt đầu" />
                    <span class="text-g-400">-</span>
                    <el-time-picker v-model="form.tikuanend" value-format="HH:mm" format="HH:mm" class="!flex-1" placeholder="Kết thúc" />
                  </div>
                </el-form-item>
                <el-form-item label="Doanh số cược yêu cầu khi rút tiền (%)">
                  <el-input-number v-model="form.damaliang" :min="0" :max="100" controls-position="right" class="w-full" />
                </el-form-item>
                
                <div class="md:col-span-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div class="text-sm font-bold text-primary mb-3">Hạn mức rút tiền (đồng)</div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <el-form-item label="Tối thiểu mỗi lần" class="mb-0">
                      <el-input-number v-model="form.tikuanMin" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Tối đa mỗi lần" class="mb-0">
                      <el-input-number v-model="form.tikuanMax" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Hạn mức tích lũy ngày" class="mb-0">
                      <el-input-number v-model="form.ritikuanxiane" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Số lần rút tiền mỗi ngày" class="mb-0">
                      <el-input-number v-model="form.tikuannum" :min="0" :controls="false" class="w-full" />
                    </el-form-item>
                  </div>
                </div>

                <div class="md:col-span-2 p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div class="text-sm font-bold text-warning mb-3">Phí rút tiền vượt hạn mức</div>
                  <div class="flex flex-wrap items-end gap-4">
                    <el-form-item label="Phí (%)" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumoverbilv" :min="0" :max="100" controls-position="right" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Phí tối thiểu" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumovermin" :min="0" controls-position="right" class="w-full" />
                    </el-form-item>
                    <el-form-item label="Phí tối đa" class="mb-0 flex-1 min-w-[120px]">
                      <el-input-number v-model="form.tikuannumovermax" :min="0" controls-position="right" class="w-full" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-box p-6 rounded-lg shadow-sm h-fit">
                <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Cấu hình giao diện</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-g-50 rounded">
                    <span>NGAPI</span>
                    <el-switch v-model="form.switch_ng" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-form-item label="API Account" class="mb-0">
                    <el-input v-model="form.api_account" />
                  </el-form-item>
                  <el-form-item label="Sign Key" class="mb-0">
                    <el-input v-model="form.sign_key" show-password />
                  </el-form-item>
                </div>
              </div>

              <div class="bg-box p-6 rounded-lg shadow-sm h-fit">
                <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Quy tắc khác</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 bg-g-50 rounded">
                    <span>Cho phép hủy đơn</span>
                    <el-switch v-model="form.iskillorder" :active-value="1" :inactive-value="0" />
                  </div>
                  <el-form-item label="Số thẻ liên kết tối đa" class="mb-0">
                    <el-input-number v-model="form.sysBankMaxNum" :min="1" controls-position="right" class="w-full" />
                  </el-form-item>
                  <el-form-item label="Số người xếp hàng cơ sở" class="mb-0">
                    <el-input-number v-model="form.paiduinum" :min="0" controls-position="right" class="w-full" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-box p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Hoàn điểm và chăm sóc khách hàng</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <el-form-item label="Hoàn điểmphạm vi (%)">
                <div class="flex items-center gap-2">
                  <el-input-number v-model="form.fanDianMin" :min="0" :max="100" :precision="1" :controls="false" class="!w-20" />
                  <span>-</span>
                  <el-input-number v-model="form.fanDianMax" :min="0" :max="100" :precision="1" :controls="false" class="!w-20" />
                </div>
              </el-form-item>
              <el-form-item label="Tích lũy nạp tiền (đồng/điểm)">
                <div class="flex items-center gap-2">
                  <el-input-number v-model="form.pointchongzhi" :min="1" :controls="false" class="!w-20" />
                  <span>:</span>
                  <el-input-number v-model="form.pointchongzhiadd" :min="0" :controls="false" class="!w-20" />
                </div>
              </el-form-item>
              <div class="md:col-span-1 space-y-4">
                <el-input v-model="form.kefuqq" placeholder="chăm sóc khách hàngQQ">
                  <template #prefix><ArtSvgIcon icon="ri:qq-line" /></template>
                </el-input>
                <el-input v-model="form.kefuthree" placeholder="Liên kết chăm sóc khách hàng">
                  <template #prefix><ArtSvgIcon icon="ri:link" /></template>
                </el-input>
              </div>
            </div>
          </div>
        </div>

        
        <div v-show="activeTab === 'backend'" class="animate-fade-in space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-box p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Bảo mật đăng nhập backend</h3>
              <el-form-item label="Giới hạn đăng nhập thất bại">
                <div class="flex items-center gap-2 w-full bg-danger/10 p-3 rounded border border-danger/20">
                  <span class="text-g-600">Lỗi</span>
                  <el-input-number v-model="form.loginerrornum" :min="0" controls-position="right" class="!w-20" />
                  <span class="text-g-600">lần, khóa</span>
                  <el-input-number v-model="form.loginerrorclosetime" :min="0" controls-position="right" class="!w-20" />
                  <span class="text-g-600">giờ</span>
                </div>
              </el-form-item>
              <div class="flex items-center justify-between p-4 mt-4 bg-g-50 rounded-lg">
                <div class="font-medium">Mã xác thực hình ảnh</div>
                <el-switch v-model="form.islogincode" :active-value="1" :inactive-value="0" />
              </div>
            </div>

            <div class="bg-box p-6 rounded-lg shadow-sm">
              <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Xác thực email đăng nhập</h3>
              <div class="flex items-center justify-between p-4 bg-g-50 rounded-lg mb-4">
                <div class="font-medium">Trạng thái bật/tắt</div>
                <el-switch v-model="form.isemailcode" :active-value="1" :inactive-value="0" />
              </div>
              <div class="space-y-4">
                <el-form-item label="Thời hạn mã xác thực (giây)">
                  <el-input-number v-model="form.adminemailcodetime" :min="0" controls-position="right" class="w-full" />
                </el-form-item>
                <el-form-item label="Email nhận mã xác thực">
                  <el-input v-model="form.getemailcode" placeholder="Dùng để nhận mã xác thực" />
                </el-form-item>
              </div>
              <div class="mt-4 text-xs text-warning bg-warning/10 p-2 rounded">
                <i class="ri-alert-line align-bottom mr-1"></i>
                Vui lòng đảm bảo cấu hình máy chủ email chính xác, nếu không sẽ không nhận được mã xác thực.
              </div>
            </div>
          </div>
        </div>

        
        <div v-show="activeTab === 'mail'" class="animate-fade-in">
          <div class="bg-box p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Cấu hình máy chủ SMTP</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <el-form-item label="Địa chỉ máy chủ" class="md:col-span-2">
                <el-input v-model="form.SMTP_HOST" placeholder="Ví dụ: smtp.exmail.qq.com">
                  <template #prefix><ArtSvgIcon icon="ri:server-line" /></template>
                </el-input>
              </el-form-item>
              <el-form-item label="Cổng">
                <el-input v-model="form.SMTP_PORT" placeholder="465 / 587" />
              </el-form-item>
              <el-form-item label="Giao thức mã hóa">
                <el-radio-group v-model="form.SMTP_SSL" class="w-full">
                  <el-radio-button :label="1">SSL / TLS</el-radio-button>
                  <el-radio-button :label="0">None</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Tài khoản">
                <el-input v-model="form.SMTP_USER" placeholder="Tài khoản email" />
              </el-form-item>
              <el-form-item label="Mật khẩu / Mã ủy quyền">
                <el-input v-model="form.SMTP_PASS" type="password" show-password placeholder="Mật khẩu" />
              </el-form-item>
              
              <div class="md:col-span-2 border-t border-full-d my-2 pt-4">
                <h4 class="text-sm font-bold text-g-700 mb-4">Thông tin người gửi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <el-form-item label="Tên người gửi">
                    <el-input v-model="form.FROM_NAME" />
                  </el-form-item>
                  <el-form-item label="Email người gửi">
                    <el-input v-model="form.FROM_EMAIL" />
                  </el-form-item>
                  <el-form-item label="Tên trả lời">
                    <el-input v-model="form.REPLY_NAME" />
                  </el-form-item>
                  <el-form-item label="Email trả lời">
                    <el-input v-model="form.REPLY_EMAIL" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div v-show="activeTab === 'other'" class="animate-fade-in space-y-4">
          <div class="bg-box p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Giao diện và truy cập</h3>
            <div class="grid grid-cols-1 gap-6">
              <el-form-item label="URL giao diện thu thập">
                <el-input v-model="form.caijieapiurl" placeholder="http://..." />
              </el-form-item>
              <el-form-item label="IP được phép truy cập frontend">
                <el-input v-model="form.weballowips" type="textarea" :rows="3" placeholder="Giới hạn frontend chỉ có thể truy cập từ IP cụ thể, để trống nếu không giới hạn" />
              </el-form-item>
            </div>
          </div>

          <div class="bg-box p-6 rounded-lg shadow-sm">
            <h3 class="text-base font-bold text-g-800 mb-6 border-l-4 border-primary pl-3">Cấu hình thông báo âm thanh</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div class="border-full-d rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-g-50': !form.czaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-g-700 flex items-center gap-2">
                    <i class="ri-money-dollar-circle-line text-xl text-success"></i> Nạp tiềnThông báo
                  </span>
                  <el-switch v-model="form.czaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div v-if="form.czaudioplay" class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-g-500">Thời gian hiệu lực</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.czaudioplaytime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>điểm</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-g-500">Tự động đóng</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.czaudioqxtime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>điểm</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-g-400 text-sm py-4">Đã đóng</div>
              </div>

              
              <div class="border-full-d rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-g-50': !form.tkaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-g-700 flex items-center gap-2">
                    <i class="ri-bank-card-line text-xl text-warning"></i> Rút tiềnThông báo
                  </span>
                  <el-switch v-model="form.tkaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div v-if="form.tkaudioplay" class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-g-500">Thời gian hiệu lực</span>
                    <div class="flex items-center gap-1">
                      <el-input-number v-model="form.tkaudioplaytime" :min="1" :controls="false" size="small" class="!w-12" />
                      <span>điểm</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-g-400 text-sm py-4">Đã đóng</div>
              </div>

              
              <div class="border-full-d rounded-lg p-4 transition-shadow hover:shadow-md" :class="{'bg-g-50': !form.cardaudioplay}">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold text-g-700 flex items-center gap-2">
                    <i class="ri-id-card-line text-xl text-primary"></i> Thông báo liên kết thẻ
                  </span>
                  <el-switch v-model="form.cardaudioplay" :active-value="1" :inactive-value="0" />
                </div>
                <div class="text-xs text-g-500 leading-relaxed">
                  Khi bật, khi người dùng liên kết thẻ ngân hàng mới, backend sẽ phát âm thanh thông báo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    
    <div class="fixed bottom-0 left-0 right-0 bg-box border-t border-full-d p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-center gap-4 z-20 sm:absolute sm:left-0 sm:right-0 sm:bottom-0 sm:rounded-b-lg">
      <el-button @click="loadData" size="large" class="w-32">Đặt lại</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" class="w-32">Lưu cài đặt</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  fetchSystemSettings,
  saveSystemSettings,
  type SystemSettings
} from '@/api/system-settings'

const activeTab = ref('basic')
const loading = ref(false)
const submitting = ref(false)

const tabs = [
  { name: 'basic', label: 'Cài đặt cơ bản', icon: 'ri-settings-4-line' },
  { name: 'operation', label: 'Cài đặt vận hành', icon: 'ri-tools-line' },
  { name: 'backend', label: 'Cài đặt backend', icon: 'ri-shield-user-line' },
  { name: 'mail', label: 'Cài đặt email', icon: 'ri-mail-settings-line' },
  { name: 'other', label: 'Cài đặt khác', icon: 'ri-more-fill' }
]

const form = reactive<SystemSettings>({

  webtitle: '',
  sitedomain: '',
  promo_texts: '',
  keywords: '',
  description: '',
  defaulttjcode: '',
  loginerrornum_q: 6,
  loginerrorclosetime_q: 24,
  ipblackisopen: 0,
  ipblacklist: '',
  ipwhiteisopen: 0,
  ipwhitelist: '',

  switch_ng: 1,
  api_account: '',
  sign_key: '',
  iskillorder: 1,
  sysBankMaxNum: 4,
  damaliang: 50,
  paiduinum: 33,
  tikuanstart: '00:10',
  tikuanend: '23:55',
  tikuannumoverbilv: 10,
  tikuannumovermin: 100,
  tikuannumovermax: 9999999,
  tikuanMin: 100,
  tikuanMax: 500000,
  ritikuanxiane: 1000000,
  tikuannum: 10,
  fanDianMax: 9.8,
  fanDianMin: 0.0,
  pointchongzhi: 1,
  pointchongzhiadd: 2,
  kefuqq: '',
  kefuthree: '',

  loginerrornum: 3,
  loginerrorclosetime: 1,
  islogincode: 0,
  isemailcode: 0,
  adminemailcodetime: 180,
  getemailcode: '',

  SMTP_HOST: '',
  SMTP_SSL: 0,
  SMTP_PORT: '',
  FROM_EMAIL: '',
  SMTP_USER: '',
  FROM_NAME: '',
  REPLY_EMAIL: '',
  REPLY_NAME: '',
  SMTP_PASS: '',

  caijieapiurl: '',
  weballowips: '',
  czaudioplay: 1,
  czaudioplaytime: 5,
  czaudioqxtime: 8,
  tkaudioplay: 1,
  tkaudioplaytime: 5,
  cardaudioplay: 1
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchSystemSettings()
    console.log('System Settings API Response:', res)

    const toNumber = (val: any) => {
      const n = Number(val)
      return isNaN(n) ? 0 : n
    }

    const settings = (res as any).settings || res
    if (settings) {
      form.webtitle = settings.webtitle || ''
      form.sitedomain = settings.sitedomain || ''
      form.promo_texts = Array.isArray(settings.promo_texts) ? settings.promo_texts.join('\n') : (settings.promo_texts || '')
      form.keywords = settings.keywords || ''
      form.description = settings.description || ''
      form.defaulttjcode = settings.defaulttjcode || ''
      form.loginerrornum_q = toNumber(settings.loginerrornum_q)
      form.loginerrorclosetime_q = toNumber(settings.loginerrorclosetime_q)
      form.ipblackisopen = toNumber(settings.ipblackisopen)
      form.ipblacklist = settings.ipblacklist || ''
      form.ipwhiteisopen = toNumber(settings.ipwhiteisopen)
      form.ipwhitelist = settings.ipwhitelist || ''

      form.switch_ng = toNumber(settings.switch_ng)
      form.api_account = settings.api_account || ''
      form.sign_key = settings.sign_key || ''
      form.iskillorder = toNumber(settings.iskillorder)
      form.sysBankMaxNum = toNumber(settings.sysBankMaxNum)
      form.damaliang = toNumber(settings.damaliang)
      form.paiduinum = toNumber(settings.paiduinum)
      form.tikuanstart = settings.tikuanstart || '00:00'
      form.tikuanend = settings.tikuanend || '23:59'
      form.tikuannumoverbilv = toNumber(settings.tikuannumoverbilv)
      form.tikuannumovermin = toNumber(settings.tikuannumovermin)
      form.tikuannumovermax = toNumber(settings.tikuannumovermax)
      form.tikuanMin = toNumber(settings.tikuanMin)
      form.tikuanMax = toNumber(settings.tikuanMax)
      form.ritikuanxiane = toNumber(settings.ritikuanxiane)
      form.tikuannum = toNumber(settings.tikuannum)
      form.fanDianMax = toNumber(settings.fanDianMax)
      form.fanDianMin = toNumber(settings.fanDianMin)
      form.pointchongzhi = toNumber(settings.pointchongzhi)
      form.pointchongzhiadd = toNumber(settings.pointchongzhiadd)
      form.kefuqq = settings.kefuqq || ''
      form.kefuthree = settings.kefuthree || ''

      form.loginerrornum = toNumber(settings.loginerrornum)
      form.loginerrorclosetime = toNumber(settings.loginerrorclosetime)
      form.islogincode = toNumber(settings.islogincode)
      form.isemailcode = toNumber(settings.isemailcode)
      form.adminemailcodetime = toNumber(settings.adminemailcodetime)
      form.getemailcode = settings.getemailcode || ''

      form.SMTP_HOST = settings.SMTP_HOST || ''
      form.SMTP_SSL = toNumber(settings.SMTP_SSL)
      form.SMTP_PORT = settings.SMTP_PORT || ''
      form.FROM_EMAIL = settings.FROM_EMAIL || ''
      form.SMTP_USER = settings.SMTP_USER || ''
      form.FROM_NAME = settings.FROM_NAME || ''
      form.REPLY_EMAIL = settings.REPLY_EMAIL || ''
      form.REPLY_NAME = settings.REPLY_NAME || ''
      form.SMTP_PASS = settings.SMTP_PASS || ''

      form.caijieapiurl = settings.caijieapiurl || ''
      form.weballowips = settings.weballowips || ''
      form.czaudioplay = toNumber(settings.czaudioplay)
      form.czaudioplaytime = toNumber(settings.czaudioplaytime)
      form.czaudioqxtime = toNumber(settings.czaudioqxtime)
      form.tkaudioplay = toNumber(settings.tkaudioplay)
      form.tkaudioplaytime = toNumber(settings.tkaudioplaytime)
      form.cardaudioplay = toNumber(settings.cardaudioplay)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await saveSystemSettings(form)
    ElMessage.success('Lưu thành công')
    loadData()
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
.custom-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}
.custom-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  padding: 0 20px;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>