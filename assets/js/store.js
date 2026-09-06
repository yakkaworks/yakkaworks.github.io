/**
 * Yakka Works — Store Page Logic
 *
 * Loads domain manifest -> loads each domain's JSON file -> renders,
 * filters, and searches content cards.
 *
 * Domain = derived from which JSON file an item came from (via manifest).
 * Category = derived from each item's own "category" array.
 *
 * Depends on: assets/js/path-utils.js (window.YakkaPaths)
 */
(function () {
  'use strict';

  var P = window.YakkaPaths;
  if (!P) {
    console.error('YakkaPaths not found — ensure path-utils.js loads before store.js');
    return;
  }

  var MANIFEST_URL = P.asset('webdata/json/manifest.json');

  var state = {
    allItems: [],       // flattened: every item, tagged with its domain label
    domains: [],         // [{ file, label }]
    selectedDomain: null,
    selectedCategory: 'all',
    searchQuery: ''
  };

  var el = {};

  function cacheElements() {
    el.searchInput = document.getElementById('store-search-input');
    el.searchForm = document.getElementById('store-search-form');
    el.domainSelect = document.getElementById('store-domain-select');
    el.categorySelect = document.getElementById('store-category-select');
    el.grid = document.getElementById('store-grid');
    el.status = document.getElementById('store-status');
  }

  function setStatus(message, isError) {
    if (!el.status) return;
    el.status.textContent = message || '';
    el.status.classList.toggle('text-danger', !!isError);
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to load ' + url + ' (' + res.status + ')');
      }
      return res.json();
    });
  }

  function loadAllData() {
    setStatus('Loading catalogue…', false);

    return fetchJson(MANIFEST_URL)
      .then(function (manifest) {
        if (!manifest || !Array.isArray(manifest.domains) || manifest.domains.length === 0) {
          throw new Error('Manifest contains no domains.');
        }
        state.domains = manifest.domains;

        var loaders = state.domains.map(function (domain) {
          var fileUrl = P.asset('webdata/json/' + domain.file);
          return fetchJson(fileUrl)
            .then(function (items) {
              if (!Array.isArray(items)) return [];
              return items.map(function (item) {
                item._domain = domain.label;
                item._categories = Array.isArray(item.category) ? item.category : [];
                return item;
              });
            })
            .catch(function (err) {
              console.error('Failed to load domain file:', domain.file, err);
              return []; // one bad domain file shouldn't break the whole page
            });
        });

        return Promise.all(loaders);
      })
      .then(function (results) {
        state.allItems = results.flat();
        state.selectedDomain = state.domains.length > 0 ? state.domains[0].label : null;
        setStatus('', false);
      });
  }

  function populateDomainSelect() {
    if (!el.domainSelect) return;
    el.domainSelect.innerHTML = state.domains.map(function (domain) {
      return '<option value="' + escapeHtml(domain.label) + '">' + escapeHtml(domain.label) + '</option>';
    }).join('');
    el.domainSelect.value = state.selectedDomain;
  }

  function getCategoriesForDomain(domainLabel) {
    var set = new Set();
    state.allItems.forEach(function (item) {
      if (item._domain === domainLabel) {
        item._categories.forEach(function (cat) { set.add(cat); });
      }
    });
    return Array.from(set).sort(function (a, b) { return a.localeCompare(b); });
  }

  function populateCategorySelect() {
    if (!el.categorySelect) return;
    var categories = getCategoriesForDomain(state.selectedDomain);

    var options = ['<option value="all">All categories</option>'];
    categories.forEach(function (cat) {
      options.push('<option value="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</option>');
    });

    el.categorySelect.innerHTML = options.join('');
    state.selectedCategory = 'all';
    el.categorySelect.value = 'all';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
  }

  function matchesSearch(item, query) {
    if (!query) return true;
    var haystack = [
      item.title,
      item.Description,
      item.slug,
      item._domain
    ].concat(item._categories).join(' ').toLowerCase();
    return haystack.indexOf(query.toLowerCase()) !== -1;
  }

  function getFilteredItems() {
    return state.allItems.filter(function (item) {
      if (item._domain !== state.selectedDomain) return false;
      if (state.selectedCategory !== 'all' && item._categories.indexOf(state.selectedCategory) === -1) return false;
      if (!matchesSearch(item, state.searchQuery)) return false;
      return true;
    });
  }

  function buildCard(item) {
    var thumb = item.Thumbnails
      ? '<img src="' + P.asset(item.Thumbnails) + '" class="card-img-top" alt="' + escapeHtml(item.title) + ' thumbnail" onerror="this.onerror=null;this.src=&quot;' + P.asset('assets/img/placeholder.jpg') + '&quot;;">'
      : '<img src="' + P.asset('assets/img/placeholder.jpg') + '" class="card-img-top" alt="' + escapeHtml(item.title) + ' thumbnail">';

    var downloadUrl = item.urls && item.urls.download ? item.urls.download : null;
    var detailsUrl = item.urls && item.urls.Details ? P.asset(item.urls.Details) : null;

    return (
      '<div class="col">' +
        '<div class="card h-100 border yk-store-card">' +
          thumb +
          '<div class="card-body d-flex flex-column">' +
            '<h3 class="h6 card-title mb-1">' + escapeHtml(item.title) + '</h3>' +
            '<p class="yk-card-meta small text-secondary mb-2">' +
              escapeHtml(item.Version || '—') + ' • ' + escapeHtml(item.Date || '—') +
            '</p>' +
            '<p class="card-text small yk-card-desc">' + escapeHtml(item.Description) + '</p>' +

            '<div class="yk-card-secondary small mb-3 mt-auto">' +
              '<a href="' + P.page('store/installation.html') + '" class="text-secondary me-3">' +
                '<i class="bi bi-info-circle me-1" aria-hidden="true"></i>How to install' +
              '</a>' +
              '<a href="' + P.page('store/commission.html') + '" class="text-secondary">' +
                '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Customize this' +
              '</a>' +
            '</div>' +

            '<div class="d-flex gap-2">' +
              (downloadUrl
                ? '<a href="' + downloadUrl + '" class="btn btn-primary btn-sm flex-grow-1">' +
                    '<i class="bi bi-download me-1" aria-hidden="true"></i>Download latest' +
                  '</a>'
                : '<span class="btn btn-primary btn-sm flex-grow-1 disabled">Unavailable</span>') +
              (detailsUrl
                ? '<a href="' + detailsUrl + '" class="btn btn-outline-secondary btn-sm">Details</a>'
                : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function render() {
    if (!el.grid) return;

    var items = getFilteredItems();

    if (items.length === 0) {
      el.grid.innerHTML = '';
      setStatus('No content matches your search or filters.', false);
      return;
    }

    setStatus('', false);
    el.grid.innerHTML = items.map(buildCard).join('');
  }

  function handleDomainChange() {
    state.selectedDomain = el.domainSelect.value;
    populateCategorySelect();
    render();
  }

  function handleCategoryChange() {
    state.selectedCategory = el.categorySelect.value;
    render();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    state.searchQuery = el.searchInput.value.trim();
    render();
  }

  function bindEvents() {
    if (el.domainSelect) el.domainSelect.addEventListener('change', handleDomainChange);
    if (el.categorySelect) el.categorySelect.addEventListener('change', handleCategoryChange);
    if (el.searchForm) el.searchForm.addEventListener('submit', handleSearchSubmit);
  }

  function init() {
    cacheElements();
    bindEvents();

    loadAllData()
      .then(function () {
        populateDomainSelect();
        populateCategorySelect();
        render();
      })
      .catch(function (err) {
        console.error(err);
        setStatus('Unable to load the catalogue right now. Please try again later.', true);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
