# WAP Assets Directory Documentation

**Location:** `/home/caipiao/wap/public/assets/`
**Generated:** 2026-05-25
**Purpose:** Comprehensive documentation of all asset directories and their contents

---

## Directory Overview

The assets directory contains 7 subdirectories organized by asset type and purpose:

| Directory | Status | File Count | Purpose |
|-----------|--------|------------|---------|
| `deposit/` | ✅ Active | 9 files | Payment method icons and deposit-related images |
| `game_pictures/` | ⚠️ Empty | 0 files | Reserved for game thumbnails/screenshots |
| `images/` | ✅ Active | 100+ files | Main image repository (organized by category) |
| `img/` | ✅ Active | 150+ files | UI icons, logos, and interface elements |
| `locals/` | ⚠️ Empty | 0 files | Reserved for localization assets |
| `theme-0/` | ⚠️ Empty | 0 files | Reserved for theme-specific assets |
| `vendors/` | ⚠️ Empty | 0 files | Reserved for third-party vendor assets |

---

## 1. deposit/ Directory

**Purpose:** Payment method icons and deposit-related imagery
**File Format:** AVIF (modern image format for better compression)
**Total Files:** 9

### File Inventory

```
deposit/
├── card.avif              # Bank card icon
├── fast-deposit.avif      # Fast deposit method icon
├── img_czjl_mccz.avif    # Deposit record - card deposit (充值记录-免充充值)
├── img_czjl_zh.avif      # Deposit record - account (充值记录-账户)
├── momo.avif             # MoMo payment method logo
├── qr-code.avif          # QR code payment icon
├── viettel.avif          # Viettel payment method logo
├── VND.avif              # Vietnamese Dong currency icon
└── zalo.avif             # ZaloPay payment method logo
```

### Usage Context
- **Vietnamese Payment Methods:** MoMo, Viettel, ZaloPay (popular in Vietnam)
- **Payment Types:** Bank cards, QR codes, mobile wallets
- **Currency:** VND (Vietnamese Dong) support

### Recommendations
- ✅ Well-organized for Vietnamese market
- ✅ Modern AVIF format for optimal performance
- 💡 Consider adding: Crypto payment icons (USDT, BTC), international cards (Visa, Mastercard)

---

## 2. game_pictures/ Directory

**Status:** ⚠️ Empty
**Purpose:** Game thumbnails, screenshots, and promotional images

### Expected Usage
- Game provider logos
- Game thumbnail images
- Game category banners
- Promotional game artwork

### Recommendations
- 📝 Populate with game images from integrated providers (BBIN, AG, PG, etc.)
- 📝 Organize by game provider subdirectories
- 📝 Use consistent naming convention: `{provider}_{game_id}_{type}.{ext}`

---

## 3. images/ Directory

**Purpose:** Main organized image repository
**Structure:** Hierarchical organization by category
**Total Files:** 100+ files

### Directory Structure

```
images/
├── activity/                    # Activity/promotion images
│   ├── backgrounds/            # Activity background images
│   │   ├── activity_bg3-7.jpg # Various activity backgrounds
│   │   ├── banner1.jpg/png    # Banner images
│   └── [dated images]          # Legacy activity images (2019)
│
├── common/                      # Common/shared assets
│   ├── logo.png               # Main logo
│   ├── rui-face.png           # Avatar/face icon
│   └── logo/
│       └── main.png           # Alternative logo
│
├── games/                       # Game provider logos
│   ├── chess/                 # Chess game providers
│   │   ├── h5-gamelist-Ky.png
│   │   ├── h5-gamelist-LcQp.png
│   │   ├── h5-gamelist-LgQp.png
│   │   └── h5-gamelist-VgQp.png
│   │
│   ├── live/                  # Live casino providers
│   │   ├── h5-gamelist-Ab.png
│   │   ├── h5-gamelist-Ag.png
│   │   ├── h5-gamelist-Ebet.png
│   │   └── h5-gamelist-Wml.png
│   │
│   └── sports/                # Sports betting providers
│       ├── h5-gamelist-Aio.png
│       ├── h5-gamelist-Tcg.png
│       └── h5-gamelist-Ug.png
│
├── lottery/                     # Lottery game assets
│   └── icons/                 # Lottery game icons (90+ files)
│       ├── game-{id}.png      # Individual lottery games
│       ├── game-{name}.png    # Named lottery types
│       └── [Various lottery types]
│
├── ui/                          # UI elements
│   ├── backgrounds/
│   │   └── stats-bg.svg       # Statistics background
│   └── icons/
│       └── coin.png           # Coin icon
│
└── user/                        # User-related assets
    ├── avatars/
    │   ├── default.png        # Default avatar
    │   ├── logo.png           # Logo avatar
    │   └── Rectangle.png      # Placeholder avatar
    └── icons/                 # User interface icons
```

