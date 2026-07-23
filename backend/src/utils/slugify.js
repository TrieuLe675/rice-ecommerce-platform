/**
 * Chuyển đổi chuỗi tiếng Việt sang slug URL-safe chuẩn SEO.
 * Ví dụ: "Gạo ST25 Ông Cua 5kg" -> "gao-st25-ong-cua-5kg"
 */
export const slugify = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // Bỏ dấu thanh/huyền/sắc...
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')      // Chỉ giữ chữ cái, số, dấu cách, gạch ngang
    .replace(/\s+/g, '-')              // Thay khoảng trắng thành gạch ngang
    .replace(/-+/g, '-');              // Không để gạch ngang liên tiếp
};

export default slugify;
