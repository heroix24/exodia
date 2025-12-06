/**
 * Correlation Detection Service
 *
 * Automatically detects mathematical relationships between numeric columns
 * in Excel data. For example:
 * - grand_total = product_1_price + product_2_price
 * - profit = revenue - cost
 * - average = (a + b + c) / 3
 */

import { log } from "../utils/logger.js";

// Tolerance for floating point comparison (0.01 = 1% tolerance)
const CORRELATION_TOLERANCE = 0.01;

// Minimum rows required to detect a correlation with confidence
const MIN_ROWS_FOR_CORRELATION = 3;

// Minimum percentage of rows that must match the formula
const MIN_MATCH_PERCENTAGE = 0.95; // 95%

/**
 * Check if two numbers are approximately equal within tolerance
 */
const isApproximatelyEqual = (a, b, tolerance = CORRELATION_TOLERANCE) => {
  if (a === b) return true;
  if (a === 0 || b === 0) return Math.abs(a - b) < tolerance;
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)) < tolerance;
};

/**
 * Get numeric value from a cell, returning null if not a valid number
 */
const getNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Detect SUM correlations: target = source1 + source2 + ... + sourceN
 */
const detectSumCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  // Try all combinations of 2+ source columns
  const combineColumns = (cols, minSize = 2) => {
    const results = [];
    const combine = (start, current) => {
      if (current.length >= minSize) {
        results.push([...current]);
      }
      for (let i = start; i < cols.length; i++) {
        current.push(cols[i]);
        combine(i + 1, current);
        current.pop();
      }
    };
    combine(0, []);
    return results;
  };

  const combinations = combineColumns(sourceColumns);

  for (const sourceCols of combinations) {
    let matchCount = 0;
    let totalValidRows = 0;

    for (let i = 0; i < rows.length; i++) {
      const targetVal = targetValues[i];
      if (targetVal === null) continue;

      // Calculate sum of source columns
      let sum = 0;
      let allSourcesValid = true;

      for (const col of sourceCols) {
        const val = columnValues[col]?.[i];
        if (val === null) {
          allSourcesValid = false;
          break;
        }
        sum += val;
      }

      if (!allSourcesValid) continue;
      totalValidRows++;

      if (isApproximatelyEqual(targetVal, sum)) {
        matchCount++;
      }
    }

    if (totalValidRows >= MIN_ROWS_FOR_CORRELATION) {
      const matchPercentage = matchCount / totalValidRows;
      if (matchPercentage >= MIN_MATCH_PERCENTAGE) {
        return {
          type: "sum",
          target: targetColumn,
          sources: sourceCols,
          formula: `${targetColumn} = ${sourceCols.join(" + ")}`,
          confidence: matchPercentage,
          matchedRows: matchCount,
          totalRows: totalValidRows,
        };
      }
    }
  }

  return null;
};

/**
 * Detect DIFFERENCE correlations: target = source1 - source2
 */
const detectDifferenceCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  // Try all pairs of source columns
  for (let i = 0; i < sourceColumns.length; i++) {
    for (let j = 0; j < sourceColumns.length; j++) {
      if (i === j) continue;

      const col1 = sourceColumns[i];
      const col2 = sourceColumns[j];

      let matchCount = 0;
      let totalValidRows = 0;

      for (let k = 0; k < rows.length; k++) {
        const targetVal = targetValues[k];
        const val1 = columnValues[col1]?.[k];
        const val2 = columnValues[col2]?.[k];

        if (targetVal === null || val1 === null || val2 === null) continue;
        totalValidRows++;

        if (isApproximatelyEqual(targetVal, val1 - val2)) {
          matchCount++;
        }
      }

      if (totalValidRows >= MIN_ROWS_FOR_CORRELATION) {
        const matchPercentage = matchCount / totalValidRows;
        if (matchPercentage >= MIN_MATCH_PERCENTAGE) {
          return {
            type: "difference",
            target: targetColumn,
            sources: [col1, col2],
            formula: `${targetColumn} = ${col1} - ${col2}`,
            confidence: matchPercentage,
            matchedRows: matchCount,
            totalRows: totalValidRows,
          };
        }
      }
    }
  }

  return null;
};

/**
 * Detect PRODUCT correlations: target = source1 * source2
 */
const detectProductCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  // Try all pairs of source columns
  for (let i = 0; i < sourceColumns.length; i++) {
    for (let j = i + 1; j < sourceColumns.length; j++) {
      const col1 = sourceColumns[i];
      const col2 = sourceColumns[j];

      let matchCount = 0;
      let totalValidRows = 0;

      for (let k = 0; k < rows.length; k++) {
        const targetVal = targetValues[k];
        const val1 = columnValues[col1]?.[k];
        const val2 = columnValues[col2]?.[k];

        if (targetVal === null || val1 === null || val2 === null) continue;
        totalValidRows++;

        if (isApproximatelyEqual(targetVal, val1 * val2)) {
          matchCount++;
        }
      }

      if (totalValidRows >= MIN_ROWS_FOR_CORRELATION) {
        const matchPercentage = matchCount / totalValidRows;
        if (matchPercentage >= MIN_MATCH_PERCENTAGE) {
          return {
            type: "product",
            target: targetColumn,
            sources: [col1, col2],
            formula: `${targetColumn} = ${col1} × ${col2}`,
            confidence: matchPercentage,
            matchedRows: matchCount,
            totalRows: totalValidRows,
          };
        }
      }
    }
  }

  return null;
};

