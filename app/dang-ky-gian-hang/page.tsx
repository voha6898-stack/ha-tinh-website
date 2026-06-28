import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import {
  Store,
  Star,
  TrendingUp,
  Phone,
  MessageCircle,
  CheckCircle,
  MapPin,
  Newspaper,
  Award,
  Zap,
} from 'lucide-react'

const BENEFITS = [
  {
    icon: Star,
    title: 'Huy hiệu Nổi Bật',
    desc: 'Gian hàng của bạn được gắn nhãn ⭐ Nổi Bật, nổi bật ngay khi khách mở trang.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  {
    icon: TrendingUp,
    title: 'Ưu tiên hiển thị',
    desc: 'Cửa hàng nổi bật luôn xuất hiện đầu tiên trong danh sách, trước hàng chục cơ sở khác.',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    icon: MessageCircle,
    title: 'Hiển thị Zalo trực tiếp',
    desc: 'Số Zalo của bạn hiển thị ngay trên card — khách liên hệ một chạm, không qua trung gian.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: Newspaper,
    title: 'Bài viết giới thiệu',
    desc: 'Gói Premium bao gồm một bài PR viết chuyên nghiệp về thương hiệu, đăng trên mục Tin Tức.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
]

const TIERS = [
  {
    name: 'Cơ Bản',
    price: 'Miễn phí',
    period: '',
    highlight: false,
    color: 'border-gray-200',
    headerBg: 'bg-gray-50',
    badge: null,
    features: [
      'Liệt kê trong danh mục',
      'Hiển thị tên, địa chỉ, giờ mở cửa',
      'Hiển thị số điện thoại',
      'Đánh giá từ khách hàng',
    ],
    missing: [
      'Huy hiệu Nổi Bật',
      'Ưu tiên vị trí đầu',
      'Hiển thị Zalo',
      'Bài viết PR',
    ],
    cta: 'Đăng ký miễn phí',
    ctaStyle: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  },
  {
    name: 'Nổi Bật',
    price: '299.000',
    period: '/tháng',
    highlight: true,
    color: 'border-yellow-400',
    headerBg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    badge: 'Phổ biến nhất',
    features: [
      'Tất cả tính năng Cơ Bản',
      '⭐ Huy hiệu Nổi Bật trên card',
      'Ưu tiên vị trí đầu danh sách',
      'Hiển thị Zalo liên hệ',
      'Văn bản khuyến mãi tùy chỉnh',
    ],
    missing: ['Bài viết PR trên Tin Tức'],
    cta: 'Đăng ký ngay',
    ctaStyle: 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black shadow-lg shadow-yellow-200',
  },
  {
    name: 'Premium',
    price: '599.000',
    period: '/tháng',
    highlight: false,
    color: 'border-forest-700',
    headerBg: 'bg-gradient-to-br from-forest-800 to-forest-600',
    badge: 'Tối ưu nhất',
    features: [
      'Tất cả tính năng Nổi Bật',
      'Bài viết PR chuyên nghiệp',
      'Đăng bài trên mục Tin Tức',
      'Banner khuyến mãi nổi bật',
      'Hỗ trợ chụp ảnh sản phẩm',
      'Báo cáo lượt xem hàng tháng',
    ],
    missing: [],
    cta: 'Liên hệ tư vấn',
    ctaStyle: 'bg-forest-800 hover:bg-forest-700 text-white font-black shadow-lg shadow-green-200',
  },
]

export default function DangKyGianHangPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white">
        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white overflow-hidden">
          {/* decorative rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Store size={14} />
              Dành cho doanh nghiệp tại Hà Tĩnh
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Đưa doanh nghiệp của bạn lên{' '}
              <span className="text-yellow-400">Hà Tĩnh Có Gì?</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10">
              Hàng nghìn khách du lịch và người địa phương tìm kiếm địa chỉ ăn uống,
              mua sắm, đặc sản mỗi tháng. Đừng để họ không tìm thấy bạn.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#bang-gia"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-3.5 rounded-2xl text-base transition-colors shadow-xl shadow-yellow-500/30"
              >
                <Zap size={16} />
                Xem bảng giá
              </a>
              <a
                href="#lien-he"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition-colors"
              >
                <MessageCircle size={16} />
                Liên hệ ngay
              </a>
            </div>

            {/* Trust stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/10 pt-10">
              {[
                { value: '5.000+', label: 'Lượt xem / tháng' },
                { value: '50+', label: 'Cơ sở đã đăng ký' },
                { value: '4.8★', label: 'Đánh giá trung bình' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-yellow-400">{s.value}</div>
                  <div className="text-xs text-white/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                Quyền lợi khi đăng ký
              </h2>
              <p className="text-slate-500 text-lg">
                Được thiết kế để tối đa hoá khả năng tiếp cận khách hàng mới.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className={`flex gap-5 p-6 rounded-2xl border ${b.bg} ${b.border}`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm ${b.border} border`}>
                    <b.icon size={22} className={b.color} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base mb-1">{b.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="bang-gia" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                Bảng giá dịch vụ
              </h2>
              <p className="text-slate-500 text-lg">
                Chọn gói phù hợp với quy mô và mục tiêu của doanh nghiệp bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-3xl border-2 overflow-hidden shadow-sm ${tier.color} ${tier.highlight ? 'md:-mt-4 md:mb-4 shadow-2xl shadow-yellow-100' : ''}`}
                >
                  {/* Card header */}
                  <div className={`${tier.headerBg} px-6 py-6`}>
                    {tier.badge && (
                      <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        <Award size={11} />
                        {tier.badge}
                      </div>
                    )}
                    <h3 className={`text-2xl font-black mb-1 ${tier.highlight ? 'text-white' : tier.name === 'Premium' ? 'text-white' : 'text-slate-900'}`}>
                      {tier.name}
                    </h3>
                    <div className={`flex items-baseline gap-1 ${tier.highlight ? 'text-white' : tier.name === 'Premium' ? 'text-white' : 'text-slate-800'}`}>
                      {tier.price === 'Miễn phí' ? (
                        <span className="text-3xl font-black">Miễn phí</span>
                      ) : (
                        <>
                          <span className="text-3xl font-black">{tier.price}đ</span>
                          <span className={`text-sm font-medium ${tier.highlight ? 'text-white/70' : 'text-white/70'}`}>{tier.period}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-6 space-y-3">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                    {tier.missing.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-slate-400 line-through">
                        <CheckCircle size={15} className="text-gray-300 mt-0.5 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6">
                    <a
                      href="#lien-he"
                      className={`block text-center py-3 rounded-xl text-sm transition-colors ${tier.ctaStyle}`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-400 text-sm mt-8">
              * Giá chưa bao gồm VAT. Thanh toán theo tháng, huỷ bất kỳ lúc nào.
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Quy trình đăng ký</h2>
              <p className="text-slate-500">Nhanh chóng, đơn giản — hoàn tất trong 24 giờ.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Liên hệ qua Zalo / điện thoại', desc: 'Nhắn tin hoặc gọi cho chúng tôi. Chúng tôi sẽ tư vấn gói phù hợp nhất với bạn.' },
                { step: '02', title: 'Cung cấp thông tin cơ sở', desc: 'Gửi tên, địa chỉ, ảnh và mô tả. Chúng tôi thiết kế card đẹp cho bạn hoàn toàn miễn phí.' },
                { step: '03', title: 'Lên sóng trong 24 giờ', desc: 'Gian hàng của bạn hiển thị trực tiếp trên website và được hàng nghìn khách xem mỗi tháng.' },
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white font-black text-lg flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-black text-slate-900 mb-2 text-sm">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="lien-he" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <MessageCircle size={14} />
              Liên hệ trực tiếp
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Sẵn sàng đưa cửa hàng của bạn lên bản đồ?
            </h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              Nhắn tin Zalo hoặc gọi điện để được tư vấn miễn phí. Chúng tôi hỗ trợ
              từ thứ 2 đến thứ 7, 8:00 – 21:00.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-10">
              {/* Zalo */}
              <a
                href="https://zalo.me/0123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">Nhắn Zalo</div>
                  <div className="text-blue-600 font-bold text-sm">0123 456 789</div>
                  <div className="text-slate-400 text-xs mt-1">Phản hồi trong vài phút</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:0123456789"
                className="flex flex-col items-center gap-3 bg-green-50 border-2 border-green-200 hover:border-green-400 rounded-2xl p-6 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-forest-800 flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">Gọi điện</div>
                  <div className="text-forest-700 font-bold text-sm">0123 456 789</div>
                  <div className="text-slate-400 text-xs mt-1">Thứ 2 – Thứ 7, 8:00–21:00</div>
                </div>
              </a>
            </div>

            {/* Address note */}
            <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={14} />
              Hà Tĩnh, Việt Nam — phục vụ toàn tỉnh
            </div>
          </div>
        </section>

        {/* ── Final CTA Banner ── */}
        <section className="py-14 bg-gradient-to-r from-forest-900 to-forest-700">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-white/60 text-sm font-medium mb-2">Đừng để khách hàng không tìm thấy bạn</p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
              Đăng ký ngay hôm nay — gói Cơ Bản{' '}
              <span className="text-yellow-400">hoàn toàn miễn phí</span>
            </h3>
            <a
              href="#lien-he"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-3.5 rounded-2xl text-base transition-colors shadow-xl shadow-yellow-900/30"
            >
              <Zap size={16} />
              Bắt đầu ngay
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
