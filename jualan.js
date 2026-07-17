// =========================================================================
// TOKO BUAH ONLINE PROBOLINGGO — PREMIUM JAVASCRIPT
// =========================================================================

// =========================================================================
// 1. DATABASE VARIETAS BUAH
// =========================================================================
const dataKategori = {
    'Durian': [
        { nama: 'Durian Montong', harga: 85000, gambar: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop', bg: 'bg-durian' },
        { nama: 'Durian Musang King', harga: 120000, gambar: 'https://images.unsplash.com/photo-1621430045437-0cfc1b0a8803?w=400&auto=format&fit=crop', bg: 'bg-durian' },
        { nama: 'Durian Bawor', harga: 75000, gambar: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop', bg: 'bg-durian' },
        { nama: 'Durian Black Thorn', harga: 150000, gambar: 'https://images.unsplash.com/photo-1621430045437-0cfc1b0a8803?w=400&auto=format&fit=crop', bg: 'bg-durian' },
        { nama: 'Durian Lokal Probolinggo', harga: 50000, gambar: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop', bg: 'bg-durian' }
    ],
    'Manggis': [
        { nama: 'Manggis Super Export', harga: 35000, gambar: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop', bg: 'bg-manggis' },
        { nama: 'Manggis Lokal Manis', harga: 25000, gambar: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop', bg: 'bg-manggis' }
    ],
    'Alpukat': [
        { nama: 'Alpukat Mentega Jumbo', harga: 45000, gambar: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop', bg: 'bg-alpukat' },
        { nama: 'Alpukat Aligator', harga: 35000, gambar: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop', bg: 'bg-alpukat' }
    ],
    'Asem': [
        { nama: 'Asem Jawa Matang', harga: 15000, gambar: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?w=400&auto=format&fit=crop', bg: 'bg-asem' },
        { nama: 'Asem Manis Thailand', harga: 30000, gambar: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?w=400&auto=format&fit=crop', bg: 'bg-asem' }
    ]
};

// =========================================================================
// 2. ANTI-FRAUD & SECURITY SYSTEM
// =========================================================================

// HTML sanitizer — prevent XSS injection
function sanitizeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Spam pattern detector
function cekSpam(teks) {
    var lowerTeks = teks.toLowerCase();
    // Repeated characters (aaaaaaa)
    if (/(.)\1{5,}/.test(teks)) return true;
    // Spam keywords & injection attempts
    var spamWords = ['http://', 'https://', 'www.', '.com/', '.net/', 'click here', 'free money',
        'bitcoin', 'crypto', '<script', 'javascript:', 'onclick', 'onerror', 'eval(', 'document.cookie'];
    for (var i = 0; i < spamWords.length; i++) {
        if (lowerTeks.includes(spamWords[i])) return true;
    }
    // All caps screaming (15+ chars)
    if (teks.length > 15 && teks === teks.toUpperCase() && /[A-Z]/.test(teks)) return true;
    return false;
}

// Phone number validator (Indonesia format)
function validasiNomorWA(nomor) {
    var clean = nomor.replace(/[\s\-]/g, '');
    return /^(0|62)[0-9]{9,13}$/.test(clean);
}

// Generate unique order token
function generateOrderToken() {
    var timestamp = Date.now().toString(36);
    var random = Math.random().toString(36).substring(2, 8);
    return ('LB-' + timestamp + '-' + random).toUpperCase();
}

// Basic device fingerprint for fraud detection
function getDeviceFingerprint() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('LapakBuah', 2, 2);
    var data = canvas.toDataURL();
    var hash = 0;
    for (var i = 0; i < data.length; i++) {
        var char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
}

// Checkout rate limiter
var CHECKOUT_COOLDOWN_KEY = 'lapakbuah_checkout_cooldown';
function cekCooldownCheckout() {
    var last = localStorage.getItem(CHECKOUT_COOLDOWN_KEY);
    if (last) {
        var diff = Date.now() - parseInt(last);
        if (diff < 60000) return false; // 1 minute cooldown
    }
    return true;
}

// =========================================================================
// 3. PRELOADER
// =========================================================================
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    setTimeout(function () {
        preloader.classList.add('selesai');
        initScrollAnimations();
        animasiAngkaStats();
        renderUlasan();
        initStarRating();
    }, 1200);
});

// =========================================================================
// 4. NAVBAR — STICKY + HAMBURGER + SCROLL SPY
// =========================================================================
var navbar = document.getElementById('navbar');
var btnToggleNav = document.getElementById('btn-toggle-nav');
var menuNav = document.getElementById('menu-nav');
var navLinks = document.querySelectorAll('.nav-link');

function handleNavbarScroll() {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
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
                if (link.getAttribute('data-section') === id) {
                    link.classList.add('aktif');
                }
            });
        }
    });
}

// =========================================================================
// 5. BACK TO TOP BUTTON
// =========================================================================
var btnBackToTop = document.getElementById('btn-back-to-top');

function handleBackToTop() {
    if (window.scrollY > 500) {
        btnBackToTop.classList.add('tampil');
    } else {
        btnBackToTop.classList.remove('tampil');
    }
}

// =========================================================================
// 6. UNIFIED SCROLL HANDLER (throttled with rAF)
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
// 7. SCROLL ANIMATIONS — IntersectionObserver
// =========================================================================
function initScrollAnimations() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.classList.add('muncul');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.efek-scroll').forEach(function (el) {
        observer.observe(el);
    });
}