/**
 * Detect DIVISION correlations: target = source1 / source2
 */
const detectDivisionCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  // Try all pairs of source columns
  for (let i = 0; i < sourceColumns.length; i++) {
    for (let j = 0; j < sourceColumns.length; j++) {
      if (i === j) continue;

      const col1 = sourceColumns[i];
      const col2 = sourceColumns[j];

      let matchCount = 0;
      let totalValidRows = 0;

      for (let k = 0; k < rows.length; k++) {
        const targetVal = targetValues[k];
        const val1 = columnValues[col1]?.[k];
        const val2 = columnValues[col2]?.[k];

        // Skip division by zero
        if (targetVal === null || val1 === null || val2 === null || val2 === 0)
          continue;
        totalValidRows++;

        if (isApproximatelyEqual(targetVal, val1 / val2)) {
          matchCount++;
        }
      }

      if (totalValidRows >= MIN_ROWS_FOR_CORRELATION) {
        const matchPercentage = matchCount / totalValidRows;
        if (matchPercentage >= MIN_MATCH_PERCENTAGE) {
          return {
            type: "division",
            target: targetColumn,
            sources: [col1, col2],
            formula: `${targetColumn} = ${col1} ÷ ${col2}`,
            confidence: matchPercentage,
            matchedRows: matchCount,
            totalRows: totalValidRows,
          };
        }
      }
    }
  }

  return null;
};

/**
 * Detect AVERAGE correlations: target = (source1 + source2 + ... + sourceN) / N
 */
const detectAverageCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  // Try combinations of 2+ source columns
  const combineColumns = (cols, minSize = 2, maxSize = 5) => {
    const results = [];
    const combine = (start, current) => {
      if (current.length >= minSize && current.length <= maxSize) {
        results.push([...current]);
      }
      if (current.length >= maxSize) return;
      for (let i = start; i < cols.length; i++) {
        current.push(cols[i]);
        combine(i + 1, current);
        current.pop();
      }
    };
    combine(0, []);
    return results;
  };

  const combinations = combineColumns(sourceColumns);

  for (const sourceCols of combinations) {
    let matchCount = 0;
    let totalValidRows = 0;

    for (let i = 0; i < rows.length; i++) {
      const targetVal = targetValues[i];
      if (targetVal === null) continue;

      let sum = 0;
      let allSourcesValid = true;

      for (const col of sourceCols) {
        const val = columnValues[col]?.[i];
        if (val === null) {
          allSourcesValid = false;
          break;
        }
        sum += val;
      }

      if (!allSourcesValid) continue;
      totalValidRows++;

      const average = sum / sourceCols.length;
      if (isApproximatelyEqual(targetVal, average)) {
        matchCount++;
      }
    }

    if (totalValidRows >= MIN_ROWS_FOR_CORRELATION) {
      const matchPercentage = matchCount / totalValidRows;
      if (matchPercentage >= MIN_MATCH_PERCENTAGE) {
        return {
          type: "average",
          target: targetColumn,
          sources: sourceCols,
          formula: `${targetColumn} = (${sourceCols.join(" + ")}) ÷ ${
            sourceCols.length
          }`,
          confidence: matchPercentage,
          matchedRows: matchCount,
          totalRows: totalValidRows,
        };
      }
    }
  }

  return null;
};

/**
 * Detect PERCENTAGE correlations: target = source1 * percentage (e.g., tax = subtotal * 0.1)
 */
const detectPercentageCorrelation = (
  rows,
  targetColumn,
  sourceColumns,
  columnValues
) => {
  const targetValues = columnValues[targetColumn];
  if (!targetValues || targetValues.length < MIN_ROWS_FOR_CORRELATION)
    return null;

  for (const sourceCol of sourceColumns) {
    // Calculate potential percentage ratios
    const ratios = [];

    for (let i = 0; i < rows.length; i++) {
      const targetVal = targetValues[i];
      const sourceVal = columnValues[sourceCol]?.[i];

      if (targetVal === null || sourceVal === null || sourceVal === 0) continue;
      ratios.push(targetVal / sourceVal);
    }

    if (ratios.length < MIN_ROWS_FOR_CORRELATION) continue;

    // Check if all ratios are approximately the same
    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const allSameRatio = ratios.every((r) => isApproximatelyEqual(r, avgRatio));

    if (allSameRatio && avgRatio !== 1) {
      // Exclude 1:1 ratio (that would be equality)
      const percentage = (avgRatio * 100).toFixed(2);
      return {
        type: "percentage",
        target: targetColumn,
        sources: [sourceCol],
        multiplier: avgRatio,
        formula: `${targetColumn} = ${sourceCol} × ${percentage}%`,
        confidence: 1.0,
        matchedRows: ratios.length,
        totalRows: ratios.length,
      };
    }
  }

  return null;
};

