# Chọn base image
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Copy file package.json và file package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --legacy-peer-deps

# Copy source code vào trong container
COPY . .

# Xây dựng ứng dụng
RUN npm run build

# Mở port mà Next.js chạy trên đó (mặc định là 3000, có thể bạn cần đổi nếu backend cũng chạy trên port này)
EXPOSE 3000

# Chạy ứng dụng Next.js trong production mode
CMD ["npm", "start"]