### Lottery Games Catalog

The lottery/icons directory contains 90+ lottery game icons including:

**Popular Lottery Types:**
- **Xổ Số (Vietnamese Lottery):** Various regional games
- **28 Games:** bj28, tw28, xy28, yfxy28
- **K3 Games:** f1k3, f3k3, f5k3, fck3, jisk3, jlk3, jsk3, lyk3, sgk3, xyk3
- **11x5 Games:** azxy5, js11x5, ly11x5, sg11x5, yf11x5
- **SSC (时时彩):** dfssc, jssc, jsssc, lysc, sgssc, txssc, various frequency variants
- **PK10:** dfpk10, pk101, pk103, pk105
- **LHC (六合彩):** dflhc, jslhc, lhc, lylhc, xglhc, various frequency variants
- **FT (飞艇):** jsft, lyft, sgft, xyft, txffc

### Game Provider Logos

**Chess Providers:** Ky, LcQp, LgQp, VgQp
**Live Casino:** Ab (AllBet), Ag (Asia Gaming), Ebet, Wml
**Sports Betting:** Aio, Tcg, Ug

### Recommendations
- ✅ Well-organized hierarchical structure
- ✅ Comprehensive lottery game coverage
- 💡 Consider: Consolidating dated activity images, adding more game provider logos

---

## 4. img/ Directory

**Purpose:** UI icons, logos, and interface elements
**File Formats:** AVIF, PNG, SVG, WEBP, JPEG
**Total Files:** 150+ files

### Major Categories

#### A. Game Provider Logos (AVIF format)
```
8_N_BBIN_LOGO.avif          # BBIN
10_N_AG_LOGO.avif           # Asia Gaming
14_N_PG_LOGO.avif           # Pocket Games Soft
24_N_FC_LOGO.avif           # FC Gaming
37_N_PP_LOGO.avif           # Pragmatic Play
310_N_JDB_LOGO.avif         # JDB Gaming
imgi_5_3_N_CQ9_LOGO.avif    # CQ9
imgi_6_13_N_WG_LOGO.avif    # WG Gaming
imgi_7_40_N_JILI_LOGO.avif  # JILI
imgi_8_8_N_BBIN_LOGO.avif   # BBIN (duplicate)
imgi_9_313_N_MG_LOGO.avif   # Microgaming
imgi_10_27_N_KA_LOGO.avif   # KA Gaming
imgi_11_33_N_BNG_LOGO.avif  # Booongo
imgi_12_52_N_WL_LOGO.avif   # World Match
```

#### B. Activity/Promotion Images
```
ActiveImg{id}.avif          # 20+ promotional images
btn_zc1_1.avif             # Registration button 1
btn_zc1_2.avif             # Registration button 2
```

#### C. UI Icons (SVG format)
```
comm_icon_cz_jl.svg        # Deposit record icon
comm_icon_cz_kf.svg        # Deposit customer service
comm_icon_gou.svg          # Checkmark icon
comm_icon_hide.svg         # Hide icon
comm_icon_retry.svg        # Retry icon
comm_icon_show.svg         # Show icon
comm_icon_sx.svg           # Refresh icon
comm_icon_sx1.svg          # Refresh icon variant
comm_img_corner.svg        # Corner decoration
icon_sys_menu_service.svg  # System menu service icon
icon_tx_txgl.svg           # Withdrawal management
img_tx_tjzh.svg            # Add account
img_vip_dqicon.svg         # VIP level icon
style_3_icon_*.svg         # Style 3 theme icons (15+ icons)
wx.svg                     # WeChat icon
yhk.svg                    # Bank card icon
zfb.svg                    # Alipay icon
```

