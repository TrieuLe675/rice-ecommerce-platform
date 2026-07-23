import { Wheat, Award, Truck, RefreshCw, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export const HomePage = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Nông Sản Gạo Sạch Thượng Hạng</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.15] tracking-tight">
                Tinh Hoa Lúa Gạo Việt <br />
                <span className="gold-gradient-text">Giao Tận Tay Mỗi Ngày</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Cung cấp các dòng gạo ngon nhất Việt Nam (ST25, Hương Lài, Nếp Nương). Áp dụng hệ thống quản lý kho nghiêm ngặt theo phương pháp <strong className="text-amber-700 font-bold">FIFO</strong> bảo đảm hạt gạo luôn tươi mới nhất.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#products"
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  Khám Phá Sản Phẩm <ArrowRight className="w-5 h-5" />
                </a>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-300"
                  >
                    Đăng Ký Thành Viên
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-amber-200/60 grid grid-cols-3 gap-4 text-xs font-semibold text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Chuẩn VietGAP / HACCP</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Quản lý kho FIFO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Giao Nhanh Tận Nơi</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="relative">
              <div className="w-full h-80 sm:h-[420px] rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-700 p-1 shadow-2xl relative">
                <div className="w-full h-full bg-stone-900/90 rounded-[22px] p-8 flex flex-col justify-between text-white overflow-hidden relative">
                  {/* Decorative background circle */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl"></div>
                  
                  <div className="space-y-4 relative z-10">
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
                      Sản Phẩm Nổi Bật
                    </span>
                    <h3 className="text-3xl font-black text-amber-400">
                      Gạo ST25 Ông Cua (Túi 5kg)
                    </h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      Gạo ngon nhất thế giới - hạt dài, trong, không bạc bụng, khi nấu chín cơm dẻo, thơm hương lá dứa tự nhiên.
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Giá niêm yết</span>
                      <span className="text-2xl font-black text-amber-400">195.000đ</span>
                      <span className="text-xs text-stone-400 ml-1 font-normal">/ túi 5kg</span>
                    </div>
                    <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-md">
                      Thêm Vào Giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-stone-900">
            Tại Sao Chọn Nền Tảng Lúa Gạo Của Chúng Tôi?
          </h2>
          <p className="text-stone-600 mt-2">
            Cam kết chất lượng hạt gạo nguyên bản, dịch vụ giao hàng minh bạch và ưu đãi hấp dẫn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-amber-200/80 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Nguồn Gốc Cụ Thể</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Mỗi sản phẩm gạo đều có SKU và thông tin vùng trồng, chứng nhận VietGAP/HACCP minh bạch.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-amber-200/80 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Thuật Toán Kho FIFO</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Đơn hàng tự động xuất kho theo lô hạn sử dụng gần nhất, đảm bảo gạo không bị lưu kho quá hạn.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-amber-200/80 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Giao Hàng Tận Nơi</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Đội ngũ vận chuyển chuyên nghiệp, đóng gói túi 2kg, 5kg chống ẩm nguyên vẹn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
