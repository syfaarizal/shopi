# Shopi — Update Package

Berisi **hanya file baru / file yang dimodifikasi**. File lain tidak berubah.

## Cara apply

1. Extract ZIP ini
2. Copy seluruh isi folder `backend/` ke `shopi/backend/` (overwrite)
3. Copy seluruh isi folder `frontend/src/` ke `shopi/frontend/src/` (overwrite)
4. Jalankan ulang seperti biasa

## Apa yang berubah

### Fitur baru
| Fitur | Detail |
|---|---|
| **Role user/admin** | User punya field `role: 'user'` atau `'admin'`. Admin seed: `admin@shopi.com` / `admin123` |
| **Admin Dashboard** | Route `/admin/*` — hanya bisa diakses admin. Sidebar dengan 4 menu |
| **Product CRUD** | Admin bisa tambah/edit/hapus produk + upload gambar |
| **Image Upload** | Drag-drop upload di form produk. Backend simpan ke `backend/uploads/` |
| **Dummy Payment** | Halaman `/payment/:id` dengan Virtual Account, E-Wallet QR, dan form kartu |
| **Order status update** | Admin bisa ubah status order. Checkout → pending → payment page → paid |

### File baru (frontend)
- `src/store/productStore.js`
- `src/store/paymentStore.js`
- `src/components/AdminRoute.jsx`
- `src/components/ImageUpload.jsx`
- `src/pages/Payment.jsx`
- `src/pages/admin/AdminLayout.jsx`
- `src/pages/admin/Dashboard.jsx`
- `src/pages/admin/AdminProducts.jsx`
- `src/pages/admin/AdminOrders.jsx`
- `src/pages/admin/AdminUsers.jsx`

### File dimodifikasi (frontend)
- `src/App.jsx` — route baru
- `src/store/authStore.js` — role + admin user seed
- `src/store/orderStore.js` — status awal "pending", tambah `updateOrderStatus`
- `src/pages/Checkout.jsx` — redirect ke `/payment/:id`
- `src/components/Navbar.jsx` — link admin untuk admin user

### File baru (backend)
- `app/routers/admin.py`
- `app/routers/payments.py`
- `app/routers/uploads.py`

### File dimodifikasi (backend)
- `app/auth.py` — tambah `require_admin`
- `app/models.py` — field `role`
- `app/routers/auth.py` — role saat register
- `app/main.py` — router baru + static files
- `app/seed.py` — seed admin user
- `requirements.txt` — tambah `aiofiles`
