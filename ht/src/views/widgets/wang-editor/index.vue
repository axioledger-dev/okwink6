<template>
  <div class="page-content mb-5">
    
    <ElCard class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>🛠️ Trình soạn thảo thanh công cụ đầy đủ</span>
          <div class="header-buttons">
            <ElButton size="small" @click="clearFullEditor">Xóa sạch</ElButton>
            <ElButton size="small" @click="getFullEditorContent">Lấy nội dung</ElButton>
            <ElButton size="small" @click="setFullEditorDemo">Đặt ví dụ</ElButton>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="fullEditorRef"
        v-model="fullEditorHtml"
        height="400px"
        placeholder="Vui lòng nhập nội dung, trải nghiệm đầy đủ chức năng soạn thảo..."
        :exclude-keys="[]"
      />
    </ElCard>

    
    <ElCard class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>✨ Trình soạn thảo thanh công cụ đơn giản</span>
          <div class="header-buttons">
            <ElButton size="small" @click="clearSimpleEditor">Xóa sạch</ElButton>
            <ElButton size="small" @click="getSimpleEditorContent">Lấy nội dung</ElButton>
            <ElButton size="small" @click="setSimpleEditorDemo">Đặt ví dụ</ElButton>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="simpleEditorRef"
        v-model="simpleEditorHtml"
        height="400px"
        placeholder="Vui lòng nhập nội dung, trải nghiệm chức năng soạn thảo đơn giản..."
        :toolbar-keys="simpleToolbarKeys"
      />
    </ElCard>

    
    <ElCard class="preview-card" shadow="never">
      <template #header>
        <span>📖 So sánh xem trước nội dung</span>
      </template>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <h3>Nội dung trình soạn thảo đầy đủ</h3>
          <ElTabs v-model="fullActiveTab">
            <ElTabPane label="Hiệu quả render" name="preview">
              <div class="content-preview" v-html="sanitizedFullEditorHtml"></div>
            </ElTabPane>
            <ElTabPane label="Mã nguồn HTML" name="html">
              <ElInput
                v-model="fullEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="Mã nguồn HTML"
                readonly
              />
            </ElTabPane>
          </ElTabs>
        </ElCol>

        <ElCol :span="12">
          <h3>Nội dung trình soạn thảo đơn giản</h3>
          <ElTabs v-model="simpleActiveTab">
            <ElTabPane label="Hiệu quả render" name="preview">
              <div class="content-preview" v-html="sanitizedSimpleEditorHtml"></div>
            </ElTabPane>
            <ElTabPane label="Mã nguồn HTML" name="html">
              <ElInput
                v-model="simpleEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="Mã nguồn HTML"
                readonly
              />
            </ElTabPane>
          </ElTabs>
        </ElCol>
      </ElRow>
    </ElCard>

    
    <ElCard class="usage-card" shadow="never">
      <template #header>
        <span>📚 Hướng dẫn sử dụng</span>
      </template>

      <ElCollapse v-model="activeCollapse">
        <ElCollapseItem title="Cách sử dụng cơ bản" name="basic">
          <pre><code class="language-vue">&lt;template&gt;
          &lt;ArtWangEditor v-model="content" /&gt;
          &lt;/template&gt;

          &lt;script setup lang="ts"&gt;
          import { ref } from 'vue'

          const content = ref('&lt;p&gt;Nội dung ban đầu&lt;/p&gt;')
          &lt;/script&gt;</code></pre>
        </ElCollapseItem>

        <ElCollapseItem title="Cấu hình thanh công cụ đầy đủ" name="full">
          <pre><code class="language-vue">&lt;template&gt;
          &lt;!-- Hiển thị tất cả công cụ, không loại trừ chức năng nào --&gt;
          &lt;ArtWangEditor
          v-model="content"
          :exclude-keys="[]"
          /&gt;
          &lt;/template&gt;</code></pre>
        </ElCollapseItem>

        <ElCollapseItem title="Cấu hình thanh công cụ đơn giản" name="simple">
          <pre><code class="language-vue">&lt;template&gt;
          &lt;!-- Chỉ hiển thị công cụ chỉnh sửa cơ bản --&gt;
          &lt;ArtWangEditor
          v-model="content"
          :toolbar-keys="[
          'bold', 'italic', 'underline', '|',
          'bulletedList', 'numberedList', '|',
          'insertLink', 'insertImage', '|',
          'undo', 'redo'
          ]"
          /&gt;
          &lt;/template&gt;</code></pre>
        </ElCollapseItem>

        <ElCollapseItem title="Cấu hình tùy chỉnh" name="config">
          <pre><code class="language-vue">&lt;template&gt;
          &lt;ArtWangEditor
          v-model="content"
          height="600px"
          placeholder="Vui lòng nhập nội dung của bạn..."
          :exclude-keys="['fontFamily', 'fontSize']"
          :upload-config="{
          maxFileSize: 5 * 1024 * 1024,
          maxNumberOfFiles: 5
          }"
          /&gt;
          &lt;/template&gt;</code></pre>
        </ElCollapseItem>

        <ElCollapseItem title="Gọi phương thức component" name="methods">
          <pre><code class="language-vue">&lt;template&gt;
          &lt;ArtWangEditor ref="editorRef" v-model="content" /&gt;
          &lt;el-button @click="handleClear"&gt;Xóa sạch&lt;/el-button&gt;
          &lt;el-button @click="handleFocus"&gt;Tập trung&lt;/el-button&gt;
          &lt;el-button @click="handleGetContent"&gt;Lấy nội dung&lt;/el-button&gt;
          &lt;/template&gt;

          &lt;script setup lang="ts"&gt;
          import { ref } from 'vue'

          const editorRef = ref()
          const content = ref('')

          const handleClear = () =&gt; {
          editorRef.value?.clear()
          }

          const handleFocus = () =&gt; {
          editorRef.value?.focus()
          }

          const handleGetContent = () =&gt; {
          const html = editorRef.value?.getHtml()
          console.log('Nội dung trình soạn thảo:', html)
          }
          &lt;/script&gt;</code></pre>
        </ElCollapseItem>

        <ElCollapseItem title="Giải thích cấu hình thanh công cụ" name="toolbar-config">
          <div class="toolbar-explanation">
            <h4>Thanh công cụ đầy đủ vs Thanh công cụ đơn giản</h4>
            <ElRow :gutter="16">
              <ElCol :span="12">
                <h5>✅ Thanh công cụ đầy đủ bao gồm:</h5>
                <ul>
                  <li>Định dạng văn bản: In đậm, in nghiêng, gạch chân, màu chữ, màu nền</li>
                  <li>Định dạng đoạn văn: Tiêu đề, trích dẫn, căn chỉnh, thụt lề</li>
                  <li>Danh sách: Danh sách có thứ tự, danh sách không thứ tự, danh sách công việc</li>
                  <li>Chèn: Liên kết, hình ảnh, bảng, đường phân cách, biểu tượng cảm xúc</li>
                  <li>Mã: Khối mã, mã nội tuyến</li>
                  <li>Thao tác: Hoàn tác, làm lại, toàn màn hình, xóa định dạng</li>
                </ul>
              </ElCol>
              <ElCol :span="12">
                <h5>⚡ Thanh công cụ đơn giản bao gồm:</h5>
                <ul>
                  <li>Định dạng cơ bản: In đậm, in nghiêng, gạch chân</li>
                  <li>Danh sách: Danh sách có thứ tự, danh sách không thứ tự</li>
                  <li>Chèn: Liên kết, hình ảnh</li>
                  <li>Thao tác: Hoàn tác, làm lại</li>
                </ul>
                <p class="note">Phù hợp cho các tình huống soạn thảo văn bản đơn giản, giao diện gọn gàng hơn.</p>
              </ElCol>
            </ElRow>
          </div>
        </ElCollapseItem>
      </ElCollapse>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { sanitizeHtml } from '@/utils/sanitize'

  defineOptions({ name: 'WidgetsWangEditor' })

  const fullEditorRef = ref()
  const simpleEditorRef = ref()
  const fullActiveTab = ref('preview')
  const simpleActiveTab = ref('preview')
  const activeCollapse = ref(['basic'])

  const sanitizedFullEditorHtml = computed(() => sanitizeHtml(fullEditorHtml.value))
  const sanitizedSimpleEditorHtml = computed(() => sanitizeHtml(simpleEditorHtml.value))

  const simpleToolbarKeys = [
    'bold',
    'italic',
    'underline',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'insertLink',
    'insertImage',
    '|',
    'undo',
    'redo'
  ]

  const fullEditorHtml = ref(`<h1>🎨 Ví dụ trình soạn thảo thanh công cụ đầy đủ</h1>
<p>Trình soạn thảo này bao gồm tất cả các chức năng, bạn có thể trải nghiệm các chức năng soạn thảo định dạng phong phú.</p>

<h2>✨ Kiểu văn bản</h2>
<p><strong>Đây là văn bản in đậm</strong></p>
<p><em>Đây là văn bản in nghiêng</em></p>
<p><u>Đây là văn bản gạch chân</u></p>
<p><span style="color: rgb(194, 79, 74);">Đây là văn bản màu sắc</span></p>

<h2>📝 Danh sách và công việc</h2>
<ul>
  <li>Mục danh sách không thứ tự 1</li>
  <li>Mục danh sách không thứ tự 2</li>
</ul>

<ol>
  <li>Mục danh sách có thứ tự 1</li>
  <li>Mục danh sách có thứ tự 2</li>
</ol>

<ul class="w-e-todo">
  <li class="w-e-todo-item"><input type="checkbox" checked="true" readonly="true" disabled="disabled"><span>Nhiệm vụ đã hoàn thành</span></li>
  <li class="w-e-todo-item"><input type="checkbox" readonly="true" disabled="disabled"><span>Nhiệm vụ chưa hoàn thành</span></li>
</ul>

<h2>💬 Trích dẫn và bảng</h2>
<blockquote>
  Đây là một đoạn văn bản trích dẫn, hiển thị hiệu quả của định dạng trích dẫn.
</blockquote>

<table style="border-collapse: collapse; width: 100%;" border="1">
  <thead>
    <tr><th>Chức năng</th><th>Mô tả</th></tr>
  </thead>
  <tbody>
    <tr><td>Thanh công cụ đầy đủ</td><td>Bao gồm tất cả chức năng soạn thảo</td></tr>
    <tr><td>Cấu hình tùy chỉnh</td><td>Hỗ trợ cấu hình thanh công cụ linh hoạt</td></tr>
  </tbody>
</table>

<h2>💻 Khối mã</h2>
<pre><code class="language-javascript">// Trình soạn thảo đầy đủ hỗ trợ làm nổi bật mã
function createEditor() {
  return new WangEditor({
    container: '#editor',
    toolbar: 'full' // Thanh công cụ đầy đủ
  });
}</code></pre>

<p>🔗 <a href="https://www.wangeditor.com/" target="_blank">Truy cập trang web chính thức để tìm hiểu thêm</a></p>`)

  const simpleEditorHtml = ref(`<h1>✨ Ví dụ trình soạn thảo thanh công cụ đơn giản</h1>
<p>Trình soạn thảo này chỉ bao gồm các chức năng soạn thảo cơ bản, giao diện gọn gàng hơn.</p>

<h2>Định dạng văn bản cơ bản</h2>
<p><strong>Văn bản in đậm</strong></p>
<p><em>Văn bản in nghiêng</em></p>
<p><u>Văn bản gạch chân</u></p>

<h2>Chức năng danh sách</h2>
<ul>
  <li>Mục danh sách không thứ tự 1</li>
  <li>Mục danh sách không thứ tự 2</li>
</ul>

<ol>
  <li>Mục danh sách có thứ tự 1</li>
  <li>Mục danh sách có thứ tự 2</li>
</ol>

<h2>Liên kết và hình ảnh</h2>
<p>Hỗ trợ chèn <a href="https://www.wangeditor.com/" target="_blank">liên kết</a> và hình ảnh.</p>

<p>Phiên bản đơn giản của trình soạn thảo tập trung vào các chức năng cơ bản, phù hợp cho nhu cầu soạn thảo nội dung đơn giản.</p>`)

  const clearFullEditor = () => {
    fullEditorRef.value?.clear()
    ElMessage.success('Trình soạn thảo đầy đủ đã được xóa')
  }

  const getFullEditorContent = () => {
    const content = fullEditorRef.value?.getHtml()
    console.log('Nội dung trình soạn thảo đầy đủ:', content)
    ElMessage.success('Nội dung trình soạn thảo đầy đủ đã được xuất ra console')
  }

  const setFullEditorDemo = () => {
    const demoContent = `<h2>🎉 Nội dung demo trình soạn thảo đầy đủ</h2>
<p>Đây là nội dung demo được đặt thông qua phương thức, thể hiện các chức năng mạnh mẽ của trình soạn thảo đầy đủ.</p>
<ul>
  <li>Hỗ trợ định dạng văn bản phong phú</li>
  <li>Bao gồm các chức năng nâng cao như bảng, khối mã</li>
  <li>Cung cấp trải nghiệm soạn thảo đầy đủ</li>
</ul>
<table style="border-collapse: collapse; width: 100%;" border="1">
  <tr><th>Tính năng</th><th>Trạng thái</th></tr>
  <tr><td>Thanh công cụ đầy đủ</td><td>✅ Đã bật</td></tr>
  <tr><td>Chức năng nâng cao</td><td>✅ Đã bật</td></tr>
</table>`

    fullEditorRef.value?.setHtml(demoContent)
    ElMessage.success('Đã đặt nội dung demo trình soạn thảo đầy đủ')
  }

  const clearSimpleEditor = () => {
    simpleEditorRef.value?.clear()
    ElMessage.success('Trình soạn thảo đơn giản đã được xóa')
  }

  const getSimpleEditorContent = () => {
    const content = simpleEditorRef.value?.getHtml()
    console.log('Nội dung trình soạn thảo đơn giản:', content)
    ElMessage.success('Nội dung trình soạn thảo đơn giản đã được xuất ra console')
  }

  const setSimpleEditorDemo = () => {
    const demoContent = `<h2>⚡ Nội dung demo trình soạn thảo đơn giản</h2>
<p>Đây là nội dung demo được đặt thông qua phương thức, thể hiện các chức năng cốt lõi của trình soạn thảo đơn giản.</p>
<ul>
  <li><strong>Định dạng cơ bản</strong>: In đậm, in nghiêng, gạch chân</li>
  <li><em>Hỗ trợ danh sách</em>: Danh sách có thứ tự và không thứ tự</li>
  <li><u>Chèn phương tiện</u>: Liên kết và hình ảnh</li>
</ul>
<ol>
  <li>Giao diện gọn gàng sạch sẽ</li>
  <li>Chức năng tập trung thực tế</li>
  <li>Phù hợp cho soạn thảo nhanh</li>
</ol>
<p>🔗 <a href="https://example.com" target="_blank">Đây là một ví dụ liên kết</a></p>`

    simpleEditorRef.value?.setHtml(demoContent)
    ElMessage.success('Đã đặt nội dung demo trình soạn thảo đơn giản')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;
  }

  .editor-card {
    margin-bottom: 24px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-buttons {
    display: flex;
    gap: 8px;
  }

  .preview-card {
    margin-bottom: 24px;
  }

  .preview-card h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  .content-preview {
    min-height: 200px;
    max-height: 300px;
    padding: 16px;
    overflow-y: auto;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }

  .content-preview :deep(h1),
  .content-preview :deep(h2),
  .content-preview :deep(h3) {
    margin: 16px 0 8px;
  }

  .content-preview :deep(p) {
    margin: 8px 0;
    line-height: 1.6;
  }

  .content-preview :deep(table) {
    margin: 16px 0;
  }

  .content-preview :deep(table th),
  .content-preview :deep(table td) {
    padding: 8px 12px;
  }

  .content-preview :deep(pre) {
    padding: 12px;
    margin: 16px 0;
    overflow-x: auto;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
  }

  .content-preview :deep(blockquote) {
    padding-left: 16px;
    margin: 16px 0;
    color: var(--el-text-color-regular);
    border-left: 4px solid var(--el-color-primary);
  }

  .usage-card :deep(.el-collapse-item__content) {
    padding-bottom: 16px;
  }

  .usage-card pre {
    padding: 16px;
    margin: 0;
    overflow-x: auto;
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
  }

  .usage-card pre code {
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  .toolbar-explanation h4 {
    margin: 0 0 16px;
    color: var(--el-text-color-primary);
  }

  .toolbar-explanation h5 {
    margin: 0 0 8px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  .toolbar-explanation ul {
    padding-left: 20px;
    margin: 8px 0 16px;
  }

  .toolbar-explanation ul li {
    margin: 4px 0;
    font-size: 13px;
    color: var(--el-text-color-regular);
  }

  .toolbar-explanation .note {
    margin: 8px 0 0;
    font-size: 12px;
    font-style: italic;
    color: var(--el-text-color-placeholder);
  }

  @media (width <= 768px) {
    .page-content {
      padding: 12px;
    }

    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch !important;
    }

    .header-buttons {
      justify-content: center;
    }

    .preview-card :deep(.el-col) {
      margin-bottom: 16px;
    }
  }
</style>
