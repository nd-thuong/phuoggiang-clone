# Chọn một base image
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Cài đặt build dependencies cần thiết để compile native add-ons
RUN apk --no-cache add --virtual builds-deps build-base python3 && apk add postgresql-client

# Copy file package.json và file package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ source code vào trong container
COPY . .

# Build ứng dụng
RUN npm run build

# Rebuild dependencies cần thiết
RUN npm rebuild bcrypt --build-from-source

# Copy script wait-for-db.sh vào trong container
COPY wait-for-db.sh .

# Đặt quyền thực thi cho script wait-for-db.sh
RUN chmod +x wait-for-db.sh

# Mở port mà NestJS chạy (mặc định là 4000)
EXPOSE 4000

# Đặt sh là interpreter cho tất cả các lệnh sau này
# SHELL ["/bin/sh", "-c"]

# Chạy script để chờ db, sau đó chạy ứng dụng
CMD ["./wait-for-db.sh", "db:5432", "--", "npm", "run", "start:prod"]