// =========================================================================
// 8. HERO STATS COUNTER ANIMATION
// =========================================================================
function animasiAngkaStats() {
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 1500;
        var startTime = performance.now();

        function updateCounter(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// =========================================================================
// 9. REVIEW & RATING SYSTEM (localStorage-based)
// =========================================================================
var reviewBawaan = [
    { nama: 'Andi Pratama', rating: 5, teks: 'Duriannya gila sih, mantap banget bre! Daging tebal, manis, dan wanginya semerbak. Pasti repeat order lagi!', tanggal: '2026-07-01', verified: true },
    { nama: 'Siti Rahayu', rating: 5, teks: 'Manggisnya superr segar, kulitnya masih mulus. Pengiriman cepat, sampe rumah masih dingin. Recommended!', tanggal: '2026-07-10', verified: true },
    { nama: 'Rizky Maulana', rating: 5, teks: 'Alpukat menteganya juara! Creamy banget, cocok buat jus. Harganya juga ramah kantong mahasiswa 😂', tanggal: '2026-07-14', verified: true }
];

var STORAGE_KEY_REVIEWS = 'lapakbuah_reviews';
var STORAGE_KEY_COOLDOWN = 'lapakbuah_review_cooldown';

function ambilSemuaUlasan() {
    var stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return reviewBawaan.slice();
        }
    }
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviewBawaan));
    return reviewBawaan.slice();
}

function simpanUlasan(ulasanBaru) {
    var semua = ambilSemuaUlasan();
    semua.unshift(ulasanBaru);
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(semua));
}

function hitungRataRating() {
    var semua = ambilSemuaUlasan();
    if (semua.length === 0) return { rata: '0', total: 0 };
    var totalRating = 0;
    semua.forEach(function (r) { totalRating += r.rating; });
    return { rata: (totalRating / semua.length).toFixed(1), total: semua.length };
}

function formatTanggalReview(dateStr) {
    var now = new Date();
    var date = new Date(dateStr);
    var diffMs = now - date;
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return diffDays + ' hari lalu';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' minggu lalu';
    if (diffDays < 365) return Math.floor(diffDays / 30) + ' bulan lalu';
    return Math.floor(diffDays / 365) + ' tahun lalu';
}

function buatBintangHTML(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
        html += i <= rating ? '⭐' : '☆';
    }
    return html;
}

