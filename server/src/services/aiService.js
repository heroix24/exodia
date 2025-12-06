import { featureFlags, env } from "../env.js";
import { log } from "../utils/logger.js";
import { getThemePalette, normalizeTheme } from "../utils/themes.js";

const buildDashboardComponent = (metadata, theme) => {
  const palette = getThemePalette(theme);
  // Only include schema (columns), not actual row data
  const sheetsSchema = metadata.sheets.map((sheet) => ({
    name: sheet.name,
    label: sheet.label,
    columns: sheet.columns,
    rowCount: sheet.rowCount ?? 0,
  }));

  return `import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import Charts from './components/Charts';
import CrudControls from './components/CrudControls';

const sheetsSchema = ${JSON.stringify(sheetsSchema, null, 2)};
const excelId = ${JSON.stringify(metadata.excelId ?? "")};
const defaultApiBase = process.env.NEXT_PUBLIC_EXODIA_API_BASE ?? "http://localhost:8000/api/v1";

const theme = ${JSON.stringify(palette, null, 2)};

const withRows = (sheet, rows = []) => {
  // Ensure rows is always an array
  const safeRows = Array.isArray(rows) ? rows : [];
  return {
    ...sheet,
    rows: safeRows,
    rowCount: safeRows.length,
  };
};

export default function Dashboard({ apiBaseUrl = defaultApiBase, authToken = "" }) {
  const [sheets, setSheets] = useState(() => sheetsSchema.map(s => withRows(s, [])));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data from API on mount
  useEffect(() => {
    const fetchAllSheets = async () => {
      if (!excelId) {
        setLoading(false);
        setError('No Excel ID provided');
        return;
      }

      try {
        const promises = sheetsSchema.map(async (schema) => {
          const url = \`\${apiBaseUrl}/sheets/\${excelId}/\${encodeURIComponent(schema.name)}\`;
          const headers = {};
          if (authToken) {
            headers.Authorization = \`Bearer \${authToken}\`;
          }
          
          const response = await fetch(url, { headers });
          
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Unauthorized: Please provide a valid authToken');
            }
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch data');
          }
          
          console.log('API Response for', schema.name, ':', JSON.stringify(data, null, 2));
          
          // IMPORTANT: Exodia API response structure is { status, message, data: { rows: [] } }
          // So we access rows via data.data.rows (not data.rows)
          // Handle ALL possible response formats robustly:
          let rowsArray = [];
          
          if (data.data && Array.isArray(data.data.rows)) {
            // Standard format: { status, message, data: { rows: [...] } }
            rowsArray = data.data.rows;
          } else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data) && data.data.rows === undefined) {
            // If data.data is a single object (not array), wrap it in array
            rowsArray = [data.data];
          } else if (data.data && Array.isArray(data.data)) {
            // If data.data itself is the rows array
            rowsArray = data.data;
          } else if (Array.isArray(data.rows)) {
            // Fallback: check data.rows directly
            rowsArray = data.rows;
          } else {
            // Empty array as final fallback
            rowsArray = [];
          }
          
          return withRows(schema, rowsArray);
        });

        const loadedSheets = await Promise.all(promises);
        setSheets(loadedSheets);
        setError(null);
      } catch (err) {
        console.error('Failed to load sheet data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSheets();
  }, [apiBaseUrl, authToken]);

  const handleRowsChange = (sheetName, rows) => {
    // Ensure rows is always an array before updating state
    const safeRows = Array.isArray(rows) ? rows : [];
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.name === sheetName ? { ...sheet, rows: safeRows, rowCount: safeRows.length } : sheet
      )
    );
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Trigger refetch by updating a dummy state or just reload
    window.location.reload();
  };

  if (loading) {
    return (
      <main
        style={{
          padding: '1.5rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '100vh',
          background: theme.background,
          color: theme.foreground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: theme.mutedForeground }}>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          padding: '1.5rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '100vh',
          background: theme.background,
          color: theme.foreground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
          Error: {error}
        </p>
        {!authToken && (
          <p style={{ color: theme.mutedForeground, fontSize: '0.875rem', maxWidth: '500px', textAlign: 'center' }}>
            This dashboard requires authentication. Pass an authToken prop or set VITE_EXODIA_AUTH_TOKEN in your .env file.
          </p>
        )}
        <button
          onClick={handleRetry}
          style={{
            padding: '0.5rem 1rem',
            background: theme.primary,
            color: theme.background,
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: '1.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        background: theme.background,
        color: theme.foreground,
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem', color: theme.foreground, fontSize: '1.5rem' }}>
          Exodia Dashboard
        </h1>
        <p style={{ color: theme.mutedForeground, margin: 0, fontSize: '0.875rem' }}>
          Workbook: <code style={{ color: theme.primary }}>{excelId || 'not set'}</code>
        </p>
      </header>

      {sheets.map((sheet) => (
        <section
          key={sheet.name}
          style={{
            marginBottom: '2rem',
            border: \`1px solid \${theme.border}\`,
            borderRadius: '0.5rem',
            padding: '1rem',
            background: theme.cardBackground,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.75rem',
            }}
          >
            <h2 style={{ margin: 0, color: theme.foreground, fontSize: '1.125rem' }}>
              {sheet.label}
            </h2>
            <span style={{ color: theme.mutedForeground, fontSize: '0.875rem' }}>
              {sheet.rows.length} rows
            </span>
          </header>
          <Charts sheet={sheet} theme={theme} />
          <Table sheet={sheet} theme={theme} />
          <CrudControls
            sheet={sheet}
            excelId={excelId}
            apiBaseUrl={apiBaseUrl}
            authToken={authToken}
            theme={theme}
            onRowsChange={(rows) => handleRowsChange(sheet.name, rows)}
          />
        </section>
      ))}
    </main>
  );
}
`;
};

