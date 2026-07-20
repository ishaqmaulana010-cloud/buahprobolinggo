// =========================================================================
// TOKO BUAH ONLINE PROBOLINGGO — PREMIUM JAVASCRIPT
// =========================================================================

// =========================================================================
// 1. DATABASE VARIETAS BUAH + STOK + DISKON
// =========================================================================
//
// ╔══════════════════════════════════════════════════════════════════╗
// ║  PANDUAN EDIT STOK & DISKON (untuk pemilik toko)              ║
// ║                                                                ║
// ║  Cari bagian dataKategori di bawah ini.                       ║
// ║  Setiap buah punya 4 properti penting:                        ║
// ║                                                                ║
// ║  • stok: angka jumlah kg yang tersedia                        ║
// ║          → tulis 0 kalau habis                                ║
// ║          → tulis angka berapa kg yang tersisa                  ║
// ║                                                                ║
// ║  • diskon: angka persen diskon (0 = tanpa diskon)             ║
// ║           → tulis 20 artinya diskon 20%                       ║
// ║           → tulis 0 artinya harga normal                      ║
// ║                                                                ║
// ║  • harga: harga asli per kg (sebelum diskon)                  ║
// ║                                                                ║
// ║  CONTOH:                                                       ║
// ║  { nama: 'Durian Montong', harga: 85000, stok: 50, diskon: 10 } ║
// ║  → Stok 50 kg, diskon 10%, harga jual = Rp 76.500            ║
// ║                                                                ║
// ╚══════════════════════════════════════════════════════════════════╝
//
var dataKategori = {
    'Durian': {
        icon: 'fas fa-crown',
        bg: 'bg-durian',
        badge: '🔥 Best Seller',
        deskripsi: 'Raja buah khas Probolinggo, daging tebal & manis legit',
        varietas: [
            //           ↓ EDIT STOK & DISKON DI SINI ↓
            { nama: 'Durian Montong',           harga: 85000,  stok: 50,  diskon: 0  },
            { nama: 'Durian Musang King',       harga: 120000, stok: 25,  diskon: 10 },
            { nama: 'Durian Bawor',             harga: 75000,  stok: 30,  diskon: 0  },
            { nama: 'Durian Black Thorn',       harga: 150000, stok: 10,  diskon: 15 },
            { nama: 'Durian Lokal Probolinggo', harga: 50000,  stok: 100, diskon: 0  }
        ]
    },
    'Manggis': {
        icon: 'fas fa-gem',
        bg: 'bg-manggis',
        badge: '👑 Premium',
        deskripsi: 'Ratu buah yang kaya antioksidan, rasa manis segar',
        varietas: [
            //           ↓ EDIT STOK & DISKON DI SINI ↓
            { nama: 'Manggis Super Export', harga: 35000, stok: 40, diskon: 0  },
            { nama: 'Manggis Lokal Manis', harga: 25000, stok: 60, diskon: 20 }
        ]
    },
    'Alpukat': {
        icon: 'fas fa-seedling',
        bg: 'bg-alpukat',
        badge: '🥑 Favorit',
        deskripsi: 'Alpukat mentega jumbo, creamy & lembut banget',
        varietas: [
            //           ↓ EDIT STOK & DISKON DI SINI ↓
            { nama: 'Alpukat Mentega Jumbo', harga: 45000, stok: 35, diskon: 0  },
            { nama: 'Alpukat Aligator',      harga: 35000, stok: 0,  diskon: 0  }
        ]
    },
    'Asem': {
        icon: 'fas fa-leaf',
        bg: 'bg-asem',
        badge: '🌿 Khas Lokal',
        deskripsi: 'Asem pilihan, cocok buat bumbu masak & camilan',
        varietas: [
            //           ↓ EDIT STOK & DISKON DI SINI ↓
            { nama: 'Asem Jawa Matang',    harga: 15000, stok: 80, diskon: 0  },
            { nama: 'Asem Manis Thailand', harga: 30000, stok: 20, diskon: 25 }
        ]
    }
};

// Helper: hitung harga setelah diskon
function hitungHargaDiskon(harga, diskon) {
    if (diskon <= 0) return harga;
    return Math.round(harga * (1 - diskon / 100));
}

// Helper: dapatkan harga termurah dalam kategori
function hargaTermurah(namaKategori) {
    var kategori = dataKategori[namaKategori];
    var min = Infinity;
    kategori.varietas.forEach(function (v) {
        var h = hitungHargaDiskon(v.harga, v.diskon);
        if (h < min) min = h;
    });
    return min;
}

// Helper: cek apakah kategori ada stok
function cekStokKategori(namaKategori) {
    var kategori = dataKategori[namaKategori];
    var totalStok = 0;
    kategori.varietas.forEach(function (v) { totalStok += v.stok; });
    return totalStok > 0;
}