function getAvatarGradient(nama) {
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
    for (var i = 0; i < nama.length; i++) {
        hash = nama.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
}

function renderUlasan() {
    var container = document.getElementById('daftar-ulasan');
    var semua = ambilSemuaUlasan();
    var info = hitungRataRating();

    var elAngka = document.getElementById('angka-rating');
    var elBintang = document.getElementById('bintang-rating-besar');
    var elTotal = document.getElementById('total-ulasan');
    if (elAngka) elAngka.textContent = info.rata;
    if (elBintang) elBintang.innerHTML = buatBintangHTML(Math.round(parseFloat(info.rata)));
    if (elTotal) elTotal.textContent = info.total + ' ulasan dari pembeli';

    if (!container) return;

    if (semua.length === 0) {
        container.innerHTML = '<div class="ulasan-empty"><i class="fas fa-comment-slash"></i><p>Belum ada ulasan. Jadi yang pertama, bre!</p></div>';
        return;
    }

    var html = '';
    semua.forEach(function (r) {
        var inisial = r.nama.charAt(0).toUpperCase();
        var gradient = getAvatarGradient(r.nama);
        var verifiedBadge = r.verified ? '<span class="ulasan-badge-verified"><i class="fas fa-check-circle"></i> Pembeli Terverifikasi</span>' : '';
        html += '<div class="kartu-ulasan">' +
            '<div class="ulasan-header">' +
                '<div class="ulasan-info">' +
                    '<div class="ulasan-avatar" style="background: ' + gradient + ';">' + inisial + '</div>' +
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
                if (i < ratingDipilih) {
                    s.classList.add('aktif');
                } else {
                    s.classList.remove('aktif');
                }
            });
        });

        star.addEventListener('mouseenter', function () {
            stars.forEach(function (s, i) {
                if (i <= index) {
                    s.classList.add('aktif');
                } else {
                    s.classList.remove('aktif');
                }
            });
        });

        star.addEventListener('mouseleave', function () {
            stars.forEach(function (s, i) {
                if (i < ratingDipilih) {
                    s.classList.add('aktif');
                } else {
                    s.classList.remove('aktif');
                }
            });
        });
    });
}

function kirimUlasan() {
    // Anti-spam: cooldown (1 review per 5 minutes)
    var lastReview = localStorage.getItem(STORAGE_KEY_COOLDOWN);
    if (lastReview) {
        var diffMs = Date.now() - parseInt(lastReview);
        var cooldownMs = 5 * 60 * 1000;
        if (diffMs < cooldownMs) {
            var sisaMenit = Math.ceil((cooldownMs - diffMs) / 60000);
            tampilkanToast('Tunggu ' + sisaMenit + ' menit lagi untuk kirim ulasan berikutnya ⏰', 'fa-clock');
            return;
        }
    }

    // Honeypot check (bot trap — real users won't fill this hidden field)
    var honeypot = document.getElementById('ulasan-website');
    if (honeypot && honeypot.value !== '') {
        // Bot detected — fake success, do nothing
        tampilkanToast('Ulasan berhasil dikirim! ✅', 'fa-check-circle');
        return;
    }

    var nama = document.getElementById('input-nama-ulasan').value.trim();
    var teks = document.getElementById('input-teks-ulasan').value.trim();

    // Input validation
    if (!nama) {
        tampilkanToast('Isi nama kamu dulu ya, bre! 📝', 'fa-exclamation-circle');
        return;
    }
    if (nama.length < 3 || nama.length > 50) {
        tampilkanToast('Nama harus 3-50 karakter, bre!', 'fa-exclamation-circle');
        return;
    }
    if (ratingDipilih === 0) {
        tampilkanToast('Kasih rating bintangnya dulu, bre! ⭐', 'fa-star');
        return;
    }
    if (!teks) {
        tampilkanToast('Tulis ulasan kamu dulu ya, bre! 💬', 'fa-exclamation-circle');
        return;
    }
    if (teks.length < 10) {
        tampilkanToast('Ulasan minimal 10 karakter ya, bre!', 'fa-exclamation-circle');
        return;
    }
    if (teks.length > 500) {
        tampilkanToast('Ulasan maksimal 500 karakter, bre!', 'fa-exclamation-circle');
        return;
    }

    // Spam check
    if (cekSpam(teks) || cekSpam(nama)) {
        tampilkanToast('Ulasan terdeteksi spam. Coba lagi dengan ulasan asli, bre!', 'fa-ban');
        return;
    }

    var ulasanBaru = {
        nama: nama,
        rating: ratingDipilih,
        teks: teks,
        tanggal: new Date().toISOString().split('T')[0],
        verified: false
    };

    simpanUlasan(ulasanBaru);

    // Set cooldown
    localStorage.setItem(STORAGE_KEY_COOLDOWN, Date.now().toString());

    // Reset form
    document.getElementById('input-nama-ulasan').value = '';
    document.getElementById('input-teks-ulasan').value = '';
    ratingDipilih = 0;
    document.querySelectorAll('.bintang-klik i').forEach(function (s) { s.classList.remove('aktif'); });

    renderUlasan();
    initScrollAnimations();
    tampilkanToast('Terima kasih atas ulasannya, bre! 🙏', 'fa-check-circle');
}

