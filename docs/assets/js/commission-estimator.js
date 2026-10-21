(() => {
  'use strict';

  const initEstimator = () => {
    const root = document.getElementById('commission-estimator');
    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const $ = (id) => root.querySelector(`#${id}`);
    const packageSelect = $('yw-package');
    const sizeInput = $('yw-size-levels');
    const nightSelect = $('yw-night-mode');
    const objectsInput = $('yw-extra-objects');
    const effectsInput = $('yw-effects');
    const incomeInput = $('yw-income');
    const revisionsInput = $('yw-revisions');
    const fastTrackInput = $('yw-fast-track');
    const bothFeaturesInput = $('yw-both-mode-rotation');
    const customWarning = $('yw-custom-warning');
    const bothFeaturesField = bothFeaturesInput.closest('.yw-estimator__check');
    const totalIdr = $('yw-total-idr');
    const totalUsd = $('yw-total-usd');
    const breakdown = $('yw-price-breakdown');
    const locale = root.dataset.locale === 'id' ? 'id-ID' : 'en-US';

    const idrFormat = new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0
    });
    const usdFormat = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
    });

    const rates = {
      building: { idr: 40000, usd: 5, includedObjects: 1, size: true },
      vehicle: { idr: 35000, usd: 4.25, includedObjects: 2, size: false },
      sizeLevel: { idr: 15000, usd: 0.99 },
      simpleNight: { idr: 5000, usd: 0.99 },
      complexNight: { idr: 15000, usd: 0.99 },
      extraObject: { idr: 30000, usd: 2 },
      effect: { idr: 5000, usd: 0.99 },
      incomeUnit: { idr: 20000, usd: 1.5 },
      revision: { idr: 20000, usd: 2 },
      fastTrack: { idr: 50000, usd: 2.5 }
    };

    const count = (input) => {
      const n = Number.parseInt(input.value, 10);
      if (!Number.isFinite(n)) return 0;
      const max = Number.parseInt(input.max, 10) || 100;
      return Math.min(max, Math.max(0, n));
    };

    const setBreakdown = (parts) => {
      const nonzero = parts.filter((part) => part.idr || part.usd);
      if (locale === 'id-ID') {
        breakdown.textContent = nonzero.length
          ? 'Termasuk: ' + nonzero.map((part) => `${part.label} (${idrFormat.format(part.idr)} / ${usdFormat.format(part.usd)})`).join('; ') + '.'
          : 'Hanya harga paket starter yang dihitung.';
      } else {
        breakdown.textContent = nonzero.length
          ? 'Includes: ' + nonzero.map((part) => `${part.label} (${idrFormat.format(part.idr)} / ${usdFormat.format(part.usd)})`).join('; ') + '.'
          : 'Only the starter package is included in this estimate.';
      }
    };

    const update = () => {
      const selectedPackage = rates[packageSelect.value] || rates.building;
      const sizeLevels = selectedPackage.size ? count(sizeInput) : 0;
      $('yw-size-field').hidden = !selectedPackage.size;
      bothFeaturesField.hidden = !selectedPackage.size;
      customWarning.hidden = !(selectedPackage.size && bothFeaturesInput.checked);
      let idr = selectedPackage.idr;
      let usd = selectedPackage.usd;
      const parts = [];

      const add = (label, rate, qty = 1) => {
        if (!qty) return;
        const idrAmount = rate.idr * qty;
        const usdAmount = rate.usd * qty;
        idr += idrAmount;
        usd += usdAmount;
        parts.push({ label: `${label}${qty > 1 ? ` × ${qty}` : ''}`, idr: idrAmount, usd: usdAmount });
      };

      add(locale === 'id-ID' ? 'Tingkat ukuran tambahan' : 'Additional size levels', rates.sizeLevel, sizeLevels);
      if (nightSelect.value === 'simple') add(locale === 'id-ID' ? 'Mode malam sederhana' : 'Simple night mode', rates.simpleNight);
      if (nightSelect.value === 'complex') add(locale === 'id-ID' ? 'Mode malam kompleks' : 'Complex night mode', rates.complexNight);
      add(locale === 'id-ID' ? 'Objek tambahan' : 'Extra objects', rates.extraObject, count(objectsInput));
      add(locale === 'id-ID' ? 'Tambahan pengaruh 16 petak' : 'Additional 16-tile effect radius', rates.effect, count(effectsInput));
      add(locale === 'id-ID' ? 'Unit penghasilan 100T' : '100T income units', rates.incomeUnit, count(incomeInput));
      add(locale === 'id-ID' ? 'Revisi tambahan' : 'Extra revisions', rates.revision, count(revisionsInput));
      if (fastTrackInput.checked) add(locale === 'id-ID' ? 'Fast Track' : 'Fast Track', rates.fastTrack);

      totalIdr.textContent = idrFormat.format(idr);
      totalUsd.textContent = usdFormat.format(usd);
      setBreakdown(parts);
    };

    root.querySelectorAll('input, select').forEach((input) => {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    });
    update();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEstimator, { once: true });
  } else {
    initEstimator();
  }
})();