// =========================================================================
// 2. GENERATE KATALOG CARDS (with stock & discount info)
// =========================================================================
function renderKatalog() {
    var container = document.getElementById('grid-katalog');
    if (!container) return;
    var html = '';
    var keys = Object.keys(dataKategori);
    keys.forEach(function (namaKat) {
        var kat = dataKategori[namaKat];
        var adaStok = cekStokKategori(namaKat);
        var minHarga = hargaTermurah(namaKat);
        // check if any varietas has diskon
        var adaDiskon = false;
        kat.varietas.forEach(function (v) { if (v.diskon > 0) adaDiskon = true; });

        html += '<div class="kartu-buah efek-scroll">' +
            '<div class="kartu-buah-inner">' +
                '<div class="badge-promo">' + kat.badge + '</div>' +
                (adaDiskon ? '<div class="badge-diskon"><i class="fas fa-percent"></i> DISKON</div>' : '') +
                '<div class="foto-buah ' + kat.bg + '"><i class="' + kat.icon + '"></i></div>' +
                '<h3 class="nama-buah">Aneka ' + namaKat + '</h3>' +
                '<p class="deskripsi-produk">' + kat.deskripsi + '</p>' +
                '<div class="badge-stok ' + (adaStok ? 'tersedia' : 'habis') + '">' +
                    '<i class="fas fa-' + (adaStok ? 'check-circle' : 'times-circle') + '"></i> ' +
                    (adaStok ? 'Stok Tersedia' : 'Stok Habis') +
                '</div>' +
                '<div class="harga-buah">Mulai Rp ' + minHarga.toLocaleString('id-ID') + ' <span class="satuan">/ kg</span></div>' +
                '<button class="tombol-beli" onclick="bukaKategori(\'' + namaKat + '\')" ' + (adaStok ? '' : 'disabled') + '>' +
                    '<i class="fas fa-search"></i> ' + (adaStok ? 'Lihat Macamnya' : 'Stok Habis') +
                '</button>' +
            '</div>' +
        '</div>';
    });
    container.innerHTML = html;
}

// =========================================================================
// 3. ANTI-FRAUD & SECURITY
// =========================================================================
function sanitizeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function cekSpam(teks) {
    var lowerTeks = teks.toLowerCase();
    if (/(.)\1{5,}/.test(teks)) return true;
    var spamWords = ['http://', 'https://', 'www.', '.com/', '.net/', 'click here',
        'free money', 'bitcoin', 'crypto', '<script', 'javascript:', 'onclick',
        'onerror', 'eval(', 'document.cookie'];
    for (var i = 0; i < spamWords.length; i++) {
        if (lowerTeks.includes(spamWords[i])) return true;
    }
    if (teks.length > 15 && teks === teks.toUpperCase() && /[A-Z]/.test(teks)) return true;
    return false;
}

function validasiNomorWA(nomor) {
    var clean = nomor.replace(/[\s\-]/g, '');
    return /^(0|62)[0-9]{9,13}$/.test(clean);
}

function validasiEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOrderToken() {
    var ts = Date.now().toString(36);
    var rnd = Math.random().toString(36).substring(2, 8);
    return ('LB-' + ts + '-' + rnd).toUpperCase();
}

function getDeviceFingerprint() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('LapakBuah', 2, 2);
    var data = canvas.toDataURL();
    var hash = 0;
    for (var i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
}

var CHECKOUT_COOLDOWN_KEY = 'lapakbuah_checkout_cooldown';
function cekCooldownCheckout() {
    var last = localStorage.getItem(CHECKOUT_COOLDOWN_KEY);
    if (last && (Date.now() - parseInt(last)) < 60000) return false;
    return true;
}

// =========================================================================
// 4. PRELOADER
// =========================================================================
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    setTimeout(function () {
        preloader.classList.add('selesai');
        renderKatalog();
        initScrollAnimations();
        animasiAngkaStats();
        cekLoginStatus();
        initFirestoreUlasan();
        initStarRating();
    }, 1200);
});

// =========================================================================
// 5. NAVBAR — STICKY + HAMBURGER + SCROLL SPY
// =========================================================================
var navbar = document.getElementById('navbar');
var btnToggleNav = document.getElementById('btn-toggle-nav');
var menuNav = document.getElementById('menu-nav');
var navLinks = document.querySelectorAll('.nav-link');

function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
}

btnToggleNav.addEventListener('click', function () {
    btnToggleNav.classList.toggle('aktif');
    menuNav.classList.toggle('buka');
});

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        btnToggleNav.classList.remove('aktif');
        menuNav.classList.remove('buka');
    });
});

function handleScrollSpy() {
    var sections = document.querySelectorAll('section[id], footer[id]');
    var scrollPos = window.scrollY + 150;
    sections.forEach(function (section) {
        if (section.classList.contains('tersembunyi')) return;
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(function (link) {
                link.classList.remove('aktif');
                if (link.getAttribute('data-section') === id) link.classList.add('aktif');
            });
        }
    });
}

