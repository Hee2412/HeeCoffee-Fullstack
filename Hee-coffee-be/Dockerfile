# Bước 1: Build file jar từ source code
FROM maven:3.9-eclipse-temurin-17 AS build
# -> Tạo không gian làm việc (1) bằng Java 17, Maven
WORKDIR /app
# -> Tạo thử mục tên app (2), trong không gian mới tạo (1)
COPY . .
# -> Copy toàn bộ code từ máy tính vào thư mục app(2)
RUN mvn clean package -DskipTests
# -> Chạy lệnh đóng gói code thành file .jar (bỏ qua test)

# Bước 2: Chạy file jar với JDK
FROM eclipse-temurin:17-jre-alpine
# -> Lấy máy chạy Java (JRE)(3)
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# -> Lấy file .jar ở bước 1 bỏ vào máy(3)
EXPOSE 8080
# -> Mở 1 cửa sổ cổng 8080 để bắt đầu order
ENTRYPOINT ["java", "-jar", "app.jar"]
# -> Lệnh khởi động server Java