// =========================================================================
// 10. FLOATING FRUIT BACKGROUND (optimized)
// =========================================================================
var kontainerBuah = document.getElementById('latar-buah-3d');
var jenisBuah = ['🍎', '🍊', '🍋', '🍇', '🥭', '🍌', '🍉', '🍑'];
var isMobile = window.matchMedia('(max-width: 768px)').matches;
var maxBuah = isMobile ? 6 : 12;
var intervalBuah = isMobile ? 3500 : 2500;
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buatBuahMelayang() {
    if (prefersReducedMotion) return;
    if (kontainerBuah.childElementCount >= maxBuah) return;

    var buah = document.createElement('div');
    buah.classList.add('buah-melayang');
    buah.textContent = jenisBuah[Math.floor(Math.random() * jenisBuah.length)];
    buah.style.left = Math.random() * 90 + 5 + '%';
    var ukuran = (Math.random() * 1.2 + 1.2).toFixed(1);
    buah.style.fontSize = ukuran + 'rem';
    var durasi = Math.random() * 8 + 10;
    buah.style.setProperty('--float-duration', durasi + 's');
    buah.style.animationDuration = durasi + 's';

    kontainerBuah.appendChild(buah);

    setTimeout(function () {
        if (buah.parentNode) buah.remove();
    }, durasi * 1000 + 200);
}

setInterval(buatBuahMelayang, intervalBuah);

// =========================================================================
// 11. TOAST NOTIFICATION SYSTEM
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
        setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 2500);
}

// =========================================================================
// 12. SHOPPING CART SYSTEM
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

function tambahKeKeranjangBeneran(nama, harga, index) {
    var input = document.getElementById('qty-' + index);
    var jumlahKilo = parseInt(input.value) || 1;
    var itemSama = null;

    for (var i = 0; i < isiKeranjang.length; i++) {
        if (isiKeranjang[i].nama === nama) {
            itemSama = isiKeranjang[i];
            break;
        }
    }

    if (itemSama) {
        itemSama.jumlah += jumlahKilo;
    } else {
        isiKeranjang.push({ nama: nama, harga: harga, jumlah: jumlahKilo });
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
            '<span class="keranjang-kosong-sub">Yuk pilih buah segar dulu!</span>' +
            '</div>';
        notifJumlah.textContent = '0';
        teksTotal.textContent = 'Rp 0';
        formPembeli.classList.add('form-hidden');
        return;
    }

    formPembeli.classList.remove('form-hidden');

    var htmlItem = '';
    var totalHargaSemua = 0;
    var totalItemBarang = 0;

    isiKeranjang.forEach(function (item, index) {
        var subTotal = item.harga * item.jumlah;
        totalHargaSemua += subTotal;
        totalItemBarang += item.jumlah;

        htmlItem += '<div class="item-keranjang">' +
            '<div class="detail-item-keranjang">' +
                '<h4>' + sanitizeHTML(item.nama) + '</h4>' +
                '<span>' + item.jumlah + ' Kg × Rp ' + item.harga.toLocaleString('id-ID') + ' = Rp ' + subTotal.toLocaleString('id-ID') + '</span>' +
            '</div>' +
            '<button class="tombol-hapus-item" onclick="hapusItemKeranjang(' + index + ')" title="Hapus item">' +
                '<i class="fas fa-trash-alt"></i>' +
            '</button>' +
        '</div>';
    });

    wadahList.innerHTML = htmlItem;
    notifJumlah.textContent = totalItemBarang;
    teksTotal.textContent = 'Rp ' + totalHargaSemua.toLocaleString('id-ID');
}

