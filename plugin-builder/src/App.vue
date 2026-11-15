<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { applyEdits, modify, parse, type ParseError } from 'jsonc-parser';
import starterTemplate from './templates/residential.jsonc?raw';

type FieldMeta = {
  label?: string;
  description?: string;
  tab?: string;
  type?: 'string' | 'number' | 'boolean';
  min?: number;
  max?: number;
  options?: unknown[];
};

type Field = {
  key: string;
  value: unknown;
  meta: FieldMeta;
};

const source = ref(starterTemplate);
const parsedValue = ref<Record<string, unknown>>({});
const parseErrors = ref<ParseError[]>([]);
const activeTab = ref('General');
const sourceVisible = ref(false);
const copiedStatus = ref('');
const metadata = ref<Record<string, FieldMeta>>({});
const tabs = ['General', 'Appearance', 'Gameplay', 'Advanced'];

function parseDirectiveValue(raw: string): unknown {
  const value = raw.trim();
  try {
    return JSON.parse(value);
  } catch {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const number = Number(value);
    return value !== '' && Number.isFinite(number) ? number : value;
  }
}

// Beta metadata format: contiguous @studio comment lines immediately above a property.
function readMetadata(text: string): Record<string, FieldMeta> {
  const lines = text.split(/\r?\n/);
  const result: Record<string, FieldMeta> = {};

  lines.forEach((line, index) => {
    const property = line.match(/^\s*"([^"]+)"\s*:/);
    if (!property) return;

    const directives: Record<string, unknown> = {};
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      const previous = lines[cursor];
      if (previous.trim() === '') break;
      const directive = previous.match(/^\s*\/\/\s*@studio\.([\w-]+)\s+(.+?)\s*$/);
      if (!directive) break;
      directives[directive[1]] = parseDirectiveValue(directive[2]);
    }

    result[property[1]] = {
      label: typeof directives.label === 'string' ? directives.label : undefined,
      description: typeof directives.description === 'string' ? directives.description : undefined,
      tab: typeof directives.tab === 'string' ? directives.tab : undefined,
      type: ['string', 'number', 'boolean'].includes(String(directives.type))
        ? directives.type as FieldMeta['type']
        : undefined,
      min: typeof directives.min === 'number' ? directives.min : undefined,
      max: typeof directives.max === 'number' ? directives.max : undefined,
      options: Array.isArray(directives.options) ? directives.options : undefined,
    };
  });

  return result;
}

function refreshDocument(text: string) {
  const errors: ParseError[] = [];
  const value = parse(text, errors, { allowTrailingComma: true, disallowComments: false });
  parseErrors.value = errors;
  metadata.value = readMetadata(text);

  if (errors.length === 0 && value && typeof value === 'object' && !Array.isArray(value)) {
    parsedValue.value = value as Record<string, unknown>;
  }
}

refreshDocument(source.value);

const fields = computed<Field[]>(() => Object.entries(parsedValue.value).map(([key, value]) => ({
  key,
  value,
  meta: metadata.value[key] ?? {},
})));

const visibleTabs = computed(() => {
  const found = new Set(fields.value.map((field) => field.meta.tab ?? 'General'));
  return tabs.filter((tab) => found.has(tab));
});

const activeFields = computed(() => fields.value.filter(
  (field) => (field.meta.tab ?? 'General') === activeTab.value,
));

const hasErrors = computed(() => parseErrors.value.length > 0);

function updateField(key: string, value: unknown) {
  const edits = modify(source.value, [key], value, {
    formattingOptions: { insertSpaces: true, tabSize: 2, eol: '\n' },
  });
  source.value = applyEdits(source.value, edits);
  refreshDocument(source.value);
}

function onSourceInput() {
  refreshDocument(source.value);
}