const buildTableComponent = () => `import React, { useState } from 'react';

export default function Table({ sheet, theme }) {
  const [showAll, setShowAll] = useState(false);
  
  // Ensure columns and rows are always arrays
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : [];
  const safeRows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  
  if (columns.length === 0) {
    return <p style={{ color: theme.mutedForeground }}>No columns defined.</p>;
  }
  
  if (safeRows.length === 0) {
    return <p style={{ color: theme.mutedForeground }}>No data available yet.</p>;
  }

  const rows = safeRows;
  const displayRows = showAll ? rows : rows.slice(0, 5);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name} style={{ 
                textAlign: 'left', 
                borderBottom: \`1px solid \${theme.border}\`,
                padding: '0.5rem',
                color: theme.foreground,
                fontSize: '0.875rem',
              }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, idx) => (
            <tr key={row.rowId}>
              {columns.map((column) => (
                <td key={column.name} style={{ 
                  padding: '0.5rem',
                  borderBottom: \`1px solid \${theme.border}\`,
                  color: theme.mutedForeground,
                  fontSize: '0.875rem',
                }}>
                  {row[column.name] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: \`1px solid \${theme.border}\`,
            borderRadius: '0.25rem',
            color: theme.foreground,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          {showAll ? 'Show less' : \`Show all \${rows.length} rows\`}
        </button>
      )}
    </div>
  );
}
`;

