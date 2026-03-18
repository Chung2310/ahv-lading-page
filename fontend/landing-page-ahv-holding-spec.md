# AHV HOLDING LANDING PAGE

## Product & Technical Specification

Version: 1.0\
Project: AHV Holding Landing Page\
Document Type: Product + Technical Specification\
Last Updated: 2026

---

# 1. Project Overview

## 1.1 Background

Landing page của AHV Holding được xây dựng nhằm:

- Giới thiệu năng lực công ty
- Quảng bá thương hiệu
- Thu hút khách hàng tiềm năng
- Hỗ trợ chiến dịch marketing
- Tăng tỉ lệ chuyển đổi

Hệ thống được thiết kế theo hướng **dynamic content**, cho phép
marketing chỉnh sửa nội dung mà không cần sửa code.

---

# 2. System Architecture

    Admin CMS
       │
       ▼
    Backend API
       │
       ▼
    Database
       │
       ▼
    Landing Page (Frontend)
       │
       ▼
    User Browser

---

# 3. Technology Stack

## Frontend

- Next.js
- React
- TailwindCSS
- Framer Motion

## Backend

- NodeJS
- NestJS / Express
- JWT Authentication

## Database

- MongoDB

## Storage

- Cloudinary

---

# 4. Landing Page Structure

Landing page gồm các section:

- Header
- Hero
- About
- Services
- Achievements
- Projects
- Partners
- Testimonials
- CTA
- Contact Form
- Footer

---

# 5. Section Specification

## Hero Section

Fields:

- title
- subtitle
- description
- background_image
- cta_text
- cta_link

Example:

```json
{
  "title": "AHV Holding",
  "subtitle": "Đối tác chiến lược cho sự phát triển bền vững",
  "description": "Cung cấp giải pháp công nghệ và đầu tư cho doanh nghiệp",
  "cta_text": "Liên hệ ngay"
}
```

---

## Services Section

Hiển thị các lĩnh vực hoạt động.

Example:

```json
[
  {
    "title": "AI Solutions",
    "description": "Phát triển nền tảng trí tuệ nhân tạo"
  },
  {
    "title": "Marketing Automation",
    "description": "Tự động hóa marketing"
  }
]
```

---

# 6. Database Design

## landing_pages

- id
- slug
- title
- status
- created_at
- updated_at

## landing_sections

- id
- landing_page_id
- section_key
- title
- content
- data
- order

## contacts

- id
- name
- email
- phone
- company
- message
- created_at

---

# 7. API Specification

## Get Landing Page

GET /api/landing/:slug

Example:

GET /api/landing/ahv-holding

---

## Submit Contact

POST /api/contact

Payload:

```json
{
  "name": "",
  "email": "",
  "phone": "",
  "company": "",
  "message": ""
}
```

---

# 8. CMS (Content Management System)

## CMS Modules

- Dashboard
- Landing Page Management
- Section Management
- Media Library
- Lead Management
- SEO Management
- User Management

---

## Landing Page Management

Cho phép:

- Tạo landing page
- Chỉnh sửa landing page
- Publish / Unpublish

Fields:

- title
- slug
- status
- created_at
- updated_at

---

## Section Management

Các loại section:

- hero
- about
- services
- achievements
- projects
- partners
- testimonials
- cta
- contact

Admin có thể:

- chỉnh nội dung
- thay đổi thứ tự
- ẩn / hiện section

---

## Media Library

Chức năng:

- Upload ảnh
- Xóa ảnh
- Copy link ảnh
- Tìm kiếm ảnh

Storage:

- AWS S3
- Cloudinary
- Local Storage

---

## Lead Management

Quản lý khách hàng từ landing page.

Fields:

- name
- email
- phone
- company
- message
- created_at

Status:

- new
- contacted
- converted

---

## SEO Management

Cho phép chỉnh:

- meta_title
- meta_description
- meta_keywords
- og_image

---

# 9. CMS Security

- JWT Authentication
- Role-based access control
- Password hashing
- Rate limiting
- CSRF protection

---

# 10. Deployment

Hosting options:

- Vercel
- AWS
- VPS + Nginx

Domain đề xuất:

landing.ahvholding.com

---

# 11. Future Features

### Multi-language

/vi\
/en

### Multiple Landing Pages

/landing/ai\
/landing/marketing\
/landing/crm

### A/B Testing

hero_v1\
hero_v2

---

# 12. Development Timeline

Phase Duration

---

Design 2 days
Frontend 4 days
Backend 3 days
Testing 2 days
Deploy 1 day

---

# 13. Conclusion

Landing page AHV Holding được thiết kế theo kiến trúc **CMS-driven**,
giúp:

- Marketing chỉnh nội dung không cần dev
- Quản lý nhiều landing page
- Tối ưu SEO
- Thu thập và quản lý lead
