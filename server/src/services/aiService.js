import { featureFlags, env } from "../env.js";
import { log } from "../utils/logger.js";

const buildDashboardComponent = (
  metadata
) => `import React, { useState } from 'react';
import Table from './components/Table';
import Charts from './components/Charts';
import CrudControls from './components/CrudControls';

const initialSheets = ${JSON.stringify(metadata.sheets, null, 2)};
const excelId = ${JSON.stringify(metadata.excelId ?? "")};
const defaultApiBase = process.env.NEXT_PUBLIC_EXODIA_API_BASE ?? "http://localhost:8000/api/v1";

const withRows = (sheet) => ({
  ...sheet,
  rows: sheet.rows ?? [],
  rowCount: sheet.rows?.length ?? sheet.rowCount ?? 0,
});

export default function Dashboard({ apiBaseUrl = defaultApiBase, authToken = "" }) {
  const [sheets, setSheets] = useState(() => initialSheets.map(withRows));

  const handleRowsChange = (sheetName, rows) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.name === sheetName ? { ...sheet, rows, rowCount: rows.length } : sheet
      )
    );
  };

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: 'sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Exodia Dashboard</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Workbook ID: <code>{excelId || 'not set'}</code>
        </p>
        {!authToken && (
          <p style={{ color: '#ca8a04', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Pass an authToken prop so CRUD requests include your JWT.
          </p>
        )}
      </header>

      {sheets.map((sheet) => (
        <section
          key={sheet.name}
          style={{
            marginBottom: '3rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            background: '#fff',
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>{sheet.label}</h2>
              <small style={{ color: '#6b7280' }}>{sheet.name}</small>
            </div>
            <span style={{ color: '#4b5563' }}>{sheet.rows.length} rows</span>
          </header>
          <Table sheet={sheet} />
          <Charts sheet={sheet} />
          <CrudControls
            sheet={sheet}
            excelId={excelId}
            apiBaseUrl={apiBaseUrl}
            authToken={authToken}
            onRowsChange={(rows) => handleRowsChange(sheet.name, rows)}
          />
        </section>
      ))}
    </main>
  );
}
`;

const buildTableComponent = () => `import React from 'react';

export default function Table({ sheet }) {
  if (!sheet.rows || sheet.rows.length === 0) {
    return <p>No data available yet.</p>;
  }

  const columns = sheet.columns;
  const rows = sheet.rows;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name} style={{ textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.rowId}>
            {columns.map((column) => (
              <td key={column.name} style={{ padding: '0.5rem 0' }}>
                {row[column.name] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`;

const buildChartsComponent = () => `import React from 'react';

export default function Charts({ sheet }) {
  return (
    <article style={{ border: '1px dashed #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h3>Auto Charts ({sheet.columns.length})</h3>
      <p>Charts will render here once connected to a charting library.</p>
    </article>
  );
}
`;