#### D. Menu/Navigation Icons (AVIF format)
```
icon_dt_1app.avif          # App download
icon_dt_1aqzx.avif         # Security center
icon_dt_1cz.avif           # Deposit
icon_dt_1fs.avif           # Share
icon_dt_1gd.avif           # More
icon_dt_1grbb.avif         # Personal security
icon_dt_1jh.avif           # Exchange
icon_dt_1jl.avif           # Records
icon_dt_1kf.avif           # Customer service
icon_dt_1ljfx.avif         # Profit analysis
icon_dt_1lqjl.avif         # Withdrawal records
icon_dt_1sc.avif           # Collection
icon_dt_1ss.avif           # Real-time
icon_dt_1sz.avif           # Settings
icon_dt_1tg.avif           # Promotion
icon_dt_1tx.avif           # Withdrawal
icon_dt_1txgl.avif         # Withdrawal management
icon_dt_1tzjl.avif         # Betting records
icon_dt_1vip.avif          # VIP
icon_dt_1xx_wd.avif        # Messages - mine
icon_dt_1xx.avif           # Messages
icon_dt_1yeb.avif          # Yuebao (savings)
icon_dt_1yh.avif           # Bank
icon_dt_1yjfq.avif         # Commission distribution
icon_dt_1yuyuan.avif       # Language
icon_dt_1zhmx.avif         # Account details
icon_dt_1zj.avif           # Funds
icon_dt_pmd.webp           # Ranking
```

#### E. Game Category Icons (AVIF/SVG)
```
icon_dtfl_by_0.svg / _1.avif    # Fishing games
icon_dtfl_cp_0.svg / _1.avif    # Lottery
icon_dtfl_dj_0.svg / _1.avif    # Electronic games
icon_dtfl_dz_0.svg / _1.avif    # Electronic
icon_dtfl_qkl_0.svg / _1.avif   # Blockchain
icon_dtfl_qp_0.svg / _1.avif    # Chess/cards
icon_dtfl_ty_0.svg / _1.avif    # Sports
icon_dtfl_zh_0.svg              # Comprehensive
icon_dtfl_zr_0.svg / _1.avif    # Live casino
icon_dtfl_2rm_1.avif            # Hot
icon_dtfl_2sc_1.avif            # Collection
icon_dtfl_2ss_1.avif            # Real-time
icon_dtfl_2zj_1.avif            # Recent
```

#### F. VIP/Level Icons
```
img_dj0.avif - img_dj10.avif   # VIP levels 0-10
img_vip_v.avif                  # VIP badge
color1.avif - color10.avif      # Level color indicators
```

#### G. Payment Method Icons
```
USDT.avif                  # USDT cryptocurrency
aac.png                    # AAC payment
gd.png                     # More options
kt.png                     # Card payment
sxin.png                   # Credit
xy.png                     # XY payment
zk.png                     # Discount
zt.png                     # Direct transfer
```

#### H. Miscellaneous
```
cat.jpeg                   # Cat image (placeholder?)
dm_icon_dm.avif           # Domain icon
gif_profile_style3.webp   # Profile animation
img_none_sj.avif          # No data placeholder
img_ntx4.avif             # Notification
icon_kf_drag.png          # Customer service drag icon
icon_szhb_normal.png      # Digital red packet
logo.png                  # Main logo
bg_pattern_tile_0_95.png  # Background pattern
marketing_medium_dx_*.webp # Marketing images
qd_style4_img_qdbx3.avif  # Sign-in box
style_3_topbg1.avif       # Style 3 top background
style_3_vipbg.avif        # Style 3 VIP background
```

#### I. 28 Game Subdirectory
```
28/
├── imgi_1-17_default.png      # Default game images
├── imgi_1169-1186_*.png       # VIP and game-specific images
└── [Various numbered images]
```

### File Format Distribution
- **AVIF:** ~60% (modern, optimized format)
- **SVG:** ~25% (scalable vector graphics)
- **PNG:** ~10% (legacy/compatibility)
- **WEBP/JPEG:** ~5% (specific use cases)