// =========================================================================
// 6. BACK TO TOP BUTTON
// =========================================================================
var btnBackToTop = document.getElementById('btn-back-to-top');
function handleBackToTop() {
    btnBackToTop.classList.toggle('tampil', window.scrollY > 500);
}

// =========================================================================
// 7. UNIFIED SCROLL HANDLER (throttled)
// =========================================================================
var ticking = false;
window.addEventListener('scroll', function () {
    if (!ticking) {
        requestAnimationFrame(function () {
            handleNavbarScroll();
            handleScrollSpy();
            handleBackToTop();
            ticking = false;
        });
        ticking = true;
    }
});
handleNavbarScroll();

// =========================================================================
// 8. SCROLL ANIMATIONS — IntersectionObserver
// =========================================================================
function initScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () { entry.target.classList.add('muncul'); }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.efek-scroll').forEach(function (el) {
        observer.observe(el);
    });
}

// =========================================================================
// 9. HERO STATS COUNTER
// =========================================================================
function animasiAngkaStats() {
    document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'));
        var start = performance.now();
        function update(now) {
            var progress = Math.min((now - start) / 1500, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    });
}

// =========================================================================
// 10. FIREBASE CONFIGURATION (Placeholder)
// =========================================================================
// ╔══════════════════════════════════════════════════════════════════╗
// ║  PANDUAN SETUP FIREBASE (Ganti ini setelah bikin project!)     ║
// ║  1. Buka console.firebase.google.com, bikin project baru       ║
// ║  2. Tambahkan Web App, copy config-nya ke bawah ini            ║
// ║  3. Aktifkan Authentication (Sign-in method: Google)           ║
// ║  4. Aktifkan Firestore Database (Start in test mode)           ║
// ╚══════════════════════════════════════════════════════════════════╝
var firebaseConfig = {
    apiKey: "AIzaSyBws4xNmfrPSyVYvgbKNVMxHoyWE0-LctI",
    authDomain: "toko-buah-online-probolinggo.firebaseapp.com",
    projectId: "toko-buah-online-probolinggo",
    storageBucket: "toko-buah-online-probolinggo.firebasestorage.app",
    messagingSenderId: "301787176721",
    appId: "1:301787176721:web:163475aa4b25affa88f6b0"
};

// Initialize Firebase
if (firebaseConfig.apiKey !== "GANTI_DENGAN_API_KEY_KAMU") {
    firebase.initializeApp(firebaseConfig);
}
var auth = typeof firebase !== 'undefined' && firebase.apps.length ? firebase.auth() : null;
var db = typeof firebase !== 'undefined' && firebase.apps.length ? firebase.firestore() : null;

// =========================================================================
// 11. LOGIN SYSTEM FOR REVIEWS (Firebase Auth)
// =========================================================================
var emailTerlogin = null;
var namaTerlogin = null;
var fotoTerlogin = null;

function cekLoginStatus() {
    if (!auth) {
        // Fallback kalau Firebase belum disetup
        tampilkanLoginNotice();
        return;
    }
    auth.onAuthStateChanged(function(user) {
        if (user) {
            emailTerlogin = user.email;
            namaTerlogin = user.displayName;
            fotoTerlogin = user.photoURL;
            tampilkanFormUlasan();
            // Panggil render lagi buat update badge
            renderUlasanLokal(); 
        } else {
            emailTerlogin = null;
            tampilkanLoginNotice();
        }
    });
}

function loginGoogle() {
    if (!auth) {
        tampilkanToast('Firebase belum disetup! Cek file jualan.js bre', 'fa-exclamation-triangle');
        return;
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
        tampilkanToast('Login berhasil! ✅', 'fa-check-circle');
    }).catch(function(error) {
        tampilkanToast('Login gagal: ' + error.message, 'fa-times-circle');
    });
}

function logoutReview() {
    if (auth) {
        auth.signOut().then(function() {
            tampilkanToast('Berhasil logout', 'fa-sign-out-alt');
        });
    }
}

function tampilkanFormUlasan() {
    var loginNotice = document.getElementById('login-notice');
    var formArea = document.getElementById('area-form-ulasan');
    var displayEmail = document.getElementById('display-email-login');

    if (loginNotice) loginNotice.classList.add('tersembunyi');
    if (formArea) formArea.classList.remove('tersembunyi');
    if (displayEmail) displayEmail.textContent = emailTerlogin;
}

function tampilkanLoginNotice() {
    var loginNotice = document.getElementById('login-notice');
    var formArea = document.getElementById('area-form-ulasan');

    if (loginNotice) loginNotice.classList.remove('tersembunyi');
    if (formArea) formArea.classList.add('tersembunyi');
}

// =========================================================================
// 12. REVIEW & RATING SYSTEM (Firebase Firestore)
// =========================================================================
var reviewLokal = [];
var STORAGE_KEY_COOLDOWN = 'lapakbuah_review_cooldown';