function hapusItemKeranjang(index) {
    var namaItem = isiKeranjang[index].nama;
    isiKeranjang.splice(index, 1);
    updateTampilanKeranjang();
    tampilkanToast(namaItem + ' dihapus dari keranjang', 'fa-trash-alt');
}

// =========================================================================
// 13. CHECKOUT WHATSAPP — WITH FULL SECURITY
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
        return;
    }

    // Security validations
    if (nama.length < 3 || nama.length > 100) {
        tampilkanToast('Nama harus 3-100 karakter, bre!', 'fa-exclamation-circle');
        return;
    }

    if (!validasiNomorWA(wa)) {
        tampilkanToast('Nomor WA tidak valid! Format: 08xxx atau 628xxx ⚠️', 'fa-exclamation-triangle');
        return;
    }

    if (alamat.length < 10) {
        tampilkanToast('Alamat terlalu pendek! Tulis lebih detail ya bre 📍', 'fa-exclamation-circle');
        return;
    }

    if (cekSpam(nama) || cekSpam(alamat)) {
        tampilkanToast('Data terdeteksi mencurigakan. Isi data asli ya bre!', 'fa-ban');
        return;
    }

    if (!cekCooldownCheckout()) {
        tampilkanToast('Tunggu 1 menit sebelum checkout lagi, bre ⏰', 'fa-clock');
        return;
    }

    // Set cooldown
    localStorage.setItem(CHECKOUT_COOLDOWN_KEY, Date.now().toString());

    var nomorWAAnda = '6282284382992';

    tampilkanToast('Mengambil lokasi GPS untuk keamanan... 📍', 'fa-map-marker-alt');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var linkMaps = 'https://www.google.com/maps?q=' + lat + ',' + lng;
                prosesKirimWA(nomorWAAnda, nama, wa, alamat, linkMaps);
            },
            function () {
                prosesKirimWA(nomorWAAnda, nama, wa, alamat, 'Lokasi GPS tidak tersedia');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        prosesKirimWA(nomorWAAnda, nama, wa, alamat, 'Browser tidak mendukung GPS');
    }
}

function prosesKirimWA(nomorToko, nama, waPembeli, alamatManual, mapsUrl) {
    var totalHargaSemua = 0;
    isiKeranjang.forEach(function (item) {
        totalHargaSemua += item.harga * item.jumlah;
    });

    // Generate security tokens
    var orderToken = generateOrderToken();
    var deviceFP = getDeviceFingerprint();
    var jumlahBarang = isiKeranjang.length;
    var angkaDepanHarga = Math.floor(totalHargaSemua / 1000);
    var kodeValidasi = '#' + jumlahBarang + angkaDepanHarga + '-BR';
    var waktuPesan = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });

    var teksPesan = '🛒 *PESANAN BARU — LAPAKBUAH PROBOLINGGO*\n';
    teksPesan += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    teksPesan += '👤 *Data Pembeli:*\n';
    teksPesan += '• Nama: ' + nama + '\n';
    teksPesan += '• No. WA: ' + waPembeli + '\n';
    teksPesan += '• Alamat: ' + alamatManual + '\n';
    teksPesan += '• 📍 Lokasi: ' + mapsUrl + '\n\n';
    teksPesan += '🍊 *Detail Pesanan:*\n';

    isiKeranjang.forEach(function (item, i) {
        var subTotal = item.harga * item.jumlah;
        teksPesan += (i + 1) + '. ' + item.nama + '\n';
        teksPesan += '   ' + item.jumlah + ' Kg × Rp ' + item.harga.toLocaleString('id-ID') + ' = *Rp ' + subTotal.toLocaleString('id-ID') + '*\n';
    });

    teksPesan += '\n━━━━━━━━━━━━━━━━━━━━━━\n';
    teksPesan += '💰 *TOTAL BAYAR: Rp ' + totalHargaSemua.toLocaleString('id-ID') + '*\n';
    teksPesan += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    teksPesan += '🔐 *Data Keamanan Anti-Penipuan:*\n';
    teksPesan += '• Kode Validasi: ' + kodeValidasi + '\n';
    teksPesan += '• Order ID: ' + orderToken + '\n';
    teksPesan += '• Device ID: ' + deviceFP + '\n';
    teksPesan += '• Waktu Pesan: ' + waktuPesan + '\n';
    teksPesan += '\n_(Data keamanan di atas dibuat otomatis oleh sistem untuk melindungi transaksi)_';

    var urlWhatsApp = 'https://api.whatsapp.com/send?phone=' + nomorToko + '&text=' + encodeURIComponent(teksPesan);
    window.open(urlWhatsApp, '_blank');

    tampilkanToast('Membuka WhatsApp... 📱', 'fa-check-circle');
}

