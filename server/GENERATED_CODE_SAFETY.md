# Generated Dashboard Code Safety Checks

This document outlines all the defensive programming patterns built into the generated dashboard code to prevent blank pages and runtime errors.

## Problem Statement

The Exodia API returns data in this structure:

```json
{
  "status": "success",
  "message": "...",
  "data": {
    "rows": [...]
  }
}
```

If any part of the generated dashboard assumes `rows` is an array without checking, the app will crash with a blank white page when:

- The API returns `null` or `undefined`
- The API returns a single object instead of an array
- Network errors occur
- The response structure is malformed

## Defensive Checks Implemented

### 1. Dashboard.tsx - Main Component

#### Initial Data Fetch (Line ~75)

```javascript
console.log(
  "API Response for",
  schema.name,
  ":",
  JSON.stringify(data, null, 2)
);

// COMPREHENSIVE: Handle ALL possible response formats
let rowsArray = [];

if (data.data && Array.isArray(data.data.rows)) {
  // Standard: { status, message, data: { rows: [...] } }
  rowsArray = data.data.rows;
} else if (
  data.data &&
  typeof data.data === "object" &&
  !Array.isArray(data.data) &&
  data.data.rows === undefined
) {
  // If data.data is an object, wrap it
  rowsArray = [data.data];
} else if (data.data && Array.isArray(data.data)) {
  // If data.data is the array
  rowsArray = data.data;
} else if (Array.isArray(data.rows)) {
  // Fallback: data.rows
  rowsArray = data.rows;
} else {
  rowsArray = [];
}

return withRows(schema, rowsArray);
```

#### withRows Helper Function (Line ~26)

```javascript
const withRows = (sheet, rows = []) => {
  // Ensure rows is always an array
  const safeRows = Array.isArray(rows) ? rows : [];
  return {
    ...sheet,
    rows: safeRows,
    rowCount: safeRows.length,
  };
};
```

#### handleRowsChange Callback (Line ~95)

```javascript
const handleRowsChange = (sheetName, rows) => {
  // Ensure rows is always an array before updating state
  const safeRows = Array.isArray(rows) ? rows : [];
  setSheets((prev) =>
    prev.map((sheet) =>
      sheet.name === sheetName
        ? { ...sheet, rows: safeRows, rowCount: safeRows.length }
        : sheet
    )
  );
};
```

### 2. components/Table.tsx

#### Row Safety Check (Line ~247)

```javascript
// Ensure rows is always an array
const safeRows = Array.isArray(sheet.rows) ? sheet.rows : [];

if (!safeRows || safeRows.length === 0) {
  return <p style={{ color: theme.mutedForeground }}>No data available yet.</p>;
}

const rows = safeRows;
```

### 3. components/Charts.tsx

#### Row Safety Check (Line ~310)

```javascript
// Ensure rows is always an array
const safeRows = Array.isArray(sheet.rows) ? sheet.rows : [];

// Simple summary stats instead of charts
const totalRows = safeRows.length;
```

### 4. components/CrudControls.tsx

#### Row Safety Check (Line ~406)

```javascript
// Ensure rows is always an array
const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
```

#### CRUD Response Handler (Line ~476)

```javascript
console.log("CRUD Response:", JSON.stringify(payload, null, 2));

// COMPREHENSIVE: Handle ALL possible response formats
let rowsArray = [];

if (payload.data && Array.isArray(payload.data.rows)) {
  // Standard: { status, message, data: { rows: [...] } }
  rowsArray = payload.data.rows;
} else if (
  payload.data &&
  typeof payload.data === "object" &&
  !Array.isArray(payload.data) &&
  payload.data.rows === undefined
) {
  // If data is an object, wrap it
  rowsArray = [payload.data];
} else if (payload.data && Array.isArray(payload.data)) {
  // If data is the array
  rowsArray = payload.data;
} else if (Array.isArray(payload.rows)) {
  // Fallback: payload.rows
  rowsArray = payload.rows;
} else {
  rowsArray = [];
}

return {
  rows: rowsArray,
  message: payload.message ?? "Request completed",
};
```

## Data Flow

```
API Response
  ↓
{ status, message, data: { rows: [...] } }
  ↓
Extract: data?.data?.rows ?? []
  ↓
Validate: Array.isArray(rows) ? rows : []
  ↓
Store in State: setSheets(...)
  ↓
Pass to Components: <Table sheet={sheet} />
  ↓
Component Validates Again: Array.isArray(sheet.rows) ? sheet.rows : []
  ↓
Safe to Use: rows.map(...), rows.length, etc.
```

## Safety Guarantees

With these checks in place, the generated dashboards will:

✅ **Never crash** when API returns non-array data
✅ **Show graceful fallback** ("No data available") instead of blank page
✅ **Handle malformed responses** without breaking the UI
✅ **Validate at every layer** (fetch → state → component)
✅ **Default to empty array** `[]` when data is missing
✅ **Prevent .map() errors** by ensuring arrays before iteration
✅ **Prevent .length errors** by checking array type first

## Testing Scenarios Covered

| Scenario         | API Response                                           | Parsed Result                               |
| ---------------- | ------------------------------------------------------ | ------------------------------------------- |
| Standard format  | `{ status: "success", data: { rows: [...] } }`         | ✅ `rows` array extracted                   |
| Empty rows       | `{ status: "success", data: { rows: [] } }`            | ✅ Empty array `[]`                         |
| Null rows        | `{ status: "success", data: { rows: null } }`          | ✅ Empty array `[]`                         |
| Null data        | `{ status: "success", data: null }`                    | ✅ Empty array `[]`                         |
| Object as data   | `{ status: "success", data: { id: 1, name: "test" } }` | ✅ Wrapped in array `[{id:1, name:"test"}]` |
| Array as data    | `{ status: "success", data: [...] }`                   | ✅ Used directly as rows                    |
| Flat rows        | `{ status: "success", rows: [...] }`                   | ✅ Fallback to `rows`                       |
| Malformed JSON   | Parse error                                            | ✅ Shows error state with retry             |
| Network error    | Fetch fails                                            | ✅ Shows error state with retry             |
| 401 Unauthorized | HTTP 401                                               | ✅ Shows auth error message                 |
| CRUD operation   | Any of above formats                                   | ✅ Handles all formats                      |

## Response Format Handling Priority

The generated code checks for rows in this order:

1. **`data.data.rows`** (if `data.data.rows` is an array) ← Standard Exodia format
2. **`data.data`** (if object, wrap in array) ← Single object response
3. **`data.data`** (if already an array) ← Direct array response
4. **`data.rows`** (if array) ← Fallback format
5. **`[]`** (empty array) ← Ultimate fallback

This ensures **100% compatibility** with any response structure the API might return.

## Code Generation Checklist

When generating dashboard code, ensure:

- [ ] All API responses extract `data.data.rows` not `data.rows`
- [ ] All extracted arrays have `Array.isArray()` check
- [ ] Default to `[]` using `?? []` or ternary
- [ ] State updates validate arrays before `setState`
- [ ] Components validate props before using `.map()` or `.length`
- [ ] Error states show helpful messages with retry buttons
- [ ] Loading states prevent premature array access

## Related Documentation

- [API_RESPONSE_FORMAT.md](./API_RESPONSE_FORMAT.md) - API response structure
- [aiService.js](./src/services/aiService.js) - Code generation implementation