const buildCrudControlsComponent =
  () => `import React, { useEffect, useMemo, useState } from 'react';

const normalizeBaseUrl = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const buildFormState = (columns, seed = {}) =>
  columns.reduce((acc, column) => {
    const value = seed[column.name];
    acc[column.name] =
      value === null || value === undefined ? '' : String(value);
    return acc;
  }, {});

const booleanFrom = (raw) => {
  if (typeof raw === 'boolean') {
    return raw;
  }
  return ['true', '1', 'yes', 'on'].includes(String(raw).toLowerCase());
};

const serializePayload = (columns, payload) =>
  columns.reduce((acc, column) => {
    const raw = payload[column.name];
    if (raw === '' || raw === undefined) {
      acc[column.name] = null;
      return acc;
    }

    if (column.type === 'number') {
      const asNumber = Number(raw);
      acc[column.name] = Number.isNaN(asNumber) ? null : asNumber;
      return acc;
    }

    if (column.type === 'boolean') {
      acc[column.name] = booleanFrom(raw);
      return acc;
    }

    acc[column.name] = raw;
    return acc;
  }, {});

const formatRowLabel = (row, columns) => {
  if (!row) {
    return 'Row';
  }
  const previewColumn = columns[0]?.name;
  const previewValue = previewColumn ? row[previewColumn] : null;
  return previewValue ? \`\${row.rowId} • \${previewValue}\` : \`Row \${row.rowId}\`;
};

export default function CrudControls({ sheet, excelId, apiBaseUrl, authToken, onRowsChange }) {
  const [createPayload, setCreatePayload] = useState(() =>
    buildFormState(sheet.columns)
  );
  const [editPayload, setEditPayload] = useState(() =>
    buildFormState(sheet.columns)
  );
  const [selectedRowId, setSelectedRowId] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const rows = sheet.rows ?? [];

  useEffect(() => {
    if (!selectedRowId) {
      return;
    }
    const activeRow = rows.find((row) => String(row.rowId) === selectedRowId);
    if (activeRow) {
      setEditPayload(buildFormState(sheet.columns, activeRow));
    }
  }, [rows, selectedRowId, sheet.columns]);

  const basePath = useMemo(() => {
    if (!excelId) {
      return null;
    }
    const sanitized = normalizeBaseUrl(apiBaseUrl);
    const sheetName = encodeURIComponent(sheet.name);
    return \`\${sanitized}/sheets/\${excelId}/\${sheetName}\`;
  }, [apiBaseUrl, excelId, sheet.name]);

  const disabled = !basePath;

  const request = async (method, suffix = '', body) => {
    if (!basePath) {
      throw new Error('Excel ID is missing, cannot reach the API.');
    }

    const headers = {};
    if (body && method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }
    if (authToken) {
      headers.Authorization = \`Bearer \${authToken}\`;
    }

    const response = await fetch(\`\${basePath}\${suffix}\`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.status !== 'success') {
      throw new Error(payload.message || 'Request failed');
    }

    return {
      rows: payload.data?.rows ?? [],
      message: payload.message ?? 'Request completed',
    };
  };

  const runAction = async (action, task, afterSuccess) => {
    setLoadingAction(action);
    setFeedback(null);
    try {
      const result = await task();
      onRowsChange(result.rows);
      setFeedback({ type: 'success', message: result.message });
      afterSuccess?.();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    await runAction(
      'create',
      () =>
        request(
          'POST',
          '/rows',
          serializePayload(sheet.columns, createPayload)
        ),
      () => setCreatePayload(buildFormState(sheet.columns))
    );
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!selectedRowId) {
      setFeedback({ type: 'error', message: 'Pick a row to update.' });
      return;
    }
    await runAction(
      'update',
      () =>
        request(
          'PUT',
          \`/rows/\${selectedRowId}\`,
          serializePayload(sheet.columns, editPayload)
        ),
      () => {
        setSelectedRowId('');
        setEditPayload(buildFormState(sheet.columns));
      }
    );
  };

  const handleDelete = async () => {
    if (!selectedRowId) {
      setFeedback({ type: 'error', message: 'Pick a row to delete.' });
      return;
    }
    await runAction(
      'delete',
      () => request('DELETE', \`/rows/\${selectedRowId}\`),
      () => {
        setSelectedRowId('');
        setEditPayload(buildFormState(sheet.columns));
      }
    );
  };

  const handleRefresh = async () => {
    await runAction('refresh', () => request('GET'));
  };

  const gridStyle = {
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    marginBottom: '1rem',
  };

  return (
    <div
      style={{
        marginTop: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '1.5rem',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Mutate data</h3>
      <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
        Requests hit {basePath || 'your Exodia API'} using your auth token.
      </p>
      {!authToken && (
        <p style={{ fontSize: '0.85rem', color: '#ca8a04' }}>
          Provide an authToken prop (JWT) so the Authorization header is attached.
        </p>
      )}
      {feedback && (
        <p
          style={{
            color: feedback.type === 'error' ? '#dc2626' : '#16a34a',
            fontSize: '0.9rem',
          }}
        >
          {feedback.message}
        </p>
      )}

      <form onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>Create row</h4>
        <div style={gridStyle}>
          {sheet.columns.map((column) => (
            <label
              key={column.name}
              style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}
            >
              <span style={{ fontWeight: 600 }}>{column.label}</span>
              <input
                type="text"
                value={createPayload[column.name]}
                onChange={(event) =>
                  setCreatePayload((prev) => ({
                    ...prev,
                    [column.name]: event.target.value,
                  }))
                }
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                }}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={disabled || loadingAction === 'create'}
          style={{ padding: '0.5rem 1rem' }}
        >
          {loadingAction === 'create' ? 'Saving…' : 'Create row'}
        </button>
      </form>

      <form onSubmit={handleUpdate} style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>Update row</h4>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ fontWeight: 600 }}>Pick a row</span>
          <select
            value={selectedRowId}
            onChange={(event) => setSelectedRowId(event.target.value)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem',
            }}
          >
            <option value="">Select a row</option>
            {rows.map((row) => (
              <option key={row.rowId} value={row.rowId}>
                {formatRowLabel(row, sheet.columns)}
              </option>
            ))}
          </select>
        </label>
        <div style={gridStyle}>
          {sheet.columns.map((column) => (
            <label
              key={column.name}
              style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}
            >
              <span style={{ fontWeight: 600 }}>{column.label}</span>
              <input
                type="text"
                value={editPayload[column.name]}
                onChange={(event) =>
                  setEditPayload((prev) => ({
                    ...prev,
                    [column.name]: event.target.value,
                  }))
                }
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                }}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={disabled || !selectedRowId || loadingAction === 'update'}
          style={{ padding: '0.5rem 1rem', marginRight: '0.75rem' }}
        >
          {loadingAction === 'update' ? 'Updating…' : 'Update row'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={disabled || !selectedRowId || loadingAction === 'delete'}
          style={{ padding: '0.5rem 1rem' }}
        >
          {loadingAction === 'delete' ? 'Deleting…' : 'Delete row'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={disabled || loadingAction === 'refresh'}
        style={{ padding: '0.5rem 1rem' }}
      >
        {loadingAction === 'refresh' ? 'Refreshing…' : 'Refresh rows'}
      </button>
    </div>
  );
}
`;

