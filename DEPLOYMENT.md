# 🚀 Panduan Deploy WealthEase-AI

## 📱 Cara 1: Menggunakan ngrok (Paling Mudah)

### **Step 1: Install ngrok**
1. Download dari [ngrok.com/download](https://ngrok.com/download)
2. Extract file ngrok.exe ke folder project
3. Atau install via package manager:
   ```bash
   # Windows (dengan Chocolatey)
   choco install ngrok
   
   # Mac (dengan Homebrew)
   brew install ngrok
   ```

### **Step 2: Setup Local Server**
```bash
# Di folder project WealthEase
python -m http.server 8000
```

### **Step 3: Setup ngrok**
```bash
# Di terminal/command prompt baru
ngrok http 8000
```

### **Step 4: Update Google OAuth**
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Go to APIs & Services > Credentials
3. Edit OAuth 2.0 Client ID
4. Add authorized origins:
   - `https://abc123.ngrok.io` (dari ngrok output)
5. Save

### **Step 5: Update config.js**
```javascript
// Tidak perlu diubah, sudah menggunakan Client ID yang benar
```

### **Hasil:**
- URL ngrok bisa dibuka di HP
- Bisa dibagikan ke orang lain
- Otomatis HTTPS

---

## 🌐 Cara 2: GitHub Pages (Gratis)

### **Step 1: Upload ke GitHub**
1. Buat repository baru di GitHub
2. Upload semua file project
3. Commit dan push

### **Step 2: Enable GitHub Pages**
1. Go to repository Settings
2. Scroll ke "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Save

### **Step 3: Update Google OAuth**
1. Google Cloud Console > Credentials
2. Add authorized origins:
   - `https://username.github.io`
   - `https://username.github.io/WealthEase-AI`

### **Hasil:**
- URL: `https://username.github.io/WealthEase-AI`
- Gratis selamanya
- Otomatis HTTPS

---

## 🚀 Cara 3: Netlify (Paling Mudah untuk Deploy)

### **Step 1: Deploy ke Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag & drop folder project
4. Dapatkan URL: `https://wealthease-ai.netlify.app`

### **Step 2: Update Google OAuth**
1. Google Cloud Console > Credentials
2. Add authorized origins:
   - `https://wealthease-ai.netlify.app`

### **Hasil:**
- URL custom bisa diatur
- Deploy otomatis dari GitHub
- HTTPS otomatis

---

## 📱 Testing di HP

### **Cara Test:**
1. Buka browser di HP
2. Masukkan URL yang didapat
3. Test login manual dan Google Sign-In
4. Pastikan responsive design bekerja

### **Troubleshooting HP:**
- Pastikan koneksi internet stabil
- Clear browser cache jika ada masalah
- Test di browser berbeda (Chrome, Safari, Firefox)

---

## 🔧 Update untuk Production

### **File yang Perlu Diupdate:**

1. **config.js** - Pastikan API keys valid
2. **Google Cloud Console** - Update authorized origins
3. **README.md** - Update deployment instructions

### **Security Notes:**
- Jangan commit API keys ke public repository
- Gunakan environment variables untuk production
- Monitor API usage dan costs

---

## 📞 Bantuan

### **Jika ngrok tidak bekerja:**
```bash
# Coba dengan port berbeda
python -m http.server 3000
ngrok http 3000
```

### **Jika GitHub Pages error:**
- Pastikan file index.html ada di root
- Check repository settings
- Wait 5-10 menit untuk deploy

### **Jika Netlify error:**
- Check build logs
- Pastikan semua file ter-upload
- Contact Netlify support

---

**Rekomendasi:** Mulai dengan ngrok untuk testing cepat, lalu deploy ke Netlify untuk production.