const buildChartsComponent = () => `import React from 'react';

export default function Charts({ sheet, theme }) {
  // Ensure columns and rows are always arrays
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : [];
  const safeRows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  
  // Simple summary stats instead of charts
  const totalRows = safeRows.length;
  const columnCount = columns.length;

  return (
    <div style={{ 
      padding: '0.75rem', 
      marginTop: '1rem',
      borderRadius: '0.25rem',
      background: theme.muted,
      display: 'flex',
      gap: '1.5rem',
      fontSize: '0.875rem',
    }}>
      <div>
        <span style={{ color: theme.mutedForeground }}>Columns: </span>
        <strong style={{ color: theme.foreground }}>{columnCount}</strong>
      </div>
      <div>
        <span style={{ color: theme.mutedForeground }}>Total Rows: </span>
        <strong style={{ color: theme.foreground }}>{totalRows}</strong>
      </div>
    </div>
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

export default function CrudControls({ sheet, excelId, apiBaseUrl, authToken, theme, onRowsChange }) {
  // Ensure columns and rows are always arrays
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : [];
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  
  const [createPayload, setCreatePayload] = useState(() =>
    buildFormState(columns)
  );
  const [editPayload, setEditPayload] = useState(() =>
    buildFormState(columns)
  );
  const [selectedRowId, setSelectedRowId] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!selectedRowId) {
      return;
    }
    const activeRow = rows.find((row) => String(row.rowId) === selectedRowId);
    if (activeRow) {
      setEditPayload(buildFormState(columns, activeRow));
    }
  }, [rows, selectedRowId, columns]);

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

    console.log('CRUD Response:', JSON.stringify(payload, null, 2));

    // IMPORTANT: Exodia API response structure is { status, message, data: { rows: [] } }
    // So we access rows via payload.data.rows (not payload.rows)
    // Handle ALL possible response formats robustly:
    let rowsArray = [];
    
    if (payload.data && Array.isArray(payload.data.rows)) {
      // Standard format: { status, message, data: { rows: [...] } }
      rowsArray = payload.data.rows;
    } else if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data) && payload.data.rows === undefined) {
      // If data is a single object (not array), wrap it in array
      rowsArray = [payload.data];
    } else if (payload.data && Array.isArray(payload.data)) {
      // If data itself is the rows array
      rowsArray = payload.data;
    } else if (Array.isArray(payload.rows)) {
      // Fallback: check payload.rows directly
      rowsArray = payload.rows;
    } else {
      // Empty array as final fallback
      rowsArray = [];
    }
    
    return {
      rows: rowsArray,
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
          serializePayload(columns, createPayload)
        ),
      () => setCreatePayload(buildFormState(columns))
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
          serializePayload(columns, editPayload)
        ),
      () => {
        setSelectedRowId('');
        setEditPayload(buildFormState(columns));
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
        setEditPayload(buildFormState(columns));
      }
    );
  };

  const handleRefresh = async () => {
    await runAction('refresh', () => request('GET'));
  };

  const gridStyle = {
    display: 'grid',
    gap: '0.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    marginBottom: '0.75rem',
  };

  const inputStyle = {
    border: \`1px solid \${theme.border}\`,
    borderRadius: '0.25rem',
    padding: '0.375rem 0.5rem',
    background: theme.background,
    color: theme.foreground,
    fontSize: '0.875rem',
  };

  const buttonStyle = {
    padding: '0.375rem 0.75rem',
    borderRadius: '0.25rem',
    border: \`1px solid \${theme.primary}\`,
    background: theme.primary,
    color: theme.background,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
  };

  const buttonSecondaryStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: theme.foreground,
    borderColor: theme.border,
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        borderTop: \`1px solid \${theme.border}\`,
        paddingTop: '1rem',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: theme.foreground, fontSize: '1rem' }}>
        Data Operations
      </h3>
      {feedback && (
        <p
          style={{
            color: feedback.type === 'error' ? '#dc2626' : '#16a34a',
            fontSize: '0.875rem',
            marginBottom: '0.75rem',
          }}
        >
          {feedback.message}
        </p>
      )}

      <form onSubmit={handleCreate} style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: theme.foreground, fontSize: '0.875rem', fontWeight: 600 }}>
          Create New
        </h4>
        <div style={gridStyle}>
          {columns.map((column) => (
            <label
              key={column.name}
              style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}
            >
              <span style={{ fontWeight: 500, color: theme.mutedForeground, marginBottom: '0.25rem' }}>
                {column.label}
              </span>
              <input
                type="text"
                value={createPayload[column.name]}
                onChange={(event) =>
                  setCreatePayload((prev) => ({
                    ...prev,
                    [column.name]: event.target.value,
                  }))
                }
                style={inputStyle}
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={disabled || loadingAction === 'create'}
          style={buttonStyle}
        >
          {loadingAction === 'create' ? 'Creating…' : 'Create'}
        </button>
      </form>

      <form onSubmit={handleUpdate} style={{ marginBottom: '0.75rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: theme.foreground, fontSize: '0.875rem', fontWeight: 600 }}>
          Update / Delete
        </h4>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '0.75rem',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ fontWeight: 500, color: theme.mutedForeground, marginBottom: '0.25rem' }}>
            Select Row
          </span>
          <select
            value={selectedRowId}
            onChange={(event) => setSelectedRowId(event.target.value)}
            style={inputStyle}
          >
            <option value="">Choose a row...</option>
            {rows.map((row) => (
              <option key={row.rowId} value={row.rowId}>
                {formatRowLabel(row, columns)}
              </option>
            ))}
          </select>
        </label>
        <div style={gridStyle}>
          {columns.map((column) => (
            <label
              key={column.name}
              style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}
            >
              <span style={{ fontWeight: 500, color: theme.mutedForeground, marginBottom: '0.25rem' }}>
                {column.label}
              </span>
              <input
                type="text"
                value={editPayload[column.name]}
                onChange={(event) =>
                  setEditPayload((prev) => ({
                    ...prev,
                    [column.name]: event.target.value,
                  }))
                }
                style={inputStyle}
              />
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={disabled || !selectedRowId || loadingAction === 'update'}
            style={buttonStyle}
          >
            {loadingAction === 'update' ? 'Updating…' : 'Update'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={disabled || !selectedRowId || loadingAction === 'delete'}
            style={buttonSecondaryStyle}
          >
            {loadingAction === 'delete' ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={disabled || loadingAction === 'refresh'}
            style={buttonSecondaryStyle}
          >
            {loadingAction === 'refresh' ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </form>
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

- \`package.json\` — Vite + React + TypeScript dependencies and scripts.
- \`tsconfig.json\` — TypeScript configuration for the React app.
- \`index.html\`, \`src/main.tsx\`, \`src/App.tsx\` — local dev entrypoint.
- \`Dashboard.tsx\` + \`components/*\` — the generated dashboard + CRUD widgets.
- \`metadata.json\` — workbook schema snapshot.
- \`.env.example\` — optional API base + auth token overrides.

## Prerequisites

**CRITICAL:** This dashboard requires:
1. ✅ **Exodia backend running** at \`http://localhost:8000\` (or update \`VITE_EXODIA_API_BASE\`)
2. ✅ **Valid JWT authentication token** (all API endpoints require authentication)

## Getting Your Auth Token

Before running the dashboard, you need a JWT token:

\`\`\`bash
# Login to get a token (replace with your credentials)
curl -X POST http://localhost:8000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Response will include: {"status":"success","data":{"token":"YOUR_JWT_HERE",...}}
\`\`\`

Copy the token value and use it in step 3 below.

## Run Locally (Vite)

1. **Start your Exodia backend server first** (typically \`npm start\` in the server directory)
2. Copy \`.env.example\` to \`.env\`
3. **REQUIRED:** Paste your JWT token into \`VITE_EXODIA_AUTH_TOKEN\` in the \`.env\` file
4. Install dependencies: \`npm install\`
5. Start the dev server: \`npm run dev\` (defaults to <http://localhost:5173>)

Without a valid token, you'll get "Unauthorized" errors when the dashboard tries to fetch data.

## Embedding into Next.js (optional)

1. Copy \`Dashboard.tsx\`, \`components/*\`, and \`metadata.json\` into your Next.js project.
2. Import the component in any route: \`import Dashboard from "./Dashboard";\`
3. Render \`<Dashboard apiBaseUrl={process.env.NEXT_PUBLIC_EXODIA_API_BASE} authToken={token} />\`.

## How It Works

The dashboard is **fully API-driven**:

- **On mount:** Fetches all sheet data via \`GET /api/v1/sheets/:excelId/:sheetName\`
- **Create:** \`POST /api/v1/sheets/:excelId/:sheetName/rows\`
- **Update:** \`PUT /api/v1/sheets/:excelId/:sheetName/rows/:rowId\`
- **Delete:** \`DELETE /api/v1/sheets/:excelId/:sheetName/rows/:rowId\`
- **Refresh:** \`GET /api/v1/sheets/:excelId/:sheetName\`

All data is loaded from your backend - no row data is embedded in the code.
`;