/**
 * Main function to detect all correlations in a sheet
 */
export const detectCorrelations = (rows, columns) => {
  if (!rows || rows.length < MIN_ROWS_FOR_CORRELATION) {
    log.info("Not enough rows for correlation detection", {
      rowCount: rows?.length ?? 0,
    });
    return [];
  }

  // Filter to only numeric columns
  const numericColumns = columns
    .filter((col) => col.type === "number")
    .map((col) => col.name);

  if (numericColumns.length < 2) {
    log.info("Not enough numeric columns for correlation detection", {
      numericCount: numericColumns.length,
    });
    return [];
  }

  log.info("Starting correlation detection", {
    rowCount: rows.length,
    numericColumns: numericColumns,
  });

  // Pre-compute column values for efficiency
  const columnValues = {};
  for (const col of numericColumns) {
    columnValues[col] = rows.map((row) => getNumericValue(row[col]));
  }

  const correlations = [];
  const usedTargets = new Set();

  // For each potential target column, try to find correlations
  for (const targetColumn of numericColumns) {
    if (usedTargets.has(targetColumn)) continue;

    const sourceColumns = numericColumns.filter((col) => col !== targetColumn);

    // Try different correlation types in order of likelihood
    const detectors = [
      detectSumCorrelation,
      detectDifferenceCorrelation,
      detectProductCorrelation,
      detectAverageCorrelation,
      detectDivisionCorrelation,
      detectPercentageCorrelation,
    ];

    for (const detector of detectors) {
      const correlation = detector(
        rows,
        targetColumn,
        sourceColumns,
        columnValues
      );
      if (correlation) {
        correlations.push(correlation);
        usedTargets.add(targetColumn);
        log.info("Detected correlation", correlation);
        break; // Only one correlation per target column
      }
    }
  }

  return correlations;
};

/**
 * Apply correlations to calculate values for a row
 */
export const applyCorrelations = (row, correlations) => {
  if (!correlations || correlations.length === 0) return row;

  const result = { ...row };

  for (const correlation of correlations) {
    const { type, target, sources, multiplier } = correlation;

    // Get source values
    const sourceValues = sources.map((col) => getNumericValue(result[col]));

    // Skip if any source value is missing
    if (sourceValues.some((val) => val === null)) continue;

    let calculatedValue;

    switch (type) {
      case "sum":
        calculatedValue = sourceValues.reduce((a, b) => a + b, 0);
        break;
      case "difference":
        calculatedValue = sourceValues[0] - sourceValues[1];
        break;
      case "product":
        calculatedValue = sourceValues.reduce((a, b) => a * b, 1);
        break;
      case "division":
        if (sourceValues[1] !== 0) {
          calculatedValue = sourceValues[0] / sourceValues[1];
        }
        break;
      case "average":
        calculatedValue =
          sourceValues.reduce((a, b) => a + b, 0) / sourceValues.length;
        break;
      case "percentage":
        calculatedValue = sourceValues[0] * multiplier;
        break;
    }

    if (calculatedValue !== undefined) {
      // Round to 2 decimal places for cleaner output
      result[target] = Math.round(calculatedValue * 100) / 100;
    }
  }

  return result;
};

/**
 * Validate a row against correlations and return any mismatches
 */
export const validateRowCorrelations = (row, correlations) => {
  if (!correlations || correlations.length === 0) return [];

  const issues = [];

  for (const correlation of correlations) {
    const { type, target, sources, multiplier, formula } = correlation;

    const targetValue = getNumericValue(row[target]);
    if (targetValue === null) continue;

    const sourceValues = sources.map((col) => getNumericValue(row[col]));
    if (sourceValues.some((val) => val === null)) continue;

    let expectedValue;

    switch (type) {
      case "sum":
        expectedValue = sourceValues.reduce((a, b) => a + b, 0);
        break;
      case "difference":
        expectedValue = sourceValues[0] - sourceValues[1];
        break;
      case "product":
        expectedValue = sourceValues.reduce((a, b) => a * b, 1);
        break;
      case "division":
        if (sourceValues[1] !== 0) {
          expectedValue = sourceValues[0] / sourceValues[1];
        }
        break;
      case "average":
        expectedValue =
          sourceValues.reduce((a, b) => a + b, 0) / sourceValues.length;
        break;
      case "percentage":
        expectedValue = sourceValues[0] * multiplier;
        break;
    }

    if (
      expectedValue !== undefined &&
      !isApproximatelyEqual(targetValue, expectedValue)
    ) {
      issues.push({
        column: target,
        formula,
        expected: Math.round(expectedValue * 100) / 100,
        actual: targetValue,
        difference: Math.round((targetValue - expectedValue) * 100) / 100,
      });
    }
  }

  return issues;
};

export const correlationService = {
  detectCorrelations,
  applyCorrelations,
  validateRowCorrelations,
};