function exportJson() {
  if (hasErrors.value) return;
  const json = JSON.stringify(parsedValue.value, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'theotown-plugin-config.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function resetTemplate() {
  source.value = starterTemplate;
  refreshDocument(source.value);
  activeTab.value = 'General';
}

async function copySource() {
  try {
    await navigator.clipboard.writeText(source.value);
    copiedStatus.value = 'Copied';
    window.setTimeout(() => (copiedStatus.value = ''), 1600);
  } catch {
    copiedStatus.value = 'Clipboard unavailable';
  }
}

watch(visibleTabs, (nextTabs) => {
  if (!nextTabs.includes(activeTab.value)) activeTab.value = nextTabs[0] ?? 'General';
});
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Yakka Works home">
        <span class="brand-mark">Y</span>
        <span>Yakka <strong>Works</strong></span>
      </a>
      <div class="topbar-right">
        <span class="beta-tag">LOCAL BETA</span>
        <span class="topbar-caption">TheoTown Plugin Builder</span>
      </div>
    </header>

    <main class="workspace">
      <section class="page-heading">
        <div>
          <p class="eyebrow">THETOWN CREATOR TOOLS</p>
          <h1>Plugin Builder <span class="version">0.1</span></h1>
          <p class="intro">Configure a building with familiar settings. The source stays in sync in the background.</p>
        </div>
        <div class="heading-actions">
          <button class="button button-quiet" type="button" @click="resetTemplate">Reset demo</button>
          <button class="button button-primary" type="button" :disabled="hasErrors" @click="exportJson">
            <span aria-hidden="true">↓</span> Export JSON
          </button>
        </div>
      </section>

      <div class="notice">
        <span class="notice-icon" aria-hidden="true">i</span>
        <p><strong>Prototype template:</strong> this starter uses illustrative property names, not a verified TheoTown plugin format. We're testing the editor experience first.</p>
      </div>

      <section class="editor-panel">
        <div class="project-bar">
          <div class="project-symbol" aria-hidden="true">⌂</div>
          <div class="project-details">
            <strong>{{ typeof parsedValue.name === 'string' ? parsedValue.name : 'Untitled building' }}</strong>
            <span>Residential building · Demo project</span>
          </div>
          <div class="project-state">
            <span class="state-dot" :class="{ 'state-error': hasErrors }"></span>
            {{ hasErrors ? 'Invalid source' : 'All changes up to date' }}
          </div>
        </div>

        <div class="tabs" role="tablist" aria-label="Building settings">
          <button
            v-for="tab in visibleTabs"
            :key="tab"
            class="tab"
            :class="{ 'tab-active': activeTab === tab }"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab"
            @click="activeTab = tab"
          >{{ tab }}</button>
        </div>

        <div v-if="!hasErrors" class="form-content">
          <div class="section-heading">
            <div>
              <h2>{{ activeTab }} settings</h2>
              <p>Adjust the values below. Changes are reflected in the project source.</p>
            </div>
            <span class="field-count">{{ activeFields.length }} {{ activeFields.length === 1 ? 'setting' : 'settings' }}</span>
          </div>

          <div class="fields-grid">
            <div v-for="field in activeFields" :key="field.key" class="field">
              <label :for="'field-' + field.key">{{ field.meta.label ?? field.key }}</label>
              <p v-if="field.meta.description" class="field-description">{{ field.meta.description }}</p>

              <select
                v-if="field.meta.options"
                :id="'field-' + field.key"
                class="control"
                :value="String(field.value)"
                @change="updateField(field.key, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="option in field.meta.options" :key="String(option)" :value="String(option)">{{ option }}</option>
              </select>

              <label v-else-if="field.meta.type === 'boolean' || typeof field.value === 'boolean'" class="toggle-row" :for="'field-' + field.key">
                <input
                  :id="'field-' + field.key"
                  type="checkbox"
                  :checked="Boolean(field.value)"
                  @change="updateField(field.key, ($event.target as HTMLInputElement).checked)"
                />
                <span class="toggle-track"></span>
                <span class="toggle-value">{{ field.value ? 'Enabled' : 'Disabled' }}</span>
              </label>

              <input
                v-else-if="field.meta.type === 'number' || typeof field.value === 'number'"
                :id="'field-' + field.key"
                class="control"
                type="number"
                :min="field.meta.min"
                :max="field.meta.max"
                :value="Number(field.value)"
                @change="updateField(field.key, Number(($event.target as HTMLInputElement).value))"
              />

              <textarea
                v-else-if="field.key === 'description'"
                :id="'field-' + field.key"
                class="control textarea"
                rows="3"
                :value="String(field.value ?? '')"
                @change="updateField(field.key, ($event.target as HTMLTextAreaElement).value)"
              ></textarea>

              <input
                v-else
                :id="'field-' + field.key"
                class="control"
                type="text"
                :value="String(field.value ?? '')"
                @change="updateField(field.key, ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>

          <div v-if="activeFields.length === 0" class="empty-state">There are no settings in this section yet.</div>
        </div>

        <div v-else class="error-state">
          <div class="error-symbol">!</div>
          <div>
            <h2>There's a problem with the source</h2>
            <p>Fix the JSONC syntax below to continue editing and exporting.</p>
            <ul>
              <li v-for="(error, index) in parseErrors" :key="index">
                {{ error.error }} at offset {{ error.offset }}
              </li>
            </ul>
          </div>
        </div>

        <div class="panel-footer">
          <button class="source-toggle" type="button" :aria-expanded="sourceVisible" @click="sourceVisible = !sourceVisible">
            <span class="chevron" :class="{ 'chevron-open': sourceVisible }">›</span>
            {{ sourceVisible ? 'Hide' : 'View' }} JSONC source
          </button>
          <span class="footer-hint">Your edits stay in this browser session.</span>
        </div>

        <div v-if="sourceVisible" class="source-area">
          <div class="source-toolbar">
            <span>residential.jsonc</span>
            <button class="copy-button" type="button" @click="copySource">{{ copiedStatus || 'Copy source' }}</button>
          </div>
          <textarea v-model="source" class="source-editor" spellcheck="false" aria-label="JSONC source" @input="onSourceInput"></textarea>
          <p class="source-help">Metadata comments beginning with <code>@studio</code> control labels, descriptions, tabs and input types.</p>
        </div>
      </section>

      <footer class="page-footer">
        <span>Yakka Works <span class="footer-separator">/</span> Experimental tool</span>
        <span>Nothing is uploaded or saved remotely.</span>
      </footer>
    </main>
  </div>
</template>