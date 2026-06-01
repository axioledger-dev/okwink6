import request from '@/utils/http'

export interface Notice {
  id: number
  title: string
  content: string
  create_time: string
}

export interface NoticeListResponse {
  list: Notice[]
  total: number
}

export interface NoticeSearchParams {
  page?: number
  limit?: number
  title?: string
}



export function fetchNoticeList(params?: NoticeSearchParams) {
  return request.get<NoticeListResponse>({
    url: '/app/admin/api/maintenance/notice/list',
    params
  })
}



export function createNotice(data: { title: string; content: string }) {
  return request.post({
    url: '/app/admin/api/maintenance/notice/create',
    data,
    showSuccessMessage: true
  })
}



export function updateNotice(data: { id: number; title: string; content: string }) {
  return request.post({
    url: '/app/admin/api/maintenance/notice/update',
    data,
    showSuccessMessage: true
  })
}



export function deleteNotice(id: number) {
  return request.post({
    url: '/app/admin/api/maintenance/notice/delete',
    data: { id },
    showSuccessMessage: true
  })
}