const buildMetadataJson = (metadata) => {
  // Strip row data from metadata.json - only keep schema
  const schemaOnly = stripRowsFromMetadata(metadata);
  return JSON.stringify(schemaOnly, null, 2);
};

const buildPackageJson = () =>
  JSON.stringify(
    {
      name: "exodia-dashboard",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: {
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.2.1",
        typescript: "^5.5.0",
        vite: "^5.4.8",
      },
    },
    null,
    2
  );

const buildEnvExample = () => `# REQUIRED: The Exodia backend API base URL
VITE_EXODIA_API_BASE=http://localhost:8000/api/v1

# REQUIRED: Your JWT auth token from POST /api/v1/auth/login
# Without this, the dashboard cannot fetch data (you'll get 401 Unauthorized)
# To get a token, run: curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"your@email.com","password":"yourpassword"}'
VITE_EXODIA_AUTH_TOKEN=your_jwt_token_here
`;

const buildGitignore = () => `node_modules
dist
.env
.DS_Store
`;

const buildTsConfig = () => `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "Dashboard.tsx", "components"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

const buildTsConfigNode = () => `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`;

const buildViteEnv = () => `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXODIA_API_BASE: string
  readonly VITE_EXODIA_AUTH_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
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
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const buildAppComponent = () => `import React from 'react';
import Dashboard from '../Dashboard';

const apiBaseUrl =
  import.meta.env.VITE_EXODIA_API_BASE ?? 'http://localhost:8000/api/v1';
const authToken = import.meta.env.VITE_EXODIA_AUTH_TOKEN ?? '';

export default function App() {
  // Warn if no token is provided
  React.useEffect(() => {
    if (!authToken) {
      console.warn(
        '⚠️ No VITE_EXODIA_AUTH_TOKEN found in environment. ' +
        'The dashboard will fail to fetch data. ' +
        'Please set VITE_EXODIA_AUTH_TOKEN in your .env file.'
      );
    }
  }, []);

  return (
    <Dashboard apiBaseUrl={apiBaseUrl} authToken={authToken} />
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

const BASE_INSTRUCTION = `Generate a complete TypeScript + React + Vite dashboard with the following REQUIRED structure:

CRITICAL REQUIREMENTS:
1. **CRUD Operations are MANDATORY** - Every sheet MUST have Create, Update, and Delete controls
2. **TypeScript files only** - All .tsx and .ts extensions
3. **Vite build tool** - NOT Create React App
4. **Full CRUD functionality** - Users must be able to add, edit, and delete rows directly in the dashboard
5. **API-DRIVEN DATA** - Dashboard must fetch ALL row data from the Exodia API on mount. DO NOT embed row data in the code. Only embed column schema.

REQUIRED FILES:
- package.json: Vite + React + TypeScript dependencies (react, react-dom, vite, typescript, @types/react, @types/react-dom, @vitejs/plugin-react)
- tsconfig.json: TypeScript config with ES2020, DOM libs, jsx: "react-jsx"
- tsconfig.node.json: Node config for Vite
- vite.config.ts: Vite config with React plugin
- src/vite-env.d.ts: Vite environment type definitions
- index.html: Entry point referencing /src/main.tsx
- src/main.tsx: React 18 root render
- src/App.tsx: Main app passing apiBaseUrl and authToken to Dashboard
- Dashboard.tsx: Main dashboard component showing all sheets with Table, Charts, and CrudControls
- components/Table.tsx: Data table display
- components/Charts.tsx: Chart placeholders
- components/CrudControls.tsx: MANDATORY CRUD form with Create Row, Update Row, Delete Row functionality
- .env.example: VITE_EXODIA_API_BASE and VITE_EXODIA_AUTH_TOKEN
- README.md: Setup instructions