const buildReadme = (metadata) => `# Exodia Dashboard

This repository was generated automatically from your Excel upload. It contains a React dashboard (with full CRUD controls) plus a ready-to-run Vite scaffold so you can preview it instantly or embed the main component inside another app.

## Workbook

- Excel ID: \`${metadata.excelId ?? "UNKNOWN"}\`
- Sheets:
${metadata.sheets
  .map((sheet) => `  - ${sheet.label} (${sheet.rowCount} rows)`)
  .join("\n")}

## Repo Layout

- \`package.json\` — Vite + React dependencies and scripts.
- \`index.html\`, \`src/main.jsx\`, \`src/App.jsx\` — local dev entrypoint.
- \`Dashboard.jsx\` + \`components/*\` — the generated dashboard + CRUD widgets.
- \`metadata.json\` — workbook schema snapshot.
- \`.env.example\` — optional API base + auth token overrides.

## Run Locally (Vite)

1. Copy \`.env.example\` to \`.env\` (fill in \`VITE_EXODIA_AUTH_TOKEN\` with a JWT from \`POST /api/v1/auth/login\` if you want CRUD to be authenticated).
2. Install dependencies with \`npm install\`.
3. Start the dev server via \`npm run dev\` (defaults to <http://localhost:5173>).
4. The dashboard reads \`VITE_EXODIA_API_BASE\` (falls back to \`http://localhost:8000/api/v1\`).

## Embedding into Next.js (optional)

1. Copy \`Dashboard.jsx\`, \`components/*\`, and \`metadata.json\` into your Next.js project.
2. Import the component in any route: \`import Dashboard from "./Dashboard";\`
3. Render \`<Dashboard apiBaseUrl={process.env.NEXT_PUBLIC_EXODIA_API_BASE} authToken={token} />\`.

## CRUD controls

Each sheet renders \`components/CrudControls.jsx\`, which talks to the Exodia Sheets API:

- \`POST /api/v1/sheets/:excelId/:sheetName/rows\`
- \`PUT /api/v1/sheets/:excelId/:sheetName/rows/:rowId\`
- \`DELETE /api/v1/sheets/:excelId/:sheetName/rows/:rowId\`
- \`GET /api/v1/sheets/:excelId/:sheetName\`

Successful responses update the in-memory rows so the table stays in sync without a manual refresh.
`;

