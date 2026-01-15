# Hee Coffee Fullstack Project
Dự án quản lý cửa hàng cà phê online với hệ thống Backend (Spring Boot), Frontend (React), Database (MySQL), được đóng gói bằng Dcker.

## Câu trúc dự án:
- hee-coffee-be: Backend sử dụng Spring Boot & Maven.
- hee-coffee-fe: Front-end sử dụng React.js.
- docker-compose.yml: Cấu hình chạy toàn bộ hệ thống bằng Docker.

## Công nghệ sử dụng:
- Backend: Java17, Spring Boot, Spring Security (JWT), Hibernate/JPA.
- Frontend: React.js, SCSS, SweetAlert2.
- Database: MySQL 8.0.
- DevOps: Docker, Docker Compose.

## Hướng dẫn cài đặt và khởi động
### Yêu cầu hệ thống:
- Máy đã cài đặt [Docker Deskop] (https://www.docker.com/products/docker-desktop/)
- Git (Để clone dự án)
### Chạy dự án bằng Docker:
**Chạy lệnh sau tại thư mục gốc của dự án:**
```bash
docker-compose up -d --build
```
**Sau khi lệnh chạy xong:**
- Frontend: Truy cập http://localhost:3000
- Backend API: Truy cập http://localhost:8080
- Database (MySQL): Chạy trên cổng 3307 (tránh xung đột với MySQL cài sẵn nếu có)
**Dừng hệ thống**
```bash
docker-compose down