DATA FETCHING & AUTHENTICATION:
- Dashboard.tsx MUST use useEffect to fetch initial data from GET /api/v1/sheets/{excelId}/{sheetName} on component mount
- ALL API endpoints require authentication - include Authorization: Bearer {authToken} header in ALL requests
- Handle 401 Unauthorized errors gracefully with error state and retry button
- Show helpful message if authToken is missing
- Only embed column schema (name, label, type), NOT actual row data
- Default apiBaseUrl should be http://localhost:8000/api/v1
- Show loading state while fetching initial data
- Show error state with retry button if fetch fails

CRITICAL - API RESPONSE STRUCTURE:
The Exodia API returns responses in this EXACT structure:
{
  "status": "success",
  "message": "...",
  "data": {
    "rows": [...]
  }
}
- Rows are at response.data.rows, NOT response.rows!
- Always extract: const rows = response.data?.rows ?? [];
- NEVER use response.rows directly

CRITICAL - ARRAY SAFETY (PREVENTS BLANK PAGES):
ALL components MUST validate arrays before using .map(), .filter(), .find(), or .length:

// At the TOP of EVERY component that uses sheet.columns or sheet.rows:
const columns = Array.isArray(sheet?.columns) ? sheet.columns : [];
const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];

// Then use 'columns' and 'rows' throughout the component
// NEVER use sheet.columns.map() directly - it will crash if columns is undefined!
// ALWAYS use: columns.map() after the safety check above

CRUD CONTROLS MUST INCLUDE:
- Form to create new rows (POST /api/v1/sheets/{excelId}/{sheetName}/rows)
- Form to update existing rows (PUT /api/v1/sheets/{excelId}/{sheetName}/rows/{rowId})
- Button to delete rows (DELETE /api/v1/sheets/{excelId}/{sheetName}/rows/{rowId})
- All forms should have inputs for every column in the sheet
- After successful CRUD operation, call onRowsChange callback to update the UI
- ALL CRUD responses also return { status, data: { rows: [...] } } - extract rows from response.data.rows

IMPORTANT: The main purpose of this dashboard is to REPLACE Excel for data entry. Users MUST be able to add, edit, and delete data easily.

EXAMPLE SAFE COMPONENT PATTERN:
\`\`\`tsx
export default function Table({ sheet, theme }) {
  // ALWAYS validate arrays at the top
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : [];
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  
  if (columns.length === 0) return <p>No columns</p>;
  if (rows.length === 0) return <p>No data</p>;
  
  return (
    <table>
      <thead>
        <tr>{columns.map(col => <th key={col.name}>{col.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(row => <tr key={row.rowId}>...</tr>)}
      </tbody>
    </table>
  );
}
\`\`\`

EXAMPLE SAFE DATA FETCHING:
\`\`\`tsx
const response = await fetch(url, { headers });
const json = await response.json();
// CORRECT: rows are nested in data.rows
const rows = json?.data?.rows ?? [];
// Then validate: const safeRows = Array.isArray(rows) ? rows : [];
\`\`\``;

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
    log.warn("extractBalancedJson: No opening brace found");
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
        const extracted = raw.slice(start, i + 1);
        log.info("extractBalancedJson: Successfully balanced JSON", {
          length: extracted.length,
          totalLength: raw.length,
        });
        return extracted;
      }
    }
  }

  log.warn("extractBalancedJson: Unbalanced JSON, returning from start", {
    depth,
    length: raw.length - start,
  });
  return raw.slice(start);
};