const buildMetadataJson = (metadata) => JSON.stringify(metadata, null, 2);

const buildPackageJson = () =>
  JSON.stringify(
    {
      name: "exodia-dashboard",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.2.1",
        vite: "^5.4.8",
      },
    },
    null,
    2
  );

const buildEnvExample = () => `VITE_EXODIA_API_BASE=http://localhost:8000/api/v1
VITE_EXODIA_AUTH_TOKEN=
`;

const buildGitignore = () => `node_modules
dist
.env
.DS_Store
`;

const buildViteConfig = () => `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
`;

const buildIndexHtml = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exodia Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

const buildAppComponent = () => `import React from 'react';
import Dashboard from '../Dashboard.jsx';

const apiBaseUrl =
  import.meta.env.VITE_EXODIA_API_BASE ?? 'http://localhost:8000/api/v1';
const authToken = import.meta.env.VITE_EXODIA_AUTH_TOKEN ?? '';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Dashboard apiBaseUrl={apiBaseUrl} authToken={authToken} />
    </div>
  );
}
`;

const buildMainEntry = () => `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

const BASE_INSTRUCTION =
  "Generate React dashboard files for this workbook metadata.";

const sanitizeJsonString = (value) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.startsWith("```")) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return match[1].trim();
    }
  }

  return trimmed;
};

const extractBalancedJson = (raw) => {
  if (!raw) {
    return null;
  }
  const start = raw.indexOf("{");
  if (start === -1) {
    return raw;
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < raw.length; i++) {
    const char = raw[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth++;
      continue;
    }

    if (char === "}") {
      depth--;
      if (depth === 0) {
        return raw.slice(start, i + 1);
      }
    }
  }

  return raw.slice(start);
};

const parseFilesPayload = (raw) => {
  try {
    const cleaned = sanitizeJsonString(raw);
    if (!cleaned) {
      return null;
    }

    const balanced = extractBalancedJson(cleaned);
    const parsed = JSON.parse(balanced);
    if (parsed && typeof parsed.files === "object") {
      return parsed.files;
    }
  } catch (error) {
    log.error("AI response parsing failed", error.message);
  }
  return null;
};

const collectTextSegments = (segments) => {
  if (!Array.isArray(segments)) {
    return [];
  }

  const result = [];

  for (const segment of segments) {
    if (!segment) {
      continue;
    }

    if (typeof segment === "string") {
      result.push(segment);
      continue;
    }

    if (typeof segment.text === "string") {
      result.push(segment.text);
    }

    if (Array.isArray(segment.content)) {
      result.push(...collectTextSegments(segment.content));
    }
  }

  return result;
};

const joinTextSegments = (segments) =>
  segments
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n")
    .trim();

const previewText = (value, length = 400) => {
  if (!value) {
    return "n/a";
  }
  const trimmed = value.trim();
  if (trimmed.length <= length) {
    return trimmed;
  }
  return `${trimmed.slice(0, length)}…`;
};

