# 🎓 Seminar Hall Booking System (Admin-Only)

A modern and secure **Seminar Hall Booking Platform** built using
**Next.js (App Router)**, **shadcn/ui**, **Prisma**, and
**NextAuth.js**.\
This system is designed exclusively for **authorized admins**, allowing
institutions to manage hall bookings with proper role-based access and
zero double-bookings.

## 🚀 Features

### 🔐 Authentication & Roles

-   Secure admin login with **NextAuth.js**
-   **Super Admin** can add/remove admins
-   **Admin** can only manage bookings
-   Role-based access across the application

### 🏛️ Seminar Hall Management

-   3 predefined halls: **Hall A**, **Hall B**, **Hall C**
-   View availability by date and hall
-   Automatic prevention of overlapping bookings

### 📅 Booking System

-   Create bookings with:
    -   Hall\
    -   Department\
    -   Date\
    -   Start time\
    -   End time\
    -   Purpose / Event name\
-   Edit or cancel bookings anytime
-   Clean UI using **shadcn DataTable** with filters

### 📤 CSV Export

-   Download all bookings as **CSV**
-   Generated via server-side using **json2csv**
-   Works with filters for custom exports

### 🎨 UI & UX (shadcn)

-   Clean, modern interface using **shadcn/ui**
-   Responsive dashboard with sidebar navigation
-   Modal dialogs, inputs, date pickers & tables

## 🛠️ Tech Stack

-   **Next.js 14+ (App Router)**
-   **shadcn/ui**
-   **Prisma ORM**
-   **PostgreSQL / MySQL**
-   **NextAuth.js**
-   **Tailwind CSS**
-   **json2csv** (CSV export)

## 📂 Project Structure

    app/
     ├─ (auth)/login/
     ├─ dashboard/
     │   ├─ bookings/
     │   ├─ halls/
     │   ├─ admins/
     ├─ api/
     │   ├─ bookings/
     │   │   ├─ route.ts
     │   │   └─ export/route.ts
     │   └─ admins/
     └─ layout.tsx

## 🗄 Database Models (Prisma)

### **Admin**

-   id\
-   name\
-   email\
-   password\
-   role (SUPER_ADMIN / ADMIN)

### **SeminarHall**

-   id\
-   name\
-   capacity\
-   location

### **Booking**

-   id\
-   hall_id\
-   admin_id\
-   department\
-   date\
-   start_time\
-   end_time\
-   purpose

## 🎯 Why This Project?

Educational institutions often struggle with: - Conflicting hall
schedules\
- Manual record keeping\
- No centralized booking system

This project solves these problems with: - Reliable booking flow\
- Role-based access\
- CSV export for audits & reports\
- Fast and clean UI

## 📦 Future Enhancements

-   Email notifications for bookings\
-   Calendar view (FullCalendar.js)\
-   Analytics dashboard\
-   Department-wise stats\
-   Mobile app version

## 📜 License

This project is open-source under the **MIT License**.
