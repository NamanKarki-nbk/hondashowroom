# Compare Page Fixes

The compare page has several visual and alignment issues that need to be addressed to make it perfect.

## Open Questions
None. The issues stem from CSS grid misalignments and array ordering.

## Proposed Changes

### Component: Compare Page Layout

#### [MODIFY] CompareClient.tsx
1. **Fix Column Alignment:**
   - **Current State:** The header with vehicle images uses a 4-column grid (`grid-cols-4`), but the specification rows below use a 5-column grid (`grid-cols-5` - 1 for the label + 4 for the vehicles). This causes the vehicle images to be misaligned with their respective data columns.
   - **Fix:** Update the header to also use a 5-column grid. I will add an empty placeholder cell in the first column so the 4 vehicle slots align perfectly above their data columns.
2. **Fix Features Table Grid:**
   - **Current State:** The static "Features" table rows incorrectly render 6 columns (1 label + 1 empty div + 4 vehicle slots) inside a 5-column grid, causing unwanted line wrapping.
   - **Fix:** Remove the stray empty `<div>` in the Features row so it correctly matches the 5-column layout.
3. **Enforce Exact Tab Ordering:**
   - **Current State:** The tabs (Engine, Tyres, etc.) are ordered randomly based on how the database returns them.
   - **Fix:** Add a sorting function to enforce your specific requested order: `Body Dimensions` -> `Engine` -> `Transmission` -> `Tyres and Brakes` -> `Frames & Suspension` -> `Electricals`.

## Verification Plan

### Manual Verification
- Check the Compare page in the browser to ensure the vehicle images in the top row perfectly align with the data columns below them.
- Ensure the tabs follow the exact requested order.
- Ensure the Features table rows are perfectly aligned and do not wrap improperly.