### Recommendations
- ✅ Comprehensive icon coverage
- ✅ Modern AVIF format for most images
- ✅ SVG for scalable UI elements
- ⚠️ Some duplicate logos (e.g., BBIN appears twice)
- 💡 Consider: Consolidating duplicates, organizing into subdirectories by category

---

## 5. locals/ Directory

**Status:** ⚠️ Empty
**Purpose:** Localization-specific assets

### Expected Usage
- Language-specific images
- Region-specific graphics
- Localized promotional materials
- Country/region flags

### Recommendations
- 📝 Create subdirectories: `vi/`, `en/`, `zh/`, etc.
- 📝 Store locale-specific promotional images
- 📝 Add country flags for language selection

---

## 6. theme-0/ Directory

**Status:** ⚠️ Empty
**Purpose:** Theme-specific assets for UI customization

### Expected Usage
- Theme color palettes
- Theme-specific backgrounds
- Custom UI elements per theme
- Brand variations

### Recommendations
- 📝 Implement theme system with multiple themes (theme-0, theme-1, etc.)
- 📝 Store theme-specific CSS variables as images/patterns
- 📝 Consider: Dark mode assets, seasonal themes

---

## 7. vendors/ Directory

**Status:** ⚠️ Empty
**Purpose:** Third-party vendor assets

### Expected Usage
- Payment gateway logos
- Game provider assets
- Third-party service icons
- Partner branding materials

### Recommendations
- 📝 Organize by vendor name subdirectories
- 📝 Store official vendor logos and branding
- 📝 Include license/attribution files

---

## Asset Optimization Summary

### Current State
- **Total Directories:** 7
- **Active Directories:** 3 (deposit, images, img)
- **Empty Directories:** 4 (game_pictures, locals, theme-0, vendors)
- **Total Files:** ~250+ files
- **Primary Formats:** AVIF (60%), SVG (25%), PNG (10%), Others (5%)

### Format Analysis

#### AVIF (AV1 Image Format)
- **Usage:** 60% of images
- **Benefits:** Superior compression, modern format
- **Browser Support:** Chrome 85+, Firefox 93+, Safari 16+
- **Recommendation:** ✅ Continue using for new images

#### SVG (Scalable Vector Graphics)
- **Usage:** 25% of images
- **Benefits:** Scalable, small file size, perfect for icons
- **Recommendation:** ✅ Ideal for UI icons and logos

#### PNG
- **Usage:** 10% of images
- **Benefits:** Wide compatibility, lossless
- **Recommendation:** ⚠️ Consider converting to AVIF where possible

### Performance Recommendations

1. **Image Optimization**
   - ✅ Already using AVIF for most images
   - 💡 Convert remaining PNG/JPEG to AVIF
   - 💡 Implement lazy loading for images

2. **Organization**
   - ✅ Good hierarchical structure in `images/`
   - ⚠️ `img/` directory could benefit from subdirectories
   - 💡 Consider reorganizing `img/` by category

3. **Naming Conventions**
   - ⚠️ Mixed naming conventions (English, Chinese pinyin, codes)
   - 💡 Standardize to: `{category}_{type}_{name}.{ext}`
   - 💡 Document naming convention in README

4. **Unused Assets**
   - ⚠️ Some dated activity images from 2019
   - 💡 Archive or remove outdated promotional materials
   - 💡 Implement asset cleanup process

---

## Usage Guidelines

### For Developers

#### Importing Assets in Vue Components
```javascript
// Static import
import logo from '@/assets/images/common/logo.png'

// Dynamic import
const imagePath = `/assets/img/icon_dt_1${type}.avif`

// Using in template
<img :src="`/assets/deposit/${paymentMethod}.avif`" />
```

#### Asset Path Structure
```
/assets/deposit/          → Payment method icons
/assets/images/activity/  → Promotional images
/assets/images/games/     → Game provider logos
/assets/images/lottery/   → Lottery game icons
/assets/img/              → UI icons and elements
```

### For Designers

#### Adding New Assets
1. Choose appropriate directory based on asset type
2. Use AVIF format for photos/complex images
3. Use SVG format for icons and logos
4. Follow naming convention: `{category}_{type}_{name}.{ext}`
5. Optimize images before adding (compress, resize)

