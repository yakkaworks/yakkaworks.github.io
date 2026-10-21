---
title: Commission Price Estimator
description: An approximate pricing calculator for TheoTown plugin commissions.
hide:
  - toc
---

# Commission Price Estimator

This tool calculates a starting estimate from the published starter-package and add-on prices.

<div class="yw-estimator" id="commission-estimator" data-locale="en">
  <p class="yw-estimator__intro">Choose a starter package and optional features to see an initial estimate in Indonesian rupiah and regional USD pricing.</p>
  <div class="yw-estimator__grid">
    <div class="yw-estimator__field">
      <label for="yw-package">Starter package</label>
      <select id="yw-package">
        <option value="building">Basic building — Rp40,000 / US$5</option>
        <option value="vehicle">Basic vehicle — Rp35,000 / US$4.25</option>
      </select>
    </div>
    <div class="yw-estimator__field" id="yw-size-field">
      <label for="yw-size-levels">Additional size levels above 4×4 (buildings)</label>
      <input id="yw-size-levels" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-night-mode">Additional / enhanced night mode</label>
      <select id="yw-night-mode">
        <option value="none">No night-mode add-on</option>
        <option value="simple">Simple night mode (+Rp5,000 / US$0.99)</option>
        <option value="complex">Complex night mode (+Rp15,000 / US$0.99)</option>
      </select>
    </div>
    <div class="yw-estimator__field">
      <label for="yw-extra-objects">Extra objects beyond package limit</label>
      <input id="yw-extra-objects" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-effects">Additional effect radius (16-tile increments)</label>
      <input id="yw-effects" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-income">Additional monthly income (number of 100T units)</label>
      <input id="yw-income" type="number" min="0" max="10000" step="1" value="0" inputmode="numeric">
    </div>
    <div class="yw-estimator__field">
      <label for="yw-revisions">Revisions beyond the included 3</label>
      <input id="yw-revisions" type="number" min="0" max="100" step="1" value="0" inputmode="numeric">
    </div>
<label class="yw-estimator__check" for="yw-both-mode-rotation"><input id="yw-both-mode-rotation" type="checkbox"><span>Need both night mode <strong>and</strong> rotation in the building package? The extra fee needs confirmation and is excluded from this total.</span></label>
    <label class="yw-estimator__check" for="yw-fast-track">
      <input id="yw-fast-track" type="checkbox">
      <span>Add Fast Track / priority (+Rp50,000 / US$2.50)</span>
    </label>
  </div>
  <p class="yw-estimator__note">The building package includes one in-game effect with up to a 16-tile radius and night mode or rotation. The vehicle package includes night mode and rotation. Enter only add-ons you want beyond the package inclusions.</p>
  <p class="yw-estimator__custom-warning" id="yw-custom-warning" hidden>There is no published fixed rate for including both night mode and rotation in a building package. Contact Yakka Works for a manual quote.</p>
  <div class="yw-estimator__result" aria-live="polite" aria-atomic="true">
    <div>
      <span class="yw-estimator__result-label">Estimated IDR total</span>
      <strong id="yw-total-idr">Rp40.000</strong>
    </div>
    <div>
      <span class="yw-estimator__result-label">Estimated regional USD total</span>
      <strong id="yw-total-usd">US$5.00</strong>
    </div>
  </div>
  <p class="yw-estimator__breakdown" id="yw-price-breakdown"></p>
  <p class="yw-estimator__disclaimer">This is a non-binding estimate and does not assess all complexity, requirements, or special revisions. USD estimates use the published regional prices, not a direct exchange-rate conversion. Confirm the final quote through consultation.</p>
  <a class="md-button md-button--primary yw-estimator__order" href="../../store/commissions/index.md">Review commission terms and contact Yakka Works</a>
</div>
