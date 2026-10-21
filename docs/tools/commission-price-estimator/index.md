---
title: Estimator Harga Komisi
description: Alat perkiraan harga untuk jasa pembuatan plugin TheoTown.
hide:
  - toc
---

# Estimator Harga Komisi

Alat ini menghitung perkiraan berdasarkan harga paket starter dan add-on yang dipublikasikan.

<div class="yw-estimator" id="commission-estimator" data-locale="id">
  <p class="yw-estimator__intro">Pilih paket starter dan fitur tambahan untuk melihat perkiraan awal dalam rupiah dan harga regional USD.</p>
  <div class="yw-estimator__grid">
    <div class="yw-estimator__field">
      <label for="yw-package">Paket starter</label>
      <select id="yw-package">
        <option value="building">Bangunan dasar — Rp40.000 / US$5</option>
        <option value="vehicle">Kendaraan dasar — Rp35.000 / US$4,25</option>
      </select>
    </div>
    <div class="yw-estimator__field" id="yw-size-field">
      <label for="yw-size-levels">Tingkat ukuran tambahan di atas 4×4 (bangunan)</label>
      <input id="yw-size-levels" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-night-mode">Mode malam tambahan / peningkatan</label>
      <select id="yw-night-mode">
        <option value="none">Tidak ada add-on mode malam</option>
        <option value="simple">Mode malam sederhana (+Rp5.000 / US$0,99)</option>
        <option value="complex">Mode malam kompleks (+Rp15.000 / US$0,99)</option>
      </select>
    </div>
    <div class="yw-estimator__field">
      <label for="yw-extra-objects">Objek tambahan di atas batas paket</label>
      <input id="yw-extra-objects" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-effects">Tambahan radius pengaruh (kelipatan 16 petak)</label>
      <input id="yw-effects" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-income">Penghasilan tambahan (jumlah 100T)</label>
      <input id="yw-income" type="number" min="0" max="10000" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-revisions">Revisi tambahan di atas 3 kali</label>
      <input id="yw-revisions" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
<label class="yw-estimator__check" for="yw-both-mode-rotation"><input id="yw-both-mode-rotation" type="checkbox"><span>Memerlukan mode malam <strong>dan</strong> rotasi pada paket bangunan? Biaya tambahan perlu dikonfirmasi (tidak masuk total).</span></label>
    <label class="yw-estimator__check" for="yw-fast-track">
      <input id="yw-fast-track" type="checkbox">
      <span>Tambahkan Fast Track / prioritas (+Rp50.000 / US$2,50)</span>
    </label>
  </div>
  <p class="yw-estimator__note">Paket bangunan sudah mencakup satu pengaruh radius maksimal 16 petak dan mode malam atau rotasi. Paket kendaraan mencakup mode malam dan rotasi. Masukkan hanya add-on yang ingin ditambahkan di luar cakupan paket.</p>
  <p class="yw-estimator__custom-warning" id="yw-custom-warning" hidden>Biaya untuk fitur mode malam dan rotasi sekaligus pada paket bangunan tidak memiliki harga tetap yang dicantumkan; hubungi Yakka Works untuk penawaran manual.</p>
  <div class="yw-estimator__result" aria-live="polite" aria-atomic="true">
    <div>
      <span class="yw-estimator__result-label">Perkiraan dalam rupiah</span>
      <strong id="yw-total-idr">Rp40.000</strong>
    </div>
    <div>
      <span class="yw-estimator__result-label">Perkiraan harga regional USD</span>
      <strong id="yw-total-usd">US$5.00</strong>
    </div>
  </div>
  <p class="yw-estimator__breakdown" id="yw-price-breakdown"></p>
  <p class="yw-estimator__disclaimer">Estimasi tidak mengikat dan belum menilai seluruh kompleksitas, persyaratan, atau revisi khusus. Harga USD mengikuti angka regional yang tercantum, bukan konversi nilai tukar langsung. Harga final harus dikonfirmasi melalui konsultasi.</p>
  <a class="md-button md-button--primary yw-estimator__order" href="../../store/commissions/index.md">Lihat ketentuan dan hubungi untuk memesan</a>
</div>