function initFirestoreUlasan() {
    if (!db) {
        renderUlasanLokal();
        return;
    }
    // Dengerin perubahan data secara realtime (langsung update tanpa refresh)
    db.collection('reviews').orderBy('timestamp', 'desc').onSnapshot(function(snapshot) {
        reviewLokal = [];
        snapshot.forEach(function(doc) {
            reviewLokal.push(doc.data());
        });
        renderUlasanLokal();
    }, function(error) {
        console.error("Error ambil ulasan:", error);
    });
}

function simpanUlasanKeFirestore(ulasanBaru) {
    if (!db) {
        tampilkanToast('Firebase belum disetup! Review tidak tersimpan.', 'fa-exclamation-triangle');
        return;
    }
    db.collection('reviews').add(ulasanBaru)
        .then(function() {
            tampilkanToast('Terima kasih atas ulasannya, bre! 🙏', 'fa-check-circle');
        })
        .catch(function(error) {
            tampilkanToast('Gagal mengirim ulasan: ' + error.message, 'fa-times-circle');
        });
}

function hitungRataRating() {
    if (reviewLokal.length === 0) return { rata: '0', total: 0 };
    var total = 0;
    reviewLokal.forEach(function (r) { total += r.rating; });
    return { rata: (total / reviewLokal.length).toFixed(1), total: reviewLokal.length };
}

function formatTanggalReview(dateStr) {
    var now = new Date();
    var date = new Date(dateStr);
    var diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return diffDays + ' hari lalu';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' minggu lalu';
    if (diffDays < 365) return Math.floor(diffDays / 30) + ' bulan lalu';
    return Math.floor(diffDays / 365) + ' tahun lalu';
}

function buatBintangHTML(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) html += (i <= rating ? '⭐' : '☆');
    return html;
}

function getAvatarGradient(nama) {
    if (!nama) nama = 'A';
    var gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #a18cd1, #fbc2eb)',
        'linear-gradient(135deg, #fccb90, #d57eeb)',
        'linear-gradient(135deg, #30cfd0, #330867)'
    ];
    var hash = 0;
    for (var i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash);
    return gradients[Math.abs(hash) % gradients.length];
}

function maskEmail(email) {
    if (!email) return '';
    var parts = email.split('@');
    if (parts.length !== 2) return email;
    var name = parts[0];
    var masked = name.substring(0, Math.min(3, name.length)) + '***';
    return masked + '@' + parts[1];
}

function renderUlasanLokal() {
    var container = document.getElementById('daftar-ulasan');
    var info = hitungRataRating();

    var elAngka = document.getElementById('angka-rating');
    var elBintang = document.getElementById('bintang-rating-besar');
    var elTotal = document.getElementById('total-ulasan');
    if (elAngka) elAngka.textContent = info.rata;
    if (elBintang) elBintang.innerHTML = buatBintangHTML(Math.round(parseFloat(info.rata)));
    if (elTotal) elTotal.textContent = info.total + ' ulasan dari pembeli';

    if (!container) return;

    if (reviewLokal.length === 0) {
        container.innerHTML = '<div class="ulasan-empty"><i class="fas fa-comment-slash"></i><p>Belum ada ulasan atau Firebase belum connect. Jadilah yang pertama, bre!</p></div>';
        return;
    }

    var html = '';
    reviewLokal.forEach(function (r) {
        var inisial = (r.nama || 'A').charAt(0).toUpperCase();
        var avatarContent = r.foto ? '<img src="'+sanitizeHTML(r.foto)+'" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">' : inisial;
        var gradient = getAvatarGradient(r.nama);
        var verifiedBadge = '<span class="ulasan-badge-verified"><i class="fas fa-check-circle"></i> Terverifikasi oleh Google</span>';
        
        html += '<div class="kartu-ulasan">' +
            '<div class="ulasan-header">' +
                '<div class="ulasan-info">' +
                    '<div class="ulasan-avatar" style="background: ' + gradient + ';">' + avatarContent + '</div>' +
                    '<div>' +
                        '<div class="ulasan-nama">' + sanitizeHTML(r.nama) + '</div>' +
                        '<div class="ulasan-bintang">' + buatBintangHTML(r.rating) + '</div>' +
                        verifiedBadge +
                    '</div>' +
                '</div>' +
                '<span class="ulasan-tanggal">' + formatTanggalReview(r.tanggal) + '</span>' +
            '</div>' +
            '<p class="ulasan-teks">' + sanitizeHTML(r.teks) + '</p>' +
        '</div>';
    });
    container.innerHTML = html;
}

// Star rating input handler
var ratingDipilih = 0;

