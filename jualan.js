// =========================================================================
// 1. DATABASE DATA VARIETAS BUAH (Pakai Gambar Otomatis & Estetik dari Unsplash)
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
// 2. SISTEM KERANJANG BELANJA & INTEGRASI FORM VERIFIKASI ANTI-PENIPUAN
// =========================================================================
let isiKeranjang = [];

function bukaTutupKeranjang() {
    const sidebar = document.getElementById('sidebar-keranjang');
    sidebar.classList.toggle('keranjang-tertutup');
}

function tambahKeKeranjangBeneran(nama, harga, index) {
    const jumlahKilo = parseInt(document.getElementById(`qty-${index}`).value) || 1;
    const itemSama = isiKeranjang.find(item => item.nama === nama);
    
    if (itemSama) {
        itemSama.jumlah += jumlahKilo;
    } else {
        isiKeranjang.push({ nama: nama, harga: harga, jumlah: jumlahKilo });
    }
    
    document.getElementById(`qty-${index}`).value = 1;

    // Efek Animasi Memantul di Tombol Keranjang Melayang
    const tombolMelayang = document.getElementById('tombol-keranjang-melayang');
    tombolMelayang.classList.add('animasi-notif');
    setTimeout(() => { tombolMelayang.classList.remove('animasi-notif'); }, 400);

    updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
    const wadahList = document.getElementById('list-item-keranjang');
    const notifJumlah = document.getElementById('notif-jumlah-keranjang');
    const teksTotal = document.getElementById('total-harga-keranjang');
    const formPembeli = document.getElementById('area-form-pembeli');
    
    if (isiKeranjang.length === 0) {
        wadahList.innerHTML = '<p class="keranjang-kosong">Keranjang masih kosong nih, bre...</p>';
        notifJumlah.innerText = '0';
        teksTotal.innerText = 'Rp 0';
        formPembeli.classList.add('form-hidden');
        return;
    }
    
    formPembeli.classList.remove('form-hidden');
    
    let htmlItem = '';
    let totalHargaSemua = 0;
    let totalItemBarang = 0;
    
    isiKeranjang.forEach((item, index) => {
        const subTotal = item.harga * item.jumlah;
        totalHargaSemua += subTotal;
        totalItemBarang += item.jumlah;
        
        htmlItem += `
            <div class="item-keranjang">
                <div class="detail-item-keranjang">
                    <h4>${item.nama}</h4>
                    <span>${item.jumlah} Kg x Rp ${item.harga.toLocaleString('id-ID')}</span>
                </div>
                <button class="tombol-hapus-item" onclick="hapusItemKeranjang(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
    
    wadahList.innerHTML = htmlItem;
    notifJumlah.innerText = totalItemBarang;
    teksTotal.innerText = `Rp ${totalHargaSemua.toLocaleString('id-ID')}`;
}

function hapusItemKeranjang(index) {
    isiKeranjang.splice(index, 1);
    updateTampilanKeranjang();
}

function checkoutWhatsApp() {
    if (isiKeranjang.length === 0) {
        alert("Keranjang lu masih kosong, pilih buahnya dulu bre!");
        return;
    }
    
    const nama = document.getElementById('nama-pembeli').value.trim();
    const wa = document.getElementById('wa-pembeli').value.trim();
    const alamat = document.getElementById('alamat-pembeli').value.trim();
    
    if (!nama || !wa || !alamat) {
        alert("⚠️ Waduh bre, isi Data Verifikasi Pembeli dulu dengan lengkap ya biar aman dari penipuan!");
        return;
    }
    
    // GANTI DENGAN NOMOR WA LU (Wajib pakai kode negara 62 di depan)
    const nomorWAAnda = "6282284382992"; 
    
    let pesan = `*🚨 NOTIFIKASI ORDER BARU (VALIDASI SYSTEM)*\n\n`;
    pesan += `👤 *Data Pembeli:* \n`;
    pesan += `• Nama: ${nama}\n`;
    pesan += `• No. WA Input: ${wa}\n`;
    pesan += `• Alamat Kirim: ${alamat}\n\n`;
    pesan += `===============================\n`;
    pesan += `🛒 *Daftar Pesanan Buah:* \n`;
    
    let totalAkhir = 0;
    isiKeranjang.forEach((item) => {
        const subTotal = item.harga * item.jumlah;
        totalAkhir += subTotal;
        pesan += `📦 *${item.nama}* : ${item.jumlah} Kg (Rp ${subTotal.toLocaleString('id-ID')})\n`;
    });
    
    pesan += `===============================\n`;
    pesan += `💰 *Total Akhir:* Rp ${totalAkhir.toLocaleString('id-ID')}\n\n`;
    pesan += `*Catatan:* Jika nomor pengirim berbeda dengan No. WA Input di atas, mohon waspada penipuan!`;
    
    const urlWA = `https://api.whatsapp.com/send?phone=${nomorWAAnda}&text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}

// =========================================================================
// 3. FUNGSI LOGIKA HALAMAN VARIETAS, OPTIMASI SCROLL, & ANIMASI
// =========================================================================
let timerScroll;
function cekScrollOptimasi() {
    clearTimeout(timerScroll);
    timerScroll = setTimeout(() => {
        const semuaElemenAnimasi = document.querySelectorAll('.efek-scroll:not(.tersembunyi), .kartu-sosmed');
        const batasPemicu = (window.innerHeight / 5) * 4.5;

        semuaElemenAnimasi.forEach((elemen, index) => {
            const jarakAtasElemen = elemen.getBoundingClientRect().top;
            if (jarakAtasElemen < batasPemicu) {
                setTimeout(() => {
                    elemen.classList.add('muncul');
                    if(elemen.classList.contains('kartu-sosmed')){
                        elemen.style.opacity = "1";
                        elemen.style.transform = "translateY(0)";
                    }
                }, index * 50);
            }
        });
    }, 10);
}
window.addEventListener('scroll', cekScrollOptimasi);

function bukaKategori(namaBuah) {
    document.getElementById('halaman-utama-hero').classList.add('tersembunyi');
    document.getElementById('katalog').classList.add('tersembunyi');
    
    const areaVarietas = document.getElementById('halaman-varietas');
    areaVarietas.classList.remove('tersembunyi');
    
    const daftarVarietas = dataKategori[namaBuah];
    
    let htmlKonten = `
        <button class="tombol-kembali" onclick="kembaliKeUtama()"><i class="fas fa-arrow-left"></i> Kembali ke Katalog</button>
        <h2>Macam-Macam Varietas ${namaBuah} Segar</h2>
        <div class="grid-kontainer">
    `;
    
    daftarVarietas.forEach((item, index) => {
        htmlKonten += `
            <div class="kartu-buah" style="opacity:1; transform:none;">
                <div class="foto-buah ${item.bg}">
                    <img src="${item.gambar}" alt="${item.nama}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
                </div>
                <h3 class="nama-buah">${item.nama}</h3>
                <div class="harga-buah">Rp ${item.harga.toLocaleString('id-ID')} / kg</div>
                
                <div class="pengatur-jumlah">
                    <button class="btn-jumlah" onclick="ubahJumlah(${index}, -1)">-</button>
                    <input type="number" id="qty-${index}" class="input-kiloan" value="1" min="1">
                    <button class="btn-jumlah" onclick="ubahJumlah(${index}, 1)">+</button>
                </div>

                <button class="tombol-beli" onclick="tambahKeKeranjangBeneran('${item.nama}', ${item.harga}, ${index})">
                    <i class="fas fa-cart-plus"></i> Masukkan Keranjang
                </button>
            </div>
        `;
    });
    
    htmlKonten += `</div>`;
    areaVarietas.innerHTML = htmlKonten;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function kembaliKeUtama() {
    document.getElementById('halaman-utama-hero').classList.remove('tersembunyi');
    document.getElementById('katalog').classList.remove('tersembunyi');
    document.getElementById('halaman-varietas').classList.add('tersembunyi');
    cekScrollOptimasi();
}

function ubahJumlah(index, aksi) {
    const input = document.getElementById(`qty-${index}`);
    let nilaiSekarang = parseInt(input.value) || 1;
    nilaiSekarang += aksi;
    if (nilaiSekarang < 1) nilaiSekarang = 1;
    input.value = nilaiSekarang;
}

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => { 
        preloader.classList.add('selesai'); 
        cekScrollOptimasi();
    }, 800); 
});

const kontainerBuah = document.getElementById('latar-buah-3d');
const jenisBuah = ['🫓', '🔮', '🥑', '🫛'];

function buatBuahMelayang() {
    if (kontainerBuah.childElementCount > 15) return;
    const buah = document.createElement('div');
    buah.classList.add('buah-melayang');
    buah.innerText = jenisBuah[Math.floor(Math.random() * jenisBuah.length)];
    buah.style.left = Math.random() * 95 + 'vw';
    const ukuranAcak = Math.random() * (3 - 1.5) + 1.5;
    buah.style.fontSize = ukuranAcak + 'rem';
    const durasiAcak = Math.random() * (15 - 8) + 8;
    buah.style.animationDuration = durasiAcak + 's';
    kontainerBuah.appendChild(buah);
    setTimeout(() => { buah.remove(); }, durasiAcak * 1000);
}
setInterval(buatBuahMelayang, 2000);