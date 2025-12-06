# Exodia API Response Format

## Standard Response Structure

**ALL** Exodia API endpoints follow this consistent response structure:

```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": {
    // Actual data payload here
  }
}
```

## Important: Nested Data Structure

⚠️ **CRITICAL**: The actual data is nested inside the `data` property.

### Example: Fetching Sheet Rows

**Endpoint:** `GET /api/v1/sheets/:excelId/:sheetName`

**Response:**

```json
{
  "status": "success",
  "message": "Sheet data retrieved",
  "data": {
    "rows": [
      { "rowId": 1, "name": "Alice", "age": 30 },
      { "rowId": 2, "name": "Bob", "age": 25 }
    ]
  }
}
```

**Accessing the rows:**

```javascript
const response = await fetch(url);
const data = await response.json();

// ✅ CORRECT
const rows = data.data.rows; // or data?.data?.rows ?? []

// ❌ WRONG
const rows = data.rows; // This will be undefined!
```

## All Endpoints Follow This Pattern

### Authentication

```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": { "id": "...", "email": "..." }
  }
}
```

### Upload Excel

```json
{
  "status": "success",
  "message": "Excel uploaded",
  "data": {
    "excelId": "uuid",
    "fileName": "data.xlsx",
    "sheets": [...]
  }
}
```

### List Sheets

```json
{
  "status": "success",
  "data": {
    "excelId": "uuid",
    "fileName": "data.xlsx",
    "sheets": [...]
  }
}
```

### Get Sheet Rows

```json
{
  "status": "success",
  "data": {
    "rows": [...]
  }
}
```

### Create/Update/Delete Row

```json
{
  "status": "success",
  "message": "Row created",
  "data": {
    "rows": [...]  // Updated full sheet data
  }
}
```

### List Repos

```json
{
  "status": "success",
  "data": {
    "repos": [...]
  }
}
```

### Publish Repo

```json
{
  "status": "success",
  "message": "Repo published",
  "data": {
    "repo": { "repoUrl": "...", ... },
    "generator": "claude",
    "generatorReason": "..."
  }
}
```

## Error Responses

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

## Code Generation Template

When generating dashboard code, use this COMPREHENSIVE pattern to handle ALL possible response formats:

```javascript
const response = await fetch(apiUrl, options);
const json = await response.json();

// Check status
if (json.status !== "success") {
  throw new Error(json.message || "Request failed");
}

// Log for debugging
console.log("API Response:", JSON.stringify(json, null, 2));

// COMPREHENSIVE: Handle ALL possible response formats
let rowsArray = [];

if (json.data && Array.isArray(json.data.rows)) {
  // Standard format: { status, message, data: { rows: [...] } }
  rowsArray = json.data.rows;
} else if (
  json.data &&
  typeof json.data === "object" &&
  !Array.isArray(json.data) &&
  json.data.rows === undefined
) {
  // If data is a single object (not array), wrap it in array
  rowsArray = [json.data];
} else if (json.data && Array.isArray(json.data)) {
  // If data itself is the rows array
  rowsArray = json.data;
} else if (Array.isArray(json.rows)) {
  // Fallback: check json.rows directly
  rowsArray = json.rows;
} else {
  // Empty array as final fallback
  rowsArray = [];
}

// Now rowsArray is GUARANTEED to be an array
```

## Defensive Array Checks

⚠️ **CRITICAL**: Always ensure `rows` is an array to prevent blank pages:

```javascript
// ✅ ALWAYS add this defensive check in components
const safeRows = Array.isArray(sheet.rows) ? sheet.rows : [];

// Then use safeRows throughout the component
if (safeRows.length === 0) {
  return <p>No data</p>;
}

return safeRows.map(row => ...)
```

**Why?** If the API returns malformed data or the response structure changes, components will crash with a blank white page. Defensive checks prevent this.

## Summary

- ✅ **Always** access data via `response.data.something`
- ❌ **Never** access data via `response.something` (except for `status` and `message`)
- 🔍 **Remember**: `data` contains `data` → `response.data.data` for properties inside the data object
