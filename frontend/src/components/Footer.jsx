import { Wheat, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <Wheat className="w-6 h-6" />
              </div>
              <span className="text-lg font-extrabold text-amber-400 tracking-wider">
                RICE PLATFORM
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Nền tảng thương mại điện tử chuyên cung cấp các dòng lúa gạo sạch, chuẩn VietGAP, bảo quản theo quy chuẩn FIFO hàng đầu Việt Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide border-b border-stone-800 pb-2">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Gạo ST25 Đặc Sản</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Gạo Nếp Nương / Nếp Cái Hoa Vàng</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Gạo Hữu Cơ Huyết Rồng</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Gạo Hương Lài Thượng Hạng</li>
            </ul>
          </div>

          {/* Business Rules & Policy */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide border-b border-stone-800 pb-2">
              Cam Kết & Chính Sách
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Quy Trình Quản Lý Kho FIFO</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Chính Sách Đổi Trả Trong 7 Ngày</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Cam Kết Không Chất Bảo Quản</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Giao Hàng Tận Nơi Toàn Quốc</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide border-b border-stone-800 pb-2">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Số 10, Đường Lúa Vàng, Q. Bình Thạnh, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>1900 6868 (Hotline 24/7)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>support@riceplatform.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Rice E-Commerce Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Thiết kế với <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> cho Nông sản Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
