function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function removeVietnameseSigns(str: string): string {
  str = str.toLowerCase();
  str = str.replace(/đ/g, 'd'); // thay thế "đ" thành "d"
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // loại bỏ các dấu thanh
  return str;
}

export function createSlug(name: string): string {
  // Xóa các ký tự đặc biệt, chuyển đổi về chữ thường và thay thế khoảng trắng bằng dấu gạch ngang
  const slug = removeVietnameseSigns(name)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Loại bỏ các ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/--+/g, '-'); // Loại bỏ các dấu gạch ngang liên tiếp

  // Thêm một chuỗi ngẫu nhiên 6 ký tự vào cuối slug
  const randomString = generateRandomString(6);
  const finalSlug = `${slug}-${randomString}`;

  return finalSlug;
}
