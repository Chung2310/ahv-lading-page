# AHV Landing Page API Documentation

Tài liệu tổng hợp tất cả các API cho trang AHV Landing Page.

**Base URL:** `http://localhost:5001/api/v1` (Local) | `http://103.253.21.98:5001/api/v1` (DEV)

---

## 🔐 Xác thực (Authentication)

Hệ thống sử dụng **Bearer Token** để xác thực. Token cần được gửi trong header của yêu cầu:
`Authorization: Bearer <your_access_token>`

---

## 🛠 Danh sách API

### 1. Unauthorized (Công khai & Xác thực)

#### **Đăng nhập**
- **Endpoint:** `POST /auths`
- **Mô tả:** Đăng nhập vào hệ thống để lấy token.
- **Đầu vào (Body):**
```json
{
  "username": "anguyen99",
  "password": "your_password"
}
```
- **Đầu ra:**
    - `200 OK`: Trả về thông tin người dùng và token.
    - `401 Unauthorized`: Tài khoản hoặc mật khẩu không chính xác.

#### **Refresh Token**
- **Endpoint:** `PUT /auths/refresh`
- **Mô tả:** Làm mới access token bằng refresh token.
- **Đầu vào (Body):**
```json
{
  "refreshToken": "string"
}
```
- **Đầu ra:**
    - `200 OK`: Refresh token thành công.
    - `401 Unauthorized`: Token không hợp lệ.

#### **Lấy thông tin cá nhân**
- **Endpoint:** `GET /auths/me`
- **Mô tả:** Lấy thông tin người dùng hiện tại từ token.
- **Header:** `Authorization: Bearer <token>`
- **Đầu ra:**
    - `200 OK`: Trả về thông tin người dùng.
    - `401 Unauthorized`: Token không hợp lệ.

---

### 2. Người dùng (User)

#### **Lấy danh sách người dùng**
- **Endpoint:** `GET /users`
- **Query Params:**
    - `page` (integer, default: 1): Số trang hiện tại.
    - `limit` (integer, default: 10): Số bản ghi mỗi trang.
- **Đầu ra:**
    - `200 OK`: Danh sách người dùng.

#### **Tạo người dùng mới**
- **Endpoint:** `POST /users`
- **Đầu vào (Body):**
```json
{
  "name": "Nguyen Van A",
  "username": "anguyen99",
  "password": "password123"
}
```
- **Đầu ra:**
    - `201 Created`: Tạo thành công.
    - `409 Conflict`: Username đã tồn tại.

#### **Lấy chi tiết người dùng**
- **Endpoint:** `GET /users/{id}`
- **Path Param:** `id` (ID người dùng)
- **Đầu ra:**
    - `200 OK`: Thông tin chi tiết.
    - `404 Not Found`: Không tìm thấy người dùng.

#### **Sửa thông tin người dùng**
- **Endpoint:** `PUT /users/{id}`
- **Đầu vào (Body):**
```json
{
  "name": "string",
  "username": "string"
}
```
- **Đầu ra:** `200 OK` | `404 Not Found`

#### **Xóa người dùng**
- **Endpoint:** `DELETE /users/{id}`
- **Đầu ra:** `200 OK` | `404 Not Found`

---

### 3. Bài viết (Post)

#### **Lấy danh sách bài viết**
- **Endpoint:** `GET /posts`
- **Query Params:** `page`, `limit`, `title`, `tags`, `categoryId`.
- **Đầu ra:** `200 OK` (Array Post)

#### **Tạo bài viết**
- **Endpoint:** `POST /posts`
- **Đầu vào (Body):**
```json
{
  "title": "Tiêu đề",
  "content": "Nội dung",
  "categoryId": "category_id",
  "imageUrl": "url",
  "tags": ["tag1", "tag2"]
}
```
- **Đầu ra:** `201 Created`

#### **Chi tiết / Sửa / Xóa bài viết**
- `GET /posts/{id}`
- `PUT /posts/{id}`
- `DELETE /posts/{id}`

---

### 4. Danh mục (Category)

- `GET /categories`: Danh sách danh mục (Params: `page`, `limit`, `name`).
- `POST /categories`: Tạo danh mục (Body: `{ "name": "...", "description": "..." }`).
- `GET /categories/{id}`: Chi tiết danh mục.
- `PUT /categories/{id}`: Cập nhật danh mục.
- `DELETE /categories/{id}`: Xóa danh mục.

---

### 5. Ticket (Hỗ trợ)

#### **Tạo Ticket (Công khai)**
- **Endpoint:** `POST /tickets`
- **Đầu vào (Body):**
```json
{
  "fullname": "Nguyen Van A",
  "phone": "0123456789",
  "email": "example@gmail.com",
  "description": "Yêu cầu hỗ trợ..."
}
```
- **Đầu ra:** `201 Created`

#### **Quản lý Ticket (Yêu cầu Token)**
- `GET /tickets`: Lấy danh sách ticket.
- `GET /tickets/{id}`: Chi tiết ticket.
- `PUT /tickets/{id}`: Cập nhật trạng thái (`status`: `processed`, v.v.).
- `DELETE /tickets/{id}`: Xóa ticket.

---

### 6. CV (Tuyển dụng)

#### **Nộp CV**
- **Endpoint:** `POST /cvs`
- **Đầu vào (Body):**
```json
{
  "filePath": "Link file CV",
  "jobDescriptionId": "ID công việc"
}
```
- **Đầu ra:** `201 Created`

#### **Quản lý CV (Yêu cầu Token)**
- `GET /cvs`: Danh sách CV (Params: `page`, `limit`, `jobDescriptionId`).
- `GET /cvs/{id}`: Chi tiết CV.
- `PUT /cvs/{id}`: Cập nhật trạng thái (`approve`, v.v.).
- `GET /cvs/stats/status`: Thống kê trạng thái CV.

---

### 7. Công việc (Job Description - JD)

- `GET /jds`: Danh sách công việc (Params: `page`, `limit`, `title`, `location`).
- `POST /jds`: Tạo công việc mới.
    - Body: `{ "title": "...", "position": "...", "salary": "...", "experience": "...", "level": "...", "jobType": "...", "location": "...", "description": "...", "requirements": "...", "benefits": "...", "quantity": 0, "expiredAt": "date-time" }`
- `GET /jds/{id}`: Chi tiết công việc.
- `PUT /jds/{id}`: Cập nhật công việc.
- `DELETE /jds/{id}`: Xóa công việc.

---

## 📋 Cấu trúc đối tượng (Schemas)

### **User**
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | ID tự động sinh |
| `name` | `string` | Tên hiển thị |
| `username` | `string` | Tên đăng nhập |
| `status` | `string` | Trạng thái (active, focus, v.v.) |

### **Post**
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Tiêu đề bài viết |
| `content` | `string` | Nội dung bài viết |
| `categoryId` | `string` | Link tới danh mục |
| `imageUrl` | `string` | Link ảnh đại diện |

### **JobDescription**
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Tên công việc |
| `salary` | `string` | Lương |
| `location` | `string` | Địa điểm |
| `expiredAt` | `date-time` | Ngày hết hạn |
