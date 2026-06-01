/**
 * Xổ Số Provinces Data
 * Data structure for Vietnamese lottery provinces
 */

export const xosoRegions = [
  {
    key: 'mien-bac',
    name: 'Miền Bắc',
    provinces: [
      { code: 'xsmb', name: 'Xổ Số Miền Bắc', shortName: 'XSMB' }
    ]
  },
  {
    key: 'mien-trung',
    name: 'Miền Trung',
    provinces: [
      { code: 'xsmt-dn', name: 'Đà Nẵng', shortName: 'ĐN' },
      { code: 'xsmt-kh', name: 'Khánh Hòa', shortName: 'KH' },
      { code: 'xsmt-qn', name: 'Quảng Nam', shortName: 'QN' },
      { code: 'xsmt-dno', name: 'Đắk Nông', shortName: 'ĐNO' },
      { code: 'xsmt-qb', name: 'Quảng Bình', shortName: 'QB' },
      { code: 'xsmt-bd', name: 'Bình Định', shortName: 'BD' },
      { code: 'xsmt-qt', name: 'Quảng Trị', shortName: 'QT' },
      { code: 'xsmt-gl', name: 'Gia Lai', shortName: 'GL' },
      { code: 'xsmt-nt', name: 'Ninh Thuận', shortName: 'NT' },
      { code: 'xsmt-tth', name: 'Thừa Thiên Huế', shortName: 'TTH' },
      { code: 'xsmt-py', name: 'Phú Yên', shortName: 'PY' },
      { code: 'xsmt-dl', name: 'Đắk Lắk', shortName: 'ĐL' },
      { code: 'xsmt-qng', name: 'Quảng Ngãi', shortName: 'QNG' },
      { code: 'xsmt-kt', name: 'Kon Tum', shortName: 'KT' }
    ]
  },
  {
    key: 'mien-nam',
    name: 'Miền Nam',
    provinces: [
      { code: 'xsmn-tp', name: 'TP. Hồ Chí Minh', shortName: 'TP' },
      { code: 'xsmn-dt', name: 'Đồng Tháp', shortName: 'ĐT' },
      { code: 'xsmn-cm', name: 'Cà Mau', shortName: 'CM' },
      { code: 'xsmn-br', name: 'Bến Tre', shortName: 'BR' },
      { code: 'xsmn-vt', name: 'Vũng Tàu', shortName: 'VT' },
      { code: 'xsmn-ct', name: 'Cần Thơ', shortName: 'CT' },
      { code: 'xsmn-dn', name: 'Đồng Nai', shortName: 'ĐN' },
      { code: 'xsmn-st', name: 'Sóc Trăng', shortName: 'ST' },
      { code: 'xsmn-tn', name: 'Tây Ninh', shortName: 'TN' },
      { code: 'xsmn-ag', name: 'An Giang', shortName: 'AG' },
      { code: 'xsmn-bt', name: 'Bình Thuận', shortName: 'BT' },
      { code: 'xsmn-vl', name: 'Vĩnh Long', shortName: 'VL' },
      { code: 'xsmn-bd', name: 'Bình Dương', shortName: 'BD' },
      { code: 'xsmn-tv', name: 'Trà Vinh', shortName: 'TV' },
      { code: 'xsmn-bp', name: 'Bình Phước', shortName: 'BP' },
      { code: 'xsmn-hg', name: 'Hậu Giang', shortName: 'HG' },
      { code: 'xsmn-la', name: 'Long An', shortName: 'LA' },
      { code: 'xsmn-tg', name: 'Tiền Giang', shortName: 'TG' },
      { code: 'xsmn-kg', name: 'Kiên Giang', shortName: 'KG' },
      { code: 'xsmn-dl', name: 'Đà Lạt', shortName: 'ĐL' }
    ]
  }
]

/**
 * Get all provinces as flat array
 * @returns {Array} Array of all provinces
 */
export function getAllProvinces() {
  return xosoRegions.reduce((acc, region) => {
    return acc.concat(region.provinces.map(p => ({
      ...p,
      region: region.key,
      regionName: region.name
    })))
  }, [])
}

/**
 * Get provinces by region
 * @param {string} regionKey - Region key (mien-bac, mien-trung, mien-nam)
 * @returns {Array} Array of provinces in the region
 */
export function getProvincesByRegion(regionKey) {
  const region = xosoRegions.find(r => r.key === regionKey)
  return region ? region.provinces : []
}

/**
 * Get province by code
 * @param {string} code - Province code
 * @returns {Object|null} Province object or null
 */
export function getProvinceByCode(code) {
  const allProvinces = getAllProvinces()
  return allProvinces.find(p => p.code === code) || null
}

/**
 * Get region by province code
 * @param {string} code - Province code
 * @returns {Object|null} Region object or null
 */
export function getRegionByProvinceCode(code) {
  for (const region of xosoRegions) {
    if (region.provinces.some(p => p.code === code)) {
      return region
    }
  }
  return null
}

export default {
  xosoRegions,
  getAllProvinces,
  getProvincesByRegion,
  getProvinceByCode,
  getRegionByProvinceCode
}

// Made with Bob