const extractOpenAiText = (payload) => {
  const choices = Array.isArray(payload?.choices) ? payload.choices : [];

  for (const choice of choices) {
    const content = choice?.message?.content;
    if (content && typeof content === "string") {
      return content.trim();
    }
  }

  return undefined;
};

const extractClaudeText = (payload) =>
  joinTextSegments(collectTextSegments(payload?.content));

const normalizePrompt = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildPromptText = (metadata, prompt) => {
  const sections = [
    'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON shaped as {"files": {"path": "file contents"}} with no Markdown fences.',
    `Task:\n${BASE_INSTRUCTION}`,
  ];

  if (prompt) {
    sections.push(`User guidance:\n${prompt}`);
  }

  sections.push(
    `Workbook metadata (JSON):\n${JSON.stringify(metadata, null, 2)}`
  );

  return sections.join("\n\n");
};

const fromOpenAi = async (metadata, prompt) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON: {"files": {"path": "file contents"}}.',
          },
          {
            role: "user",
            content: buildPromptText(metadata, prompt),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI responded with ${response.status}`);
    }

    const payload = await response.json();
    const text = extractOpenAiText(payload);
    const files = parseFilesPayload(text);
    if (!files) {
      throw new Error(
        `openai_error: empty response (preview: ${previewText(text)})`
      );
    }
    return files;
  } catch (error) {
    log.error("OpenAI generation failed", error);
    throw new Error(
      error?.message?.startsWith("openai_error")
        ? error.message
        : `openai_error: ${error.message}`
    );
  }
};

const fromClaude = async (metadata, prompt) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.CLAUDE_MODEL,
        max_tokens: 16000,
        temperature: 0.2,
        system:
          'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON: {"files": {"path": "file contents"}}.',
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: buildPromptText(metadata, prompt),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude responded with ${response.status}`);
    }

    const payload = await response.json();
    const text = extractClaudeText(payload);
    const files = parseFilesPayload(text);
    if (!files) {
      throw new Error(
        `claude_error: empty response (preview: ${previewText(text)})`
      );
    }
    return files;
  } catch (error) {
    log.error("Claude generation failed", error);
    throw new Error(
      error?.message?.startsWith("claude_error")
        ? error.message
        : `claude_error: ${error.message}`
    );
  }
};

const buildTemplateFiles = (payload) => ({
  "package.json": buildPackageJson(),
  ".env.example": buildEnvExample(),
  ".gitignore": buildGitignore(),
  "vite.config.js": buildViteConfig(),
  "index.html": buildIndexHtml(),
  "src/main.jsx": buildMainEntry(),
  "src/App.jsx": buildAppComponent(),
  "Dashboard.jsx": buildDashboardComponent(payload),
  "components/Table.jsx": buildTableComponent(),
  "components/Charts.jsx": buildChartsComponent(),
  "components/CrudControls.jsx": buildCrudControlsComponent(),
  "metadata.json": buildMetadataJson(payload),
  "README.md": buildReadme(payload),
});

export const aiService = {
  async generateDashboard(metadataWithRows, options = {}) {
    const payload = metadataWithRows;
    const prompt = normalizePrompt(options.prompt);
    let failureReason;

    if (prompt && !featureFlags.aiGeneration) {
      log.warn(
        "Prompt provided for publish but no AI provider configured; using static template"
      );
      failureReason = "missing_generator";
    }

    if (featureFlags.openai) {
      try {
        const files = await fromOpenAi(payload, prompt);
        return { files, source: "openai" };
      } catch (error) {
        failureReason = error.message;
      }
    }

    if (featureFlags.claude) {
      try {
        const files = await fromClaude(payload, prompt);
        return { files, source: "claude" };
      } catch (error) {
        failureReason = error.message;
      }
    }

    const fallbackReason =
      failureReason ??
      (featureFlags.aiGeneration ? "generator_failed" : "missing_generator");

    return {
      files: buildTemplateFiles(payload),
      source: "template",
      reason: fallbackReason,
    };
  },
};