// =========================================================================
// 14. HALAMAN VARIETAS / KATEGORI
// =========================================================================
function bukaKategori(namaBuah) {
    document.getElementById('halaman-utama-hero').classList.add('tersembunyi');
    document.getElementById('katalog').classList.add('tersembunyi');
    document.getElementById('keunggulan').classList.add('tersembunyi');
    document.getElementById('ulasan').classList.add('tersembunyi');

    var areaVarietas = document.getElementById('halaman-varietas');
    areaVarietas.classList.remove('tersembunyi');

    var daftarVarietas = dataKategori[namaBuah];

    var htmlKonten = '<div class="section-container">' +
        '<button class="tombol-kembali" onclick="kembaliKeUtama()"><i class="fas fa-arrow-left"></i> Kembali ke Katalog</button>' +
        '<p class="section-subtitle"><i class="fas fa-lemon"></i> Varietas ' + namaBuah + '</p>' +
        '<h2 class="section-title">Macam-Macam ' + namaBuah + ' Segar</h2>' +
        '<div class="grid-kontainer">';

    daftarVarietas.forEach(function (item, index) {
        htmlKonten += '<div class="kartu-buah efek-scroll muncul" style="transition-delay: ' + (index * 0.1) + 's">' +
            '<div class="kartu-buah-inner">' +
                '<div class="foto-buah ' + item.bg + '">' +
                    '<img src="' + item.gambar + '" alt="' + sanitizeHTML(item.nama) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">' +
                '</div>' +
                '<h3 class="nama-buah">' + sanitizeHTML(item.nama) + '</h3>' +
                '<div class="harga-buah">Rp ' + item.harga.toLocaleString('id-ID') + ' <span class="satuan">/ kg</span></div>' +
                '<div class="pengatur-jumlah">' +
                    '<button class="btn-jumlah" onclick="ubahJumlah(' + index + ', -1)">−</button>' +
                    '<input type="number" id="qty-' + index + '" class="input-kiloan" value="1" min="1">' +
                    '<button class="btn-jumlah" onclick="ubahJumlah(' + index + ', 1)">+</button>' +
                '</div>' +
                '<button class="tombol-beli" onclick="tambahKeKeranjangBeneran(\'' + item.nama + '\', ' + item.harga + ', ' + index + ')">' +
                    '<i class="fas fa-cart-plus"></i> Masukkan Keranjang' +
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
    var nilaiSekarang = parseInt(input.value) || 1;
    nilaiSekarang += aksi;
    if (nilaiSekarang < 1) nilaiSekarang = 1;
    if (nilaiSekarang > 100) nilaiSekarang = 100;
    input.value = nilaiSekarang;
}

// =========================================================================
// 15. CLOSE MOBILE NAV ON OUTSIDE CLICK
// =========================================================================
document.addEventListener('click', function (e) {
    if (!menuNav.contains(e.target) && !btnToggleNav.contains(e.target)) {
        btnToggleNav.classList.remove('aktif');
        menuNav.classList.remove('buka');
    }
});

// =========================================================================
// 16. KEYBOARD ACCESSIBILITY — ESC to close
// =========================================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        var sidebar = document.getElementById('sidebar-keranjang');
        if (!sidebar.classList.contains('keranjang-tertutup')) {
            bukaTutupKeranjang();
        }
        btnToggleNav.classList.remove('aktif');
        menuNav.classList.remove('buka');
    }
});