function initStarRating() {
    var stars = document.querySelectorAll('.bintang-klik i');
    if (!stars.length) return;
    stars.forEach(function (star, index) {
        star.addEventListener('click', function () {
            ratingDipilih = index + 1;
            stars.forEach(function (s, i) {
                s.classList.toggle('aktif', i < ratingDipilih);
            });
        });
        star.addEventListener('mouseenter', function () {
            stars.forEach(function (s, i) {
                s.classList.toggle('aktif', i <= index);
            });
        });
        star.addEventListener('mouseleave', function () {
            stars.forEach(function (s, i) {
                s.classList.toggle('aktif', i < ratingDipilih);
            });
        });
    });
}

function kirimUlasan() {
    // Must be logged in via Google
    if (!emailTerlogin) {
        tampilkanToast('Login pakai Google dulu sebelum kirim ulasan, bre! 🔐', 'fa-lock');
        return;
    }

    // Cooldown: 5 minutes
    var lastReview = localStorage.getItem(STORAGE_KEY_COOLDOWN);
    if (lastReview) {
        var diff = Date.now() - parseInt(lastReview);
        if (diff < 300000) {
            tampilkanToast('Tunggu ' + Math.ceil((300000 - diff) / 60000) + ' menit lagi ⏰', 'fa-clock');
            return;
        }
    }

    // Honeypot check
    var hp = document.getElementById('ulasan-website');
    if (hp && hp.value !== '') {
        tampilkanToast('Ulasan berhasil dikirim! ✅', 'fa-check-circle');
        return;
    }

    var teks = document.getElementById('input-teks-ulasan').value.trim();

    if (ratingDipilih === 0) {
        tampilkanToast('Kasih rating bintangnya dulu, bre! ⭐', 'fa-star');
        return;
    }
    if (!teks || teks.length < 10) {
        tampilkanToast('Ulasan minimal 10 karakter ya, bre! 💬', 'fa-exclamation-circle');
        return;
    }
    if (teks.length > 500) {
        tampilkanToast('Ulasan maksimal 500 karakter, bre!', 'fa-exclamation-circle');
        return;
    }
    if (cekSpam(teks)) {
        tampilkanToast('Ulasan terdeteksi spam. Tulis ulasan asli, bre!', 'fa-ban');
        return;
    }

    var ulasanBaru = {
        nama: namaTerlogin || emailTerlogin.split('@')[0],
        email: maskEmail(emailTerlogin),
        foto: fotoTerlogin,
        rating: ratingDipilih,
        teks: teks,
        tanggal: new Date().toISOString(),
        timestamp: typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : Date.now()
    };

    simpanUlasanKeFirestore(ulasanBaru);
    localStorage.setItem(STORAGE_KEY_COOLDOWN, Date.now().toString());

    // Reset form
    document.getElementById('input-teks-ulasan').value = '';
    ratingDipilih = 0;
    document.querySelectorAll('.bintang-klik i').forEach(function (s) { s.classList.remove('aktif'); });
}

// =========================================================================
// 12. FLOATING FRUIT BACKGROUND (optimized)
// =========================================================================
var kontainerBuah = document.getElementById('latar-buah-3d');
var jenisBuah = ['🍎', '🍊', '🍋', '🍇', '🥭', '🍌', '🍉', '🍑'];
var isMobile = window.matchMedia('(max-width: 768px)').matches;
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buatBuahMelayang() {
    if (prefersReducedMotion) return;
    if (kontainerBuah.childElementCount >= (isMobile ? 6 : 12)) return;
    var buah = document.createElement('div');
    buah.classList.add('buah-melayang');
    buah.textContent = jenisBuah[Math.floor(Math.random() * jenisBuah.length)];
    buah.style.left = Math.random() * 90 + 5 + '%';
    buah.style.fontSize = (Math.random() * 1.2 + 1.2).toFixed(1) + 'rem';
    var durasi = Math.random() * 8 + 10;
    buah.style.animationDuration = durasi + 's';
    kontainerBuah.appendChild(buah);
    setTimeout(function () { if (buah.parentNode) buah.remove(); }, durasi * 1000 + 200);
}
setInterval(buatBuahMelayang, isMobile ? 3500 : 2500);

// =========================================================================
// 13. TOAST NOTIFICATION
// =========================================================================
function tampilkanToast(pesan, icon) {
    icon = icon || 'fa-check-circle';
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = '<i class="fas ' + icon + '"></i> ' + pesan;
    container.appendChild(toast);
    setTimeout(function () {
        toast.classList.add('toast-keluar');
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
    }, 2500);
}

// =========================================================================
// 14. SHOPPING CART SYSTEM
// =========================================================================
var isiKeranjang = [];

function bukaTutupKeranjang() {
    var sidebar = document.getElementById('sidebar-keranjang');
    var overlay = document.getElementById('overlay-keranjang');
    var isOpen = !sidebar.classList.contains('keranjang-tertutup');
    if (isOpen) {
        sidebar.classList.add('keranjang-tertutup');
        overlay.classList.remove('aktif');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.remove('keranjang-tertutup');
        overlay.classList.add('aktif');
        document.body.style.overflow = 'hidden';
    }
}

function tambahKeKeranjangBeneran(nama, hargaAsli, diskon, stok, index) {
    var input = document.getElementById('qty-' + index);
    var jumlahKilo = parseInt(input.value) || 1;
    var hargaFinal = hitungHargaDiskon(hargaAsli, diskon);

    if (stok <= 0) {
        tampilkanToast('Maaf bre, stok buah ini habis! 😢', 'fa-times-circle');
        return;
    }
    if (jumlahKilo > stok) {
        tampilkanToast('Stok cuma ' + stok + ' kg, bre! Kurangi jumlahnya.', 'fa-exclamation-circle');
        return;
    }

    var itemSama = null;
    for (var i = 0; i < isiKeranjang.length; i++) {
        if (isiKeranjang[i].nama === nama) { itemSama = isiKeranjang[i]; break; }
    }

    if (itemSama) {
        if (itemSama.jumlah + jumlahKilo > stok) {
            tampilkanToast('Total pesanan melebihi stok (' + stok + ' kg), bre!', 'fa-exclamation-circle');
            return;
        }
        itemSama.jumlah += jumlahKilo;
    } else {
        isiKeranjang.push({ nama: nama, harga: hargaFinal, jumlah: jumlahKilo });
    }

    input.value = 1;
    var tombolMelayang = document.getElementById('tombol-keranjang-melayang');
    tombolMelayang.classList.remove('animasi-notif');
    void tombolMelayang.offsetWidth;
    tombolMelayang.classList.add('animasi-notif');
    setTimeout(function () { tombolMelayang.classList.remove('animasi-notif'); }, 500);

    tampilkanToast(jumlahKilo + ' kg ' + nama + ' ditambahkan! 🛒', 'fa-cart-plus');
    updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
    var wadahList = document.getElementById('list-item-keranjang');
    var notifJumlah = document.getElementById('notif-jumlah-keranjang');
    var teksTotal = document.getElementById('total-harga-keranjang');
    var formPembeli = document.getElementById('area-form-pembeli');

    if (isiKeranjang.length === 0) {
        wadahList.innerHTML = '<div class="keranjang-kosong-wrapper">' +
            '<i class="fas fa-shopping-basket keranjang-kosong-icon"></i>' +
            '<p class="keranjang-kosong">Keranjang masih kosong nih, bre...</p>' +
            '<span class="keranjang-kosong-sub">Yuk pilih buah segar dulu!</span></div>';
        notifJumlah.textContent = '0';
        teksTotal.textContent = 'Rp 0';
        formPembeli.classList.add('form-hidden');
        return;
    }

    formPembeli.classList.remove('form-hidden');
    var htmlItem = '';
    var totalHarga = 0;
    var totalItem = 0;

    isiKeranjang.forEach(function (item, index) {
        var sub = item.harga * item.jumlah;
        totalHarga += sub;
        totalItem += item.jumlah;
        htmlItem += '<div class="item-keranjang">' +
            '<div class="detail-item-keranjang">' +
                '<h4>' + sanitizeHTML(item.nama) + '</h4>' +
                '<span>' + item.jumlah + ' Kg × Rp ' + item.harga.toLocaleString('id-ID') + ' = Rp ' + sub.toLocaleString('id-ID') + '</span>' +
            '</div>' +
            '<button class="tombol-hapus-item" onclick="hapusItemKeranjang(' + index + ')" title="Hapus item">' +
                '<i class="fas fa-trash-alt"></i></button></div>';
    });

    wadahList.innerHTML = htmlItem;
    notifJumlah.textContent = totalItem;
    teksTotal.textContent = 'Rp ' + totalHarga.toLocaleString('id-ID');
}

function hapusItemKeranjang(index) {
    var namaItem = isiKeranjang[index].nama;
    isiKeranjang.splice(index, 1);
    updateTampilanKeranjang();
    tampilkanToast(namaItem + ' dihapus dari keranjang', 'fa-trash-alt');
}

