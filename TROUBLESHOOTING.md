# 🔧 Panduan Troubleshooting WealthEase-AI

## 🚨 Masalah Umum dan Solusinya

### 1. **Error Google Sign-In**

#### **Gejala:**
- Tombol "Login with Google" tidak muncul
- Error "Google Sign-In not available"
- Popup tidak terbuka saat klik login

#### **Solusi:**

**a. Periksa Google Cloud Console Setup:**
```
1. Buka Google Cloud Console (console.cloud.google.com)
2. Pastikan project Anda aktif
3. Ke menu "APIs & Services" > "Credentials"
4. Periksa OAuth 2.0 Client ID Anda
5. Pastikan "Authorized JavaScript origins" berisi:
   - http://localhost:8000 (untuk development)
   - https://yourdomain.com (untuk production)
```

**b. Periksa Client ID:**
```javascript
// Di config.js, pastikan Client ID benar:
GOOGLE_CLIENT_ID: '779523586683-ggj89c8velefopeplnh25oafr8obf2jp.apps.googleusercontent.com'
```

**c. Periksa Browser Console:**
- Buka Developer Tools (F12)
- Lihat tab Console untuk error messages
- Periksa tab Network untuk failed requests

### 2. **Error "Configuration not valid"**

#### **Solusi:**
```javascript
// Pastikan di config.js:
const CONFIG = {
    GOOGLE_CLIENT_ID: 'your-actual-client-id', // Bukan placeholder
    OPENAI_API_KEY: 'your-actual-api-key',     // Bukan placeholder
    // ... rest of config
};
```

### 3. **Aplikasi Tidak Bisa Dibuka**

#### **Gejala:**
- Halaman blank
- Error "file not found"
- Tidak bisa akses localhost

#### **Solusi:**

**a. Pastikan Server Berjalan:**
```bash
# Terminal/Command Prompt, di folder project:
python -m http.server 8000

# Atau gunakan Node.js:
npx http-server

# Atau gunakan PHP:
php -S localhost:8000
```

**b. Akses URL yang Benar:**
- ✅ http://localhost:8000
- ✅ http://127.0.0.1:8000
- ❌ file:///C:/path/to/file.html (tidak akan bekerja untuk OAuth)

### 4. **Error CORS atau Network**

#### **Solusi:**
- Pastikan menggunakan HTTP server (bukan membuka file langsung)
- Periksa firewall/antivirus yang memblokir localhost
- Coba browser lain (Chrome, Firefox, Edge)

### 5. **OpenAI API Error**

#### **Gejala:**
- Status "OpenAI Not Connected"
- Error 401/403 dari OpenAI API

#### **Solusi:**
```javascript
// 1. Dapatkan API key dari: https://platform.openai.com/api-keys
// 2. Update config.js:
OPENAI_API_KEY: 'sk-your-actual-api-key-here'

// 3. Pastikan API key valid dan ada kredit
```

## 🔍 Langkah-langkah Debugging

### **Step 1: Gunakan Debug Page**
1. Buka `debug.html` di browser
2. Klik tombol-tombol check untuk melihat status
3. Periksa console logs untuk error details

### **Step 2: Periksa Browser Console**
1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error messages
3. Screenshot error untuk referensi

### **Step 3: Test Manual**
```javascript
// Buka browser console dan test:
console.log('Config loaded:', typeof CONFIG !== 'undefined');
console.log('Google Client ID:', CONFIG.GOOGLE_CLIENT_ID);
console.log('Google library:', typeof google !== 'undefined');
```

### **Step 4: Periksa Network**
1. Developer Tools > Network tab
2. Refresh halaman
3. Lihat failed requests (status merah)

## 📋 Checklist Troubleshooting

### **Setup Awal:**
- [ ] Server HTTP berjalan (python -m http.server 8000)
- [ ] Mengakses via localhost:8000 (bukan file://)
- [ ] Client ID sudah diupdate di config.js
- [ ] Client ID sudah diupdate di index.html (baris 21)

### **Google OAuth:**
- [ ] Google Cloud Console project aktif
- [ ] OAuth consent screen dikonfigurasi
- [ ] Authorized origins berisi localhost:8000
- [ ] Google+ API enabled
- [ ] Client ID format benar (xxx.apps.googleusercontent.com)

### **Browser:**
- [ ] JavaScript enabled
- [ ] Popup blocker disabled
- [ ] Cookies enabled
- [ ] Coba browser lain jika perlu

### **Network:**
- [ ] Internet connection stabil
- [ ] Firewall tidak memblokir localhost
- [ ] Antivirus tidak memblokir browser

## 🆘 Masih Error?

### **Informasi yang Dibutuhkan:**
1. **Browser dan versi:** Chrome 120, Firefox 118, dll
2. **OS:** Windows 10, macOS, Linux
3. **Error message lengkap** dari console
4. **Screenshot** error page
5. **URL** yang sedang diakses

### **Test Sederhana:**
```html
<!-- Buat file test.html untuk test minimal -->
<!DOCTYPE html>
<html>
<head>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <div id="g_id_onload"
         data-client_id="779523586683-ggj89c8velefopeplnh25oafr8obf2jp.apps.googleusercontent.com"
         data-callback="handleCredentialResponse">
    </div>
    <div class="g_id_signin" data-type="standard"></div>
    
    <script>
        function handleCredentialResponse(response) {
            console.log('Success:', response);
            alert('Login berhasil!');
        }
    </script>
</body>
</html>
```

## 📞 Bantuan Tambahan

Jika masih mengalami masalah:
1. Gunakan `debug.html` untuk diagnosis lengkap
2. Periksa semua checklist di atas
3. Test dengan file `test.html` sederhana
4. Screenshot error dan kirim detail masalah

**Catatan:** Pastikan semua file berada di folder yang sama dan diakses via HTTP server, bukan file://