const parseFilesPayload = (raw) => {
  try {
    const cleaned = sanitizeJsonString(raw);
    if (!cleaned) {
      log.error("parseFilesPayload: sanitizeJsonString returned null");
      return null;
    }

    const balanced = extractBalancedJson(cleaned);
    if (!balanced) {
      log.error("parseFilesPayload: extractBalancedJson returned null");
      return null;
    }

    log.info("parseFilesPayload: Attempting to parse JSON", {
      preview: previewText(balanced, 200),
      length: balanced.length,
    });

    const parsed = JSON.parse(balanced);
    if (parsed && typeof parsed.files === "object") {
      const fileCount = Object.keys(parsed.files).length;
      log.info(`parseFilesPayload: Successfully parsed ${fileCount} files`);
      return parsed.files;
    } else {
      log.error("parseFilesPayload: Parsed JSON doesn't have .files object", {
        parsed: typeof parsed,
        hasFiles: !!parsed?.files,
        filesType: typeof parsed?.files,
      });
    }
  } catch (error) {
    log.error("AI response parsing failed", {
      error: error.message,
      stack: error.stack,
      rawPreview: previewText(raw, 300),
    });
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

const stripRowsFromMetadata = (metadata) => {
  return {
    ...metadata,
    sheets: metadata.sheets.map((sheet) => ({
      name: sheet.name,
      label: sheet.label,
      columns: sheet.columns, // Only send column schema (name, type, label)
      rowCount: sheet.rows?.length ?? sheet.rowCount ?? 0, // Keep count for reference
      // NO rows data sent to AI - data is fetched from API
    })),
  };
};

const buildPromptText = (metadata, prompt) => {
  // Strip out ALL rows - AI only needs schema (columns), not actual data
  const schemaOnly = stripRowsFromMetadata(metadata);

  const sections = [
    'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON shaped as {"files": {"path": "file contents"}} with no Markdown fences.',
    `Task:\n${BASE_INSTRUCTION}`,
  ];

  if (prompt) {
    sections.push(`User guidance:\n${prompt}`);
  }

  sections.push(
    `Workbook schema (columns only, NO data rows - dashboard fetches data from API):\n${JSON.stringify(
      schemaOnly,
      null,
      2
    )}`
  );

  return sections.join("\n\n");
};

const fromOpenAi = async (metadata, prompt) => {
  try {
    const promptText = buildPromptText(metadata, prompt);
    const promptSize = promptText.length;
    log.info("Calling OpenAI API", {
      model: env.OPENAI_MODEL,
      promptSize,
      promptSizeKB: (promptSize / 1024).toFixed(2),
      sheetsCount: metadata.sheets?.length ?? 0,
      note: "Schema only - no row data sent to AI",
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        // temperature: 0.2,
        max_completion_tokens: 16000, // Limit max tokens to avoid extremely slow responses
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON: {"files": {"path": "file contents"}}.',
          },
          {
            role: "user",
            content: promptText,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      log.error("OpenAI API error", {
        status: response.status,
        body: errorBody,
      });
      throw new Error(`OpenAI responded with ${response.status}: ${errorBody}`);
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
    const promptText = buildPromptText(metadata, prompt);
    const promptSize = promptText.length;
    log.info("Calling Claude API", {
      model: env.CLAUDE_MODEL,
      promptSize,
      promptSizeKB: (promptSize / 1024).toFixed(2),
      sheetsCount: metadata.sheets?.length ?? 0,
      note: "Schema only - no row data sent to AI",
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.CLAUDE_MODEL,
        max_tokens: 16000, // Reduced from 32000 to speed up generation
        temperature: 0.2,
        system:
          'You are Exodia, an AI that converts Excel metadata into React dashboards. Always respond with JSON: {"files": {"path": "file contents"}}.',
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      log.error("Claude API error", {
        status: response.status,
        body: errorBody,
      });
      throw new Error(`Claude responded with ${response.status}: ${errorBody}`);
    }

    const payload = await response.json();
    log.info("Claude API response received", {
      contentBlocks: payload?.content?.length || 0,
      stopReason: payload?.stop_reason,
    });

    // Check if Claude hit token limit
    if (payload?.stop_reason === "max_tokens") {
      log.warn("Claude hit max_tokens limit - response may be truncated");
    }

    const text = extractClaudeText(payload);
    log.info("Extracted text from Claude", {
      length: text?.length || 0,
      preview: previewText(text, 300),
    });

    const files = parseFilesPayload(text);
    if (!files) {
      const errorMsg =
        payload?.stop_reason === "max_tokens"
          ? `claude_error: response truncated (hit ${16000} token limit). Try a smaller dataset or simpler prompt.`
          : `claude_error: empty response (preview: ${previewText(text)})`;
      throw new Error(errorMsg);
    }
    log.info("Successfully parsed files from Claude", {
      fileCount: Object.keys(files).length,
    });
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

const buildTemplateFiles = (payload, theme) => ({
  "package.json": buildPackageJson(),
  ".env.example": buildEnvExample(),
  ".gitignore": buildGitignore(),
  "vite.config.ts": buildViteConfig(),
  "tsconfig.json": buildTsConfig(),
  "tsconfig.node.json": buildTsConfigNode(),
  "index.html": buildIndexHtml(),
  "src/main.tsx": buildMainEntry(),
  "src/App.tsx": buildAppComponent(),
  "src/vite-env.d.ts": buildViteEnv(),
  "Dashboard.tsx": buildDashboardComponent(payload, theme),
  "components/Table.tsx": buildTableComponent(),
  "components/Charts.tsx": buildChartsComponent(),
  "components/CrudControls.tsx": buildCrudControlsComponent(),
  "metadata.json": buildMetadataJson(payload),
  "README.md": buildReadme(payload),
});

export const aiService = {
  async generateDashboard(metadataWithRows, options = {}) {
    const payload = metadataWithRows;
    const prompt = normalizePrompt(options.prompt);
    const theme = normalizeTheme(options.theme);
    let failureReason;

    // If no custom prompt, just use template immediately (much faster)
    if (!prompt) {
      log.info("No custom prompt provided, using template generator", {
        theme,
      });
      return {
        files: buildTemplateFiles(payload, theme),
        source: "template",
        reason: "no_prompt",
      };
    }

    // Custom prompt provided, try AI generation
    if (!featureFlags.aiGeneration) {
      log.warn(
        "Prompt provided for publish but no AI provider configured; using static template"
      );
      failureReason = "missing_generator";
    }

    // Try Claude first (Anthropic), then fallback to OpenAI
    if (featureFlags.claude) {
      try {
        const files = await fromClaude(payload, prompt);
        return { files, source: "claude" };
      } catch (error) {
        log.warn(
          "Claude generation failed, falling back to OpenAI or template",
          error.message
        );
        failureReason = error.message;
      }
    }

    if (featureFlags.openai) {
      try {
        const files = await fromOpenAi(payload, prompt);
        return { files, source: "openai" };
      } catch (error) {
        log.warn(
          "OpenAI generation failed, falling back to template",
          error.message
        );
        failureReason = error.message;
      }
    }

    const fallbackReason =
      failureReason ??
      (featureFlags.aiGeneration ? "generator_failed" : "missing_generator");

    log.info("Using template generator", { theme, reason: fallbackReason });
    return {
      files: buildTemplateFiles(payload, theme),
      source: "template",
      reason: fallbackReason,
    };
  },
};