// =========================================================================
// 15. CHECKOUT WHATSAPP — AUTO KIRIM LOKASI + PESAN
// =========================================================================
function checkoutWhatsApp() {
    if (isiKeranjang.length === 0) {
        tampilkanToast('Keranjang masih kosong, pilih buah dulu bre! 🍊', 'fa-exclamation-circle');
        return;
    }

    var nama = document.getElementById('nama-pembeli').value.trim();
    var wa = document.getElementById('wa-pembeli').value.trim();
    var alamat = document.getElementById('alamat-pembeli').value.trim();

    if (!nama || !wa || !alamat) {
        tampilkanToast('Isi Data Verifikasi Pembeli dulu ya bre! ⚠️', 'fa-exclamation-triangle');
        // Scroll ke form
        document.getElementById('area-form-pembeli').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (nama.length < 3) {
        tampilkanToast('Nama minimal 3 karakter, bre!', 'fa-exclamation-circle');
        return;
    }
    if (!validasiNomorWA(wa)) {
        tampilkanToast('Nomor WA tidak valid! Format: 08xxx ⚠️', 'fa-exclamation-triangle');
        return;
    }
    if (alamat.length < 10) {
        tampilkanToast('Alamat terlalu pendek! Tulis lebih detail 📍', 'fa-exclamation-circle');
        return;
    }
    if (cekSpam(nama) || cekSpam(alamat)) {
        tampilkanToast('Data mencurigakan. Isi data asli ya bre!', 'fa-ban');
        return;
    }
    if (!cekCooldownCheckout()) {
        tampilkanToast('Tunggu 1 menit sebelum checkout lagi ⏰', 'fa-clock');
        return;
    }

    localStorage.setItem(CHECKOUT_COOLDOWN_KEY, Date.now().toString());

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  NOMOR WHATSAPP PENJUAL — ganti di sini kalau nomor berubah   ║
    // ╚══════════════════════════════════════════════════════════════════╝
    var nomorWAAnda = '6282284382992';

    tampilkanToast('Mengambil lokasi GPS... 📍', 'fa-map-marker-alt');

    // OTOMATIS ambil lokasi GPS → langsung kirim ke WhatsApp
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var linkMaps = 'https://www.google.com/maps?q=' + pos.coords.latitude + ',' + pos.coords.longitude;
                prosesKirimWA(nomorWAAnda, nama, wa, alamat, linkMaps);
            },
            function () {
                prosesKirimWA(nomorWAAnda, nama, wa, alamat, 'Lokasi GPS tidak tersedia');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        prosesKirimWA(nomorWAAnda, nama, wa, alamat, 'Browser tidak support GPS');
    }
}

function prosesKirimWA(nomorToko, nama, waPembeli, alamat, mapsUrl) {
    var totalHarga = 0;
    isiKeranjang.forEach(function (item) { totalHarga += item.harga * item.jumlah; });

    var orderToken = generateOrderToken();
    var deviceFP = getDeviceFingerprint();
    var kodeValidasi = '#' + isiKeranjang.length + Math.floor(totalHarga / 1000) + '-BR';
    var waktu = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });

    // Format pesan WhatsApp — LANGSUNG KIRIM tanpa perlu edit
    var p = '🛒 *PESANAN BARU — LAPAKBUAH PROBOLINGGO*\n';
    p += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    p += '👤 *Data Pembeli:*\n';
    p += '• Nama: ' + nama + '\n';
    p += '• No. WA: ' + waPembeli + '\n';
    p += '• Alamat: ' + alamat + '\n';
    p += '• 📍 Lokasi: ' + mapsUrl + '\n\n';
    p += '🍊 *Detail Pesanan:*\n';

    isiKeranjang.forEach(function (item, i) {
        var sub = item.harga * item.jumlah;
        p += (i + 1) + '. ' + item.nama + '\n';
        p += '   ' + item.jumlah + ' Kg × Rp ' + item.harga.toLocaleString('id-ID') + ' = *Rp ' + sub.toLocaleString('id-ID') + '*\n';
    });

    p += '\n━━━━━━━━━━━━━━━━━━━━━━\n';
    p += '💰 *TOTAL: Rp ' + totalHarga.toLocaleString('id-ID') + '*\n';
    p += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    p += '🔐 *Keamanan:*\n';
    p += '• Kode: ' + kodeValidasi + '\n';
    p += '• Order: ' + orderToken + '\n';
    p += '• Device: ' + deviceFP + '\n';
    p += '• Waktu: ' + waktu + '\n';

    // Buka WhatsApp dengan pesan yang sudah jadi — pembeli tinggal tekan KIRIM
    var url = 'https://wa.me/' + nomorToko + '?text=' + encodeURIComponent(p);
    window.open(url, '_blank');

    tampilkanToast('WhatsApp terbuka! Tekan Kirim untuk mengirim pesanan 📱', 'fa-check-circle');
}