#### Image Specifications
- **Icons:** 64x64px to 256x256px
- **Logos:** 200x200px (square) or appropriate aspect ratio
- **Banners:** 1200x400px (3:1 ratio)
- **Backgrounds:** 1920x1080px or larger
- **Format:** AVIF (preferred), SVG (for vectors), PNG (fallback)

---

## Maintenance Tasks

### Regular Maintenance
- [ ] Review and remove unused assets quarterly
- [ ] Update game provider logos when rebranding occurs
- [ ] Archive old promotional materials
- [ ] Optimize new images before adding
- [ ] Update this documentation when structure changes

### Immediate Actions Needed
- [ ] Populate `game_pictures/` with game thumbnails
- [ ] Organize `img/` directory into subdirectories
- [ ] Remove duplicate logos (e.g., BBIN)
- [ ] Archive 2019 activity images
- [ ] Create subdirectories in empty directories
- [ ] Standardize naming conventions
- [ ] Add README files in each directory

---

## Integration Points

### Backend Integration
- **API Endpoint:** `/api/assets/list` (if implemented)
- **CDN:** Consider using CDN for asset delivery
- **Dynamic Loading:** Assets loaded based on user preferences/region

### Frontend Integration
- **Vue Components:** Import assets in components
- **CSS:** Background images referenced in stylesheets
- **Dynamic Paths:** Construct paths based on data (game IDs, payment methods)

### Game Providers
- **BBIN, AG, PG, FC, PP, JDB:** Logos in `img/` directory
- **CQ9, WG, JILI, MG, KA, BNG, WL:** Additional provider logos
- **Integration:** Used in game selection UI, provider filters

### Payment Systems
- **Vietnamese Methods:** MoMo, Viettel, ZaloPay
- **Traditional:** Bank cards, QR codes
- **Crypto:** USDT support
- **Integration:** Used in deposit/withdrawal interfaces

---

## Security Considerations

### Asset Security
- ✅ All assets are public (no sensitive data)
- ✅ No executable files in asset directories
- ⚠️ Ensure no user-uploaded content in these directories
- 💡 Implement Content Security Policy (CSP) for images

### Best Practices
1. Never store sensitive data in asset files
2. Validate file types on upload (if user uploads enabled)
3. Use CDN with proper CORS headers
4. Implement rate limiting for asset requests
5. Regular security audits of asset directories

---

## Future Enhancements

### Short-term (1-3 months)
1. Populate empty directories with relevant assets
2. Reorganize `img/` directory with subdirectories
3. Implement asset versioning/cache busting
4. Create asset management documentation
5. Set up automated image optimization pipeline

### Medium-term (3-6 months)
1. Implement multi-theme support using `theme-*` directories
2. Add localization assets in `locals/` directory
3. Create asset CDN integration
4. Implement lazy loading for all images
5. Add WebP fallbacks for AVIF images

### Long-term (6-12 months)
1. Implement dynamic asset management system
2. Create admin interface for asset uploads
3. Add asset analytics (usage tracking)
4. Implement progressive image loading
5. Create automated asset optimization service

---

## Appendix

### File Format Reference

| Format | Extension | Use Case | Browser Support |
|--------|-----------|----------|-----------------|
| AVIF | .avif | Photos, complex images | Modern browsers (2020+) |
| SVG | .svg | Icons, logos, vectors | All browsers |
| PNG | .png | Legacy support, transparency | All browsers |
| WEBP | .webp | Photos, animations | Most browsers (2018+) |
| JPEG | .jpg/.jpeg | Photos (legacy) | All browsers |

### Directory Size Estimates

| Directory | Estimated Size | File Count |
|-----------|---------------|------------|
| deposit/ | ~500 KB | 9 |
| images/ | ~15 MB | 100+ |
| img/ | ~20 MB | 150+ |
| **Total** | **~35 MB** | **~260** |

### Related Documentation
- Frontend Vue Rules: `/home/caipiao/.bob/rules/frontend-vue.md`
- Backend PHP Rules: `/home/caipiao/.bob/rules/backend-php-webman.md`
- Security Rules: `/home/caipiao/.bob/rules/security.md`

---

**Document Version:** 1.0
**Last Updated:** 2026-05-25
**Maintained By:** Development Team
**Review Schedule:** Quarterly