// =========================================================================
// 16. HALAMAN VARIETAS / KATEGORI — WITH STOK + DISKON + REVIEW
// =========================================================================
function bukaKategori(namaBuah) {
    document.getElementById('halaman-utama-hero').classList.add('tersembunyi');
    document.getElementById('katalog').classList.add('tersembunyi');
    document.getElementById('keunggulan').classList.add('tersembunyi');
    document.getElementById('ulasan').classList.add('tersembunyi');

    var areaVarietas = document.getElementById('halaman-varietas');
    areaVarietas.classList.remove('tersembunyi');

    var kategori = dataKategori[namaBuah];
    var daftarVarietas = kategori.varietas;

    var htmlKonten = '<div class="section-container">' +
        '<button class="tombol-kembali" onclick="kembaliKeUtama()"><i class="fas fa-arrow-left"></i> Kembali ke Katalog</button>' +
        '<p class="section-subtitle"><i class="' + kategori.icon + '"></i> Varietas ' + namaBuah + '</p>' +
        '<h2 class="section-title">Macam-Macam ' + namaBuah + ' Segar</h2>' +
        '<div class="grid-kontainer">';

    daftarVarietas.forEach(function (item, index) {
        var hargaFinal = hitungHargaDiskon(item.harga, item.diskon);
        var habis = item.stok <= 0;
        var sedikit = item.stok > 0 && item.stok <= 10;

        // Stock badge class
        var stokClass = habis ? 'habis' : (sedikit ? 'sedikit' : 'tersedia');
        var stokIcon = habis ? 'times-circle' : (sedikit ? 'exclamation-circle' : 'check-circle');
        var stokText = habis ? 'Stok Habis' : (sedikit ? 'Sisa ' + item.stok + ' kg!' : 'Stok: ' + item.stok + ' kg');

        htmlKonten += '<div class="kartu-buah efek-scroll muncul" style="transition-delay: ' + (index * 0.1) + 's">' +
            '<div class="kartu-buah-inner">' +
                (item.diskon > 0 ? '<div class="badge-diskon">DISKON ' + item.diskon + '%</div>' : '') +
                '<div class="foto-buah ' + kategori.bg + '"><i class="' + kategori.icon + '"></i></div>' +
                '<h3 class="nama-buah">' + sanitizeHTML(item.nama) + '</h3>' +
                '<div class="badge-stok ' + stokClass + '"><i class="fas fa-' + stokIcon + '"></i> ' + stokText + '</div>' +
                '<div class="harga-buah">' +
                    (item.diskon > 0
                        ? '<span class="harga-coret">Rp ' + item.harga.toLocaleString('id-ID') + '</span> <span class="harga-diskon">Rp ' + hargaFinal.toLocaleString('id-ID') + '</span>'
                        : 'Rp ' + item.harga.toLocaleString('id-ID')
                    ) +
                    ' <span class="satuan">/ kg</span>' +
                '</div>' +
                '<div class="pengatur-jumlah">' +
                    '<button class="btn-jumlah" onclick="ubahJumlah(' + index + ', -1)" ' + (habis ? 'disabled' : '') + '>−</button>' +
                    '<input type="number" id="qty-' + index + '" class="input-kiloan" value="1" min="1" max="' + item.stok + '" ' + (habis ? 'disabled' : '') + '>' +
                    '<button class="btn-jumlah" onclick="ubahJumlah(' + index + ', 1)" ' + (habis ? 'disabled' : '') + '>+</button>' +
                '</div>' +
                '<button class="tombol-beli" onclick="tambahKeKeranjangBeneran(\'' + item.nama.replace(/'/g, "\\'") + '\', ' + item.harga + ', ' + item.diskon + ', ' + item.stok + ', ' + index + ')" ' + (habis ? 'disabled' : '') + '>' +
                    '<i class="fas fa-' + (habis ? 'times-circle' : 'cart-plus') + '"></i> ' + (habis ? 'Stok Habis' : 'Masukkan Keranjang') +
                '</button>' +
            '</div>' +
        '</div>';
    });

    htmlKonten += '</div></div>';
    areaVarietas.innerHTML = htmlKonten;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function kembaliKeUtama() {
    document.getElementById('halaman-utama-hero').classList.remove('tersembunyi');
    document.getElementById('katalog').classList.remove('tersembunyi');
    document.getElementById('keunggulan').classList.remove('tersembunyi');
    document.getElementById('ulasan').classList.remove('tersembunyi');
    document.getElementById('halaman-varietas').classList.add('tersembunyi');
    initScrollAnimations();
    window.scrollTo({ top: document.getElementById('katalog').offsetTop - 80, behavior: 'smooth' });
}

function ubahJumlah(index, aksi) {
    var input = document.getElementById('qty-' + index);
    var val = parseInt(input.value) || 1;
    val += aksi;
    if (val < 1) val = 1;
    if (val > 100) val = 100;
    input.value = val;
}

// =========================================================================
// 17. CLOSE MOBILE NAV ON OUTSIDE CLICK
// =========================================================================
document.addEventListener('click', function (e) {
    if (!menuNav.contains(e.target) && !btnToggleNav.contains(e.target)) {
        btnToggleNav.classList.remove('aktif');
        menuNav.classList.remove('buka');
    }
});

// =========================================================================
// 18. KEYBOARD ACCESSIBILITY — ESC to close
// =========================================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        var sidebar = document.getElementById('sidebar-keranjang');
        if (!sidebar.classList.contains('keranjang-tertutup')) bukaTutupKeranjang();
        btnToggleNav.classList.remove('aktif');
        menuNav.classList.remove('buka');
    }
});