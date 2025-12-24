# Executive P&L Report Dashboard - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Global Filters](#global-filters)
3. [KPI Metrics Reference](#kpi-metrics-reference)
4. [SDK Methods Reference](#sdk-methods-reference)
5. [Component & Widget IDs Reference](#component--widget-ids-reference)
6. [Dashboard Initialization Script](#dashboard-initialization-script)
7. [KPI Tile Value Updates](#kpi-tile-value-updates)
8. [Interactive Metric Card Click Handler](#interactive-metric-card-click-handler)
9. [Trend Analysis Sections](#trend-analysis-sections)
10. [Filter Modal Script](#filter-modal-script)
11. [Export Scripts](#export-scripts)
12. [Data Structure & Context Management](#data-structure--context-management)

---

## Overview

The Executive P&L Report Dashboard is a vanilla JavaScript application using jQuery and a proprietary Dashboard SDK. It provides comprehensive Profit & Loss analytics, tracking key financial metrics including GMV (Gross Merchandise Value), Revenue, Expenses, EBITDA, and Net Profit across different time periods and product categories.

### Technology Stack

- **Vanilla JavaScript**: Core application logic
- **jQuery**: AJAX requests and DOM manipulation
- **Dashboard SDK**: Widget management, context handling, component visibility
- **HTML/CSS**: Frontend structure and styling

### Architecture Principles

1. **Widget-Based Components**: All UI elements are widgets identified by unique IDs
2. **Connection-Based Data**: Data connections (`C_1`, `C_2`, etc.) link widgets to data sources
3. **Context-Driven State**: SDK context stores application state (filters, selected metric, view preferences)
4. **Global Variable Management**: Shared variables accessible across widgets via global variable widget
5. **Group-Based Visibility**: Component groups enable bulk show/hide operations
6. **Interactive Metric Cards**: Clickable KPI cards trigger detailed trend analysis views

---

## Global Filters

The Executive P&L Report Dashboard provides global filtering capabilities that allow users to refine financial data based on various criteria.

### Available Filters

**Label Filter:**
- Text input field in the dashboard header
- Allows custom label or identifier filtering
- Stored in SDK context or global variables
- Widget ID: `input_label` (or similar)

**Date Range:**
- Filters data between the specified start and end dates
- Supports predefined ranges and custom date selection
- **Date Format**:
  - **Display Format**: `DD-MM-YYYY` (e.g., "02-01-2024") - shown in date picker inputs
  - **Storage Format**: `YYYY-MM-DD` (e.g., "2024-01-02") - ISO 8601 compliant, used internally and for API calls
- Stored in SDK context as `sdt` (start date) and `edt` (end date)
- Also stored in global variables as `Value1` (start date) and `Value2` (end date)
- Default start date: `'2024-01-01'` (January 1, 2024)
- Default end date: Yesterday (calculated dynamically)

**Year:**
- Filters data by selected year
- Dropdown selection in filter modal
- Stored in global variable `Value_Year` in `label41` widget
- Widget ID: `hfilter_year`
- Placeholder text: "Year"
- Affects all KPI tiles and trend analysis sections

**Month:**
- Filters data by selected month
- Dropdown selection in filter modal
- Stored in global variable `Value_Month` in `label41` widget
- Widget ID: `hfilter_month`
- Placeholder text: "Year" (when no selection made)
- Affects all KPI tiles and trend analysis sections

**Market Profile:**
- Filters data by market profile
- Dropdown selection in filter modal
- Stored in global variable `Value_MarketProfile` in `label41` widget
- Widget ID: `hfilter_market_profile`
- Placeholder text: "Year" (when no selection made)
- Affects all KPI tiles and trend analysis sections

**Branch:**
- Filters data by branch location
- Dropdown selection in filter modal
- Stored in global variable `Value_Branch` in `label41` widget
- Widget ID: `hfilter_branch`
- Placeholder text: "Year" (when no selection made)
- Affects all KPI tiles and trend analysis sections

**Channel:**
- Filters data by sales channel
- Dropdown selection in filter modal
- Stored in global variable `Value_Channel` in `label41` widget
- Widget ID: `hfilter_channel`
- Placeholder text: "Year" (when no selection made)
- Affects all KPI tiles and trend analysis sections

**Year Comparison:**
- Two radio button options:
  - **"Current Year (2025)"**: Shows data for the current year (selected by default)
  - **"Last Year (2024)"**: Shows data for the previous year
- Stored in SDK context as `year_selection` or `selected_year`
- Affects trend analysis data display

**Frequency Selection:**
- Two radio button options:
  - **"Quarterly"**: Aggregates data by quarters
  - **"Monthly"**: Aggregates data by months (selected by default)
- Stored in SDK context as `frequency` or `data_frequency`
- Affects how trend data is grouped and displayed

**View Type Selection:**
- Two button options:
  - **"Chart"**: Displays data as a visual chart/graph
  - **"Grid"**: Displays data in tabular format (selected by default)
- Stored in SDK context as `view_type` or `display_mode`
- Toggles between chart and grid visualization

### Filter Application

**Filter Button:**
- **Trigger**: Clicking the filter button in the dashboard header
- Opens filter modal for advanced filtering options
- Widget ID: `btn_filter` or `svg_filter`

**Filter State Management:**
- Filter selections stored in SDK context for persistence
- Global variables updated via `sdk.updateGlobalVariable()`
- Context variables updated via `sdk.setContext(key, value)`
- Filter changes trigger connection reloads to refresh dashboard data

**Filter Reset:**
- Default date range: Custom Date Range (January 1, 2024 to yesterday)
- Default year: Current year or no selection (placeholder shown)
- Default month: No selection (placeholder shown)
- Default market profile: No selection (placeholder shown)
- Default branch: No selection (placeholder shown)
- Default channel: No selection (placeholder shown)
- Default pagination: 10 records per page, starting from page 1
- Reset occurs on dashboard initialization or when filters are cleared
- All filter dropdowns show placeholder text when no selection made

### Filter Impact on Data

**Date Range Impact:**
- All KPI tiles recalculate values based on selected date range
- Trend analysis sections filter entries by selected period
- Data filtered between start date and end date

**Filter Impact:**
- All filters (Year, Month, Market Profile, Branch, Channel) affect both KPI tiles and trend analysis sections
- KPI values recalculate based on selected filters
- Trend analysis sections filter entries based on all selected filter criteria
- Multiple filters can be combined for refined data analysis
- When no filter is selected, all data is shown (or default filters applied)

**Year Comparison Impact:**
- All KPI tiles recalculate values based on selected year
- Trend analysis sections update to show selected year's data
- Comparison data available for year-over-year analysis

**Frequency Impact:**
- Trend data aggregated by selected frequency (Monthly or Quarterly)
- Grid/chart displays data points based on frequency selection
- Affects granularity of trend analysis

**View Type Impact:**
- Chart view: Visual representation of trend data
- Grid view: Tabular representation with sortable columns
- Switching between views maintains same data set

---

## KPI Metrics Reference

This section provides detailed descriptions of all Key Performance Indicators (KPIs) displayed in the Executive P&L Report Dashboard.

### KPI Cards

The dashboard displays five interactive KPI cards that users can click to view detailed trend analysis. Each card shows a metric value and an icon.

#### 1. GMV (Gross Merchandise Value)

**Description:**
This metric displays the total Gross Merchandise Value, representing the total value of merchandise sold through the platform before accounting for any deductions.

**Attributes:**
- `gmv` (numeric)
  - The total GMV value
  - Includes all transaction values
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `--` when no data is selected or loaded

**Visual Elements:**
- **Icon**: Chart icon in the top right corner of the card
- **Color Scheme**: Typically displayed in informational color
- **Format**: Abbreviated format (K/M/B) for readability
- **Interactive**: Clickable card that triggers detailed GMV trend analysis

**Widget IDs:**
- `label_gmv_value`: GMV KPI tile display value
- `icon_gmv`: GMV icon widget
- `card_gmv`: GMV card container (clickable)

**Data Source:**
- Aggregated from transaction data
- Filtered by selected year, date range, and other filters

**Click Behavior:**
- When clicked, displays "GMV - Monthly Trend" section
- Shows "Product Breakdown - GMV" section
- Updates trend analysis charts/grids with GMV-specific data

#### 2. REVENUE

**Description:**
This metric displays the total revenue generated, representing the actual income from sales after accounting for returns, discounts, and other deductions.

**Attributes:**
- `revenue` (numeric)
  - The total revenue value
  - Net revenue after deductions
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `--` when no data is selected or loaded

**Visual Elements:**
- **Icon**: Percentage icon in the top right corner of the card
- **Color Scheme**: Typically displayed in success/green color
- **Format**: Abbreviated format (K/M/B) for readability
- **Interactive**: Clickable card that triggers detailed Revenue trend analysis

**Widget IDs:**
- `label_revenue_value`: Revenue KPI tile display value
- `icon_revenue`: Revenue icon widget
- `card_revenue`: Revenue card container (clickable)

**Data Source:**
- Calculated from sales transactions
- Filtered by selected year, date range, and other filters

**Click Behavior:**
- When clicked, displays "Revenue - Monthly Trend" section
- Shows "Product Breakdown - Revenue" section
- Updates trend analysis charts/grids with Revenue-specific data

#### 3. EXPENSES

**Description:**
This metric displays the total expenses incurred, representing all costs associated with operations, including operational expenses, cost of goods sold, and other expenditures.

**Attributes:**
- `expenses` (numeric)
  - The total expenses value
  - Includes all operational costs
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `--` when no data is selected or loaded

**Visual Elements:**
- **Icon**: Wallet/money icon in the top right corner of the card
- **Color Scheme**: Typically displayed in warning/orange color
- **Format**: Abbreviated format (K/M/B) for readability
- **Interactive**: Clickable card that triggers detailed Expenses trend analysis

**Widget IDs:**
- `label_expenses_value`: Expenses KPI tile display value
- `icon_expenses`: Expenses icon widget
- `card_expenses`: Expenses card container (clickable)

**Data Source:**
- Aggregated from expense transactions
- Filtered by selected year, date range, and other filters

**Click Behavior:**
- When clicked, displays "Expenses - Monthly Trend" section
- Updates trend analysis charts/grids with Expenses-specific data

#### 4. EBITDA

**Description:**
This metric displays Earnings Before Interest, Taxes, Depreciation, and Amortization, representing a measure of operating performance.

**Attributes:**
- `ebitda` (numeric)
  - The EBITDA value
  - Calculated as: Revenue - Operating Expenses (excluding interest, taxes, depreciation, amortization)
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `--` when no data is selected or loaded

**Visual Elements:**
- **Icon**: Bar chart icon in the top right corner of the card
- **Color Scheme**: Typically displayed in informational color
- **Format**: Abbreviated format (K/M/B) for readability
- **Interactive**: Clickable card that triggers detailed EBITDA trend analysis

**Widget IDs:**
- `label_ebitda_value`: EBITDA KPI tile display value
- `icon_ebitda`: EBITDA icon widget
- `card_ebitda`: EBITDA card container (clickable)

**Data Source:**
- Calculated from revenue and expense data
- Filtered by selected year, date range, and other filters

**Click Behavior:**
- When clicked, displays "EBITDA - Monthly Trend" section
- Updates trend analysis charts/grids with EBITDA-specific data

#### 5. NET PROFIT

**Description:**
This metric displays the net profit, representing the final profit after all expenses, taxes, and deductions have been accounted for.

**Attributes:**
- `net_profit` (numeric)
  - The net profit value
  - Calculated as: Revenue - Total Expenses - Taxes
  - Can be negative (loss) or positive (profit)
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `--` when no data is selected or loaded

**Visual Elements:**
- **Icon**: Line graph icon in the top right corner of the card
- **Color Scheme**: 
  - Positive values: Typically displayed in green/success color
  - Negative values: Typically displayed in red/warning color
- **Format**: Abbreviated format (K/M/B) for readability
- **Sign Display**: Negative sign displayed prominently for negative values
- **Interactive**: Clickable card that triggers detailed Net Profit trend analysis

**Widget IDs:**
- `label_net_profit_value`: Net Profit KPI tile display value
- `icon_net_profit`: Net Profit icon widget
- `card_net_profit`: Net Profit card container (clickable)

**Data Source:**
- Calculated from revenue, expenses, and tax data
- Filtered by selected year, date range, and other filters

**Click Behavior:**
- When clicked, displays "Net Profit - Monthly Trend" section
- Updates trend analysis charts/grids with Net Profit-specific data

### KPI Calculation Methods

**Value Formatting:**
- Large numbers (≥ 1 Billion): Formatted as `X.XB` (e.g., `1.5B`)
- Medium numbers (≥ 1 Million): Formatted as `X.XM` (e.g., `3.8M`)
- Small numbers (≥ 1 Thousand): Formatted as `X.XK` (e.g., `5.7K`)
- Very small numbers (< 1 Thousand): Displayed with 1 decimal place
- No data: Displays `--` placeholder

**Currency Formatting:**
- Values prefixed with currency symbol (currency determined by system configuration):
  - UAE (AED): `AED X.X`
  - India (INR): `INR X.X`
  - Qatar (QAR): `QAR X.X`
  - Saudi Arabia (SAR): `SAR X.X`

**Negative Value Handling:**
- Negative values displayed with minus sign prefix
- Net Profit can be negative (indicating a loss)
- Negative values typically styled in red/warning color

**Interactive Card Behavior:**
- Cards are clickable and trigger detailed trend analysis
- Selected card may be highlighted or styled differently
- Clicking a card updates trend analysis sections below
- GMV and Revenue cards trigger Product Breakdown section display

---

## SDK Methods Reference

### Context Management

#### `sdk.getContext(key)`
Retrieves a value from SDK context storage.

**Parameters:**
- `key` (string): Context key name

**Returns:** Stored value or `undefined`

**Usage:**
```javascript
var selectedMetric = sdk.getContext('selected_metric');
var yearSelection = sdk.getContext('year_selection');
var userInfo = sdk.getContext('dashboard_user');
```

#### `sdk.setContext(key, value)`
Stores a value in SDK context.

**Parameters:**
- `key` (string): Context key name
- `value` (any): Value to store

**Usage:**
```javascript
sdk.setContext('selected_metric', 'GMV');
sdk.setContext('year_selection', '2025');
sdk.setContext('frequency', 'Monthly');
```

### Widget Management

#### `sdk.getWidget(widgetId)`
Retrieves widget object for property access and manipulation.

**Parameters:**
- `widgetId` (string): Widget ID

**Returns:** Widget object

**Usage:**
```javascript
var table = sdk.getWidget('datagrid_trend');
table.m_pageSize = 50;
table.draw();
```

#### `sdk.reload(widgetIds)`
Reloads data connections for specified widgets.

**Parameters:**
- `widgetIds` (array): Array of widget/connection IDs

**Usage:**
```javascript
sdk.reload(['C_1', 'C_2', 'C_3']);
```

#### `sdk.setValue(widgetId, value)`
Sets text value for label widgets.

**Parameters:**
- `widgetId` (string): Label widget ID
- `value` (string): Text to display

**Usage:**
```javascript
sdk.setValue('label_gmv_value', 'AED 3.8M');
```

### Component Visibility

#### `sdk.showComponent(componentIds)`
Shows individual components.

**Parameters:**
- `componentIds` (array): Array of component IDs

**Usage:**
```javascript
sdk.showComponent(['label1', 'icon1']);
```

#### `sdk.hideComponent(componentIds)`
Hides individual components.

**Parameters:**
- `componentIds` (array): Array of component IDs

**Usage:**
```javascript
sdk.hideComponent(['label1', 'icon1']);
```

#### `sdk.showGroup(groupNames)`
Shows component groups.

**Parameters:**
- `groupNames` (array): Array of group names

**Usage:**
```javascript
sdk.showGroup(['trend_section', 'product_breakdown']);
```

#### `sdk.hideGroup(groupNames)`
Hides component groups.

**Parameters:**
- `groupNames` (array): Array of group names

**Usage:**
```javascript
sdk.hideGroup(['product_breakdown']);
```

### Global Variables

#### `sdk.updateGlobalVariable(widgetId, variables, triggerReload)`
Updates global variables stored in a widget.

**Parameters:**
- `widgetId` (string): Widget ID storing global variables
- `variables` (object): Key-value pairs of variables to update
- `triggerReload` (boolean): Whether to trigger automatic reload

**Usage:**
```javascript
sdk.updateGlobalVariable('label41', {'Value1': '2024-01-01', 'Value2': '2024-01-31'}, false);
```

### Styling

#### `sdk.applyStyle(selector, property, value)`
Applies a single CSS style to elements.

**Parameters:**
- `selector` (string): CSS selector
- `property` (string): CSS property name
- `value` (string): CSS property value

**Usage:**
```javascript
var divId = sdk.getDivIdFromComponetId('card_gmv');
sdk.applyStyle('#' + divId, "border", "2px solid #007bff");
```

#### `sdk.applyStyles(selector, styles)`
Applies multiple CSS styles to elements.

**Parameters:**
- `selector` (string): CSS selector
- `styles` (object): Object with CSS property-value pairs

**Usage:**
```javascript
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1310px" });
```

#### `sdk.changeBGColor(widgetId, colors)`
Changes the background color of a widget.

**Parameters:**
- `widgetId` (string): Widget ID
- `colors` (array): Array of color values `[startColor, endColor]` for gradient, or `[color, color]` for solid color

**Returns:** None

**Usage:**
```javascript
sdk.changeBGColor('box174', ['#DBEAFE', '#DBEAFE']);  // Solid light blue
sdk.changeBGColor('box46', ['#ffffff', '#ffffff']);    // Solid white
```

#### `sdk.getLayoutType()`
Retrieves the current layout type of the dashboard.

**Parameters:** None

**Returns:** Layout type string (`"AbsoluteLayout"`, `"MobileLayout"`, or `"TabletLayout"`)

**Usage:**
```javascript
if (sdk.getLayoutType() === "AbsoluteLayout") {
    // Apply desktop layout styles
} else if (sdk.getLayoutType() === "MobileLayout") {
    // Apply mobile layout styles
} else if (sdk.getLayoutType() === "TabletLayout") {
    // Apply tablet layout styles
}
```

#### `sdk.getDivIdFromComponetId(componentId)`
Retrieves the div ID for a component widget.

**Parameters:**
- `componentId` (string): Component/widget ID

**Returns:** Div ID string

**Usage:**
```javascript
var divId = sdk.getDivIdFromComponetId('box47');
sdk.applyStyle('#draggableDiv' + divId, 'height', '1300px');
```

### Export Functions

#### `sdk.excelExport(widgetIds, chartNames, filterParams, reportTitle)`
Exports data to Excel format.

**Parameters:**
- `widgetIds` (array): Array of widget IDs to export
- `chartNames` (array): Array of display names
- `filterParams` (array): Array of filter parameter arrays
- `reportTitle` (string): Excel file title

**Usage:**
```javascript
sdk.excelExport(
    ['datagrid_trend', 'datagrid_product'],
    ['GMV Monthly Trend', 'Product Breakdown'],
    [['startdate', 'enddate', 'year', 'frequency']],
    "Executive P&L Report"
);
```

#### `sdk.pdfExport(widgetIds, chartNames, filterParams, reportTitle)`
Exports data to PDF format.

**Parameters:**
- `widgetIds` (array): Array of widget IDs to export
- `chartNames` (array): Array of display names
- `filterParams` (array): Array of filter parameter arrays
- `reportTitle` (string): PDF file title

**Usage:**
```javascript
sdk.pdfExport(
    ['datagrid_trend'],
    ['GMV Monthly Trend'],
    [['startdate', 'enddate', 'year']],
    "Executive P&L Report"
);
```

---

## Component & Widget IDs Reference

### Connection IDs (Data Sources)

**KPI Connections:**
- `C_1` to `C_5`: 5 connections for KPI metrics (GMV, Revenue, Expenses, EBITDA, Net Profit)

**Trend Analysis Connections:**
- `C_11`: Connection for trend analysis data (used for all metrics)
- `C_13`: Connection for product breakdown data (used only for GMV and Revenue)

### Chart Widget IDs

**KPI Cards:**
- `label_gmv_value`: GMV value display
- `label_revenue_value`: Revenue value display
- `label_expenses_value`: Expenses value display
- `label_ebitda_value`: EBITDA value display
- `label_net_profit_value`: Net Profit value display
- `icon_gmv`: GMV icon widget
- `icon_revenue`: Revenue icon widget
- `icon_expenses`: Expenses icon widget
- `icon_ebitda`: EBITDA icon widget
- `icon_net_profit`: Net Profit icon widget
- `card_gmv`: GMV card container (clickable)
- `card_revenue`: Revenue card container (clickable)
- `card_expenses`: Expenses card container (clickable)
- `card_ebitda`: EBITDA card container (clickable)
- `card_net_profit`: Net Profit card container (clickable)

**Trend Analysis Tables:**
- `datagrid48`: Monthly/Quarterly trend data grid widget
- `datagrid68`: Product breakdown data grid widget

**Chart Widgets:**
- `timeline48`: Trend analysis chart widget (timeline/chart visualization)

### Component Groups

- `kpi_cards`: KPI cards group
- `trend_section`: Trend analysis section group
- `product_breakdown`: Product breakdown section group (shown only for GMV and Revenue)
- `filter`: Filter modal group
- `instruction_banner`: Instruction banner group

### Header Components

- `label_title`: Dashboard title "Executive P&L Report"
- `input_label`: Label input field
- `btn_filter`: Filter button
- `svg_export`: Excel export icon
- `svg_pdf`: PDF export icon
- `svg_share`: Share/send icon

### Filter Components

**Filter Modal:**
- `box_filter_modal`: Filter modal container (or `box229` or similar)
- `label_cancel`: Cancel button
- `label_apply`: Apply button
- `icon_close`: Close button (X icon) in top right corner

**Filter Dropdowns (with border styling):**
- `hfilter_year`: Year dropdown widget (border: `1px solid #7A7A7A`)
- `hfilter_month`: Month dropdown widget (border: `1px solid #7A7A7A`)
- `hfilter_market_profile`: Market Profile dropdown widget (border: `1px solid #7A7A7A`)
- `hfilter_branch`: Branch dropdown widget (border: `1px solid #7A7A7A`)
- `hfilter_channel`: Channel dropdown widget (border: `1px solid #7A7A7A`)

**Year Comparison (in Trend Analysis Section):**
- `radio_current_year`: Current Year (2025) radio button
- `radio_last_year`: Last Year (2024) radio button

**Frequency Selection (in Trend Analysis Section):**
- `radio_quarterly`: Quarterly radio button
- `radio_monthly`: Monthly radio button

**View Type Selection (in Trend Analysis Section):**
- `btn_chart`: Chart view button
- `btn_grid`: Grid view button

**Global Variable Widget:**
- `label41`: Widget storing global variables (`Value1`, `Value2`, `Value_Year`, `Value_Month`, `Value_MarketProfile`, `Value_Branch`, `Value_Channel`, `Value_SK`, `Value_LT`, `Value_SelectedMetric`)

### Trend Analysis Components

**GMV - Monthly Trend Section:**
- `label43`: Section title label (e.g., "GMV - Monthly Trend")
- `datagrid48`: Trend data grid widget
- `timeline48`: Trend chart/timeline widget

**Product Breakdown Section:**
- `label66`: Section title label (e.g., "Product Breakdown - GMV")
- `datagrid68`: Product breakdown data grid widget

**Container Boxes:**
- `box47`: Container box for trend section (height adjusted based on layout type)
- `box58`: Container box for product breakdown section (height adjusted based on layout type)

**KPI Card Highlight Boxes:**
- `box174`: Highlight box for GMV card (background color changes to `#DBEAFE` when selected)
- `box181`: Highlight box for Revenue card (background color changes to `#DBEAFE` when selected)
- `box59`: Highlight box for Expenses card (background color changes to `#DBEAFE` when selected)
- `box_EN`: Highlight box for EBITDA card (background color changes to `#DBEAFE` when selected)
- `box46`: Highlight box for Net Profit card (background color changes to `#DBEAFE` when selected)

**Grid Action Icons:**
- `icon_filter`: Filter icon (stacked vertically on right side of grid)
- `icon_sort`: Sort icon
- `icon_function`: Function (fx) icon
- `icon_close`: Close/remove icon

### Export Components

- `svg_export`: Excel export icon (green)
- `svg_pdf`: PDF export icon (red)
- `svg_share`: Share/send icon (yellow)

---

## Dashboard Initialization Script

### Purpose

Executes on page load to set default filters, configure widget properties, initialize dashboard state, style components, and prepare the dashboard for user interaction.

### Execution Flow

```
Page Load
    ↓
Hide Filter Modal and Components
    ↓
Apply Border Styling to Filter Dropdowns
    ↓
Date Formatting Utility Setup
    ↓
Calculate Default Date Range
    ↓
Set SDK Context Variables
    ↓
Set Global Variables (label41)
    ↓
Configure Pagination and Page Display
    ↓
Set Date Tab Selection
    ↓
Reset First Load Flag (Delayed)
```

### Complete Initialization Script

```javascript
// Hide filter modal and specific components
sdk.hideGroup(['filter']);
sdk.hideComponent(['box57']);

// Apply border styling to filter dropdown components
var a = sdk.getDivIdFromComponetId('hfilter25');
sdk.applyStyle('#' + a + ' div', "border", "1px solid #7A7A7A");

var b = sdk.getDivIdFromComponetId('hfilter33');
sdk.applyStyle('#' + b + ' div', "border", "1px solid #7A7A7A");

var c = sdk.getDivIdFromComponetId('hfilter34');
sdk.applyStyle('#' + c + ' div', "border", "1px solid #7A7A7A");

var d = sdk.getDivIdFromComponetId('hfilter36');
sdk.applyStyle('#' + d + ' div', "border", "1px solid #7A7A7A");

var e = sdk.getDivIdFromComponetId('hfilter38');
sdk.applyStyle('#' + e + ' div', "border", "1px solid #7A7A7A");

// Date formatting utility function
function formatDate(date) {
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD" format
}

// Get today's date
var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Set default date range
// Start date: Fixed to January 1, 2024
var lastDayStart = '2024-01-01';
// End date: Yesterday (excludes today)
var lastDayEnd = formatDate(yesterday);

// Set SDK context variables
sdk.setContext('cdc', true);                    // Custom date check flag (true = custom date selected)
sdk.setContext('adg', false);                    // Additional flag
sdk.setContext('skip', '0');                     // Pagination skip value (start from first record)
sdk.setContext('sdt', '2024-01-01');            // Start date (YYYY-MM-DD)
sdk.setContext('edt', lastDayEnd);               // End date (YYYY-MM-DD)
sdk.setContext('firstLoad', true);               // First load flag (indicates initial page load)

// Set global variables in label41 widget
sdk.updateGlobalVariable('label41', {'Value1': lastDayStart}, false);        // Start date
sdk.updateGlobalVariable('label41', {'Value2': lastDayEnd}, false);        // End date
sdk.updateGlobalVariable('label41', {'Value_DS': 'ExistingMB'}, false);   // Data source filter
sdk.updateGlobalVariable('label41', {'Value_SE': 'Balu Mani'}, false);      // Sales Executive filter
sdk.updateGlobalVariable('label41', {'Value_FE': 'Shishir S Nair'}, false); // Finance Executive filter
sdk.updateGlobalVariable('label41', {'Value_OG': 'No Organization Group'}, false);  // Organization Group filter
sdk.updateGlobalVariable('label41', {'Value_ORG': '14688'}, false);         // Organization ID filter
sdk.updateGlobalVariable('label41', {'Value_SK': '0'}, false);               // Pagination offset (start from 0)
sdk.updateGlobalVariable('label41', {'Value_LT': '10'}, false);              // Limit value (10 records per page)

// Set additional SDK context variables
sdk.setContext('init_load', 'Yes');              // Initial load flag
sdk.setContext('skip_count', 0);                  // Skip count for pagination
sdk.setContext('page_size', 10);                  // Page size (10 records per page)
sdk.setContext('page_number', 1);                 // Current page number (starts at 1)
sdk.setValue('label50', 'Showing records of page number : ' + sdk.getContext('page_number'));
sdk.setContext('date_tab_selected', 'custom_date');  // Indicates custom date range is selected

// Reset first load flag after 3 seconds
// This allows initial data load to complete before enabling user interactions
setTimeout(function() {
    sdk.setContext('firstLoad', false);
}, 3000);
```

### Key Implementation Details

**1. Component Visibility Management**
- **Hidden Groups**: `filter` (filter modal group)
- **Hidden Components**: `box57` (specific container component)
- Filter modal hidden by default on page load

**2. Filter Dropdown Styling**
- Applies border styling to 5 filter dropdown components:
  - `hfilter25`: Border color `#7A7A7A` (gray)
  - `hfilter33`: Border color `#7A7A7A`
  - `hfilter34`: Border color `#7A7A7A`
  - `hfilter36`: Border color `#7A7A7A`
  - `hfilter38`: Border color `#7A7A7A`
- Border style: `1px solid #7A7A7A`
- Applied to `div` elements within each filter dropdown

**3. Date Formatting Utility**
```javascript
function formatDate(date) {
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD" format
}
```
- Uses `toISOString()` method to get ISO date string
- Splits on `'T'` and takes first part to get date only
- Returns `YYYY-MM-DD` format

**4. Default Date Range Calculation**
- **Start Date**: Fixed to `'2024-01-01'` (January 1, 2024)
- **End Date**: Yesterday (calculated dynamically, excludes today)
- Uses `formatDate()` utility to format end date
- Handles month/year boundaries automatically

**5. SDK Context Variables**
- `cdc`: Custom date check flag (`true` = custom date selected)
- `adg`: Additional flag (`false`)
- `skip`: Pagination skip value (`'0'` = start from first record)
- `sdt`: Start date (`'2024-01-01'`)
- `edt`: End date (yesterday's date in `YYYY-MM-DD` format)
- `firstLoad`: First load flag (`true` initially, reset to `false` after 3 seconds)
- `init_load`: Initial load flag (`'Yes'`)
- `skip_count`: Skip count for pagination (`0`)
- `page_size`: Page size (`10` records per page)
- `page_number`: Current page number (`1`)
- `date_tab_selected`: Date tab selection (`'custom_date'`)

**6. Global Variables Setup (label41 widget)**
- `Value1`: Start date (`'2024-01-01'`)
- `Value2`: End date (yesterday's date)
- `Value_DS`: Data source filter (`'ExistingMB'`)
- `Value_SE`: Sales Executive filter (`'Balu Mani'`)
- `Value_FE`: Finance Executive filter (`'Shishir S Nair'`)
- `Value_OG`: Organization Group filter (`'No Organization Group'`)
- `Value_ORG`: Organization ID filter (`'14688'`)
- `Value_SK`: Pagination offset (`'0'` = start from first record)
- `Value_LT`: Limit value (`'10'` = 10 records per page)

**7. Pagination Configuration**
- **Page Size**: 10 records per page
- **Current Page**: Page 1 (first page)
- **Skip Count**: 0 (no records skipped)
- **Page Display**: Updates `label50` with current page number
- Format: "Showing records of page number : 1"

**8. First Load Flag Management**
- `firstLoad` set to `true` initially
- Reset to `false` after 3 seconds using `setTimeout()`
- Allows initial data load to complete before enabling user interactions
- Prevents premature user actions during initial load

**9. Date Tab Selection**
- `date_tab_selected` set to `'custom_date'`
- Indicates that custom date range is selected by default
- Used to control date range selection UI state

### Widget IDs Reference

**Filter Components:**
- `hfilter25`: Filter dropdown widget 1 (border: `1px solid #7A7A7A`)
- `hfilter33`: Filter dropdown widget 2 (border: `1px solid #7A7A7A`)
- `hfilter34`: Filter dropdown widget 3 (border: `1px solid #7A7A7A`)
- `hfilter36`: Filter dropdown widget 4 (border: `1px solid #7A7A7A`)
- `hfilter38`: Filter dropdown widget 5 (border: `1px solid #7A7A7A`)
- `box57`: Container component (hidden by default)

**Display Components:**
- `label50`: Page number display label (shows "Showing records of page number : X")
- `label41`: Global variable widget storing filter values (`Value1`, `Value2`, `Value_DS`, `Value_SE`, `Value_FE`, `Value_OG`, `Value_ORG`, `Value_SK`, `Value_LT`)

**Component Groups:**
- `filter`: Filter modal group (hidden by default)

### Execution Notes

- Script executes immediately on page load
- Filter modal hidden by default
- Custom date range selected by default (January 1, 2024 to yesterday)
- Default pagination: 10 records per page, starting from page 1
- Default filters applied: Data source (`'ExistingMB'`), Sales Executive (`'Balu Mani'`), Finance Executive (`'Shishir S Nair'`), Organization Group (`'No Organization Group'`), Organization ID (`'14688'`)
- First load flag prevents user interactions for first 3 seconds
- Border styling applied to all filter dropdowns for consistent appearance
- All date calculations handle month/year boundaries automatically
- Page number display updated on initialization

---

## KPI Tile Value Updates

### Purpose

Handles dynamic value updates for KPI tiles when data changes. Formats numeric values with currency symbols and abbreviates large numbers (K/M/B format) for better readability.

### Trigger

Executes when widget data changes (`changedItem` event), typically after connection reload or filter updates.

### Value Formatting Utility

```javascript
function formatValue(val) {
    if (val >= 1_000_000_000) {
        return (val / 1_000_000_000).toFixed(1) + 'B';  // Billions
    } else if (val >= 1_000_000) {
        return (val / 1_000_000).toFixed(1) + 'M';      // Millions
    } else if (val >= 1_000) {
        return (val / 1_000).toFixed(1) + 'K';         // Thousands
    } else {
        return val.toFixed(1);                          // Less than 1000
    }
}
```

**Formatting Rules:**
- **≥ 1 Billion**: Divides by 1,000,000,000 and appends `'B'` (e.g., `1.5B`)
- **≥ 1 Million**: Divides by 1,000,000 and appends `'M'` (e.g., `3.8M`)
- **≥ 1 Thousand**: Divides by 1,000 and appends `'K'` (e.g., `5.7K`)
- **< 1 Thousand**: Displays with 1 decimal place (e.g., `123.4`)
- **No Data**: Displays `'--'` placeholder

### Implementation Logic

**1. Data Extraction:**
```javascript
if((changedItem.attributes.data).length > 0) {
    var val = changedItem.attributes.data[0].gmv;  // or revenue, expenses, etc.
    // ... processing
} else {
    var val = '--';  // No data available
}
```

**2. Currency Determination:**
```javascript
// Currency is determined by system configuration or data source
// Default currency is typically AED (UAE Dirham)
var currency = 'AED'; // Default currency
// Currency may be retrieved from data or system settings
```

**3. Currency-Based Value Formatting:**
```javascript
// Format value with currency prefix
if (val !== '--' && typeof val === 'number') {
    val = currency + ' ' + formatValue(val);
    // Example: 'AED 3.8M'
} else {
    val = '--';  // Keep placeholder if no data
}
```

**4. Negative Value Handling:**
```javascript
if (val < 0 && typeof val === 'number') {
    val = '-' + currency + ' ' + formatValue(Math.abs(val));  // Ensure negative sign displayed
    // Apply red/warning styling
}
```

**5. Value Assignment:**
```javascript
sdk.setValue('label_gmv_value', val);
// or label_revenue_value, label_expenses_value, etc.
```

### Key Features

1. **Automatic Formatting**: Large numbers automatically abbreviated for better readability
2. **Currency Awareness**: Values prefixed with appropriate currency symbol (determined by system configuration)
3. **Fallback Handling**: Displays `'--'` when no data available
4. **Negative Value Support**: Properly handles and displays negative values (e.g., Net Profit losses)
5. **Currency Default**: Default currency is typically AED (UAE Dirham)
6. **Placeholder Display**: Shows `'--'` until data is loaded

---

## Interactive Metric Card Click Handler

### Purpose

Handles click events on KPI metric cards to display detailed trend analysis. Updates trend sections, shows/hides product breakdown based on selected metric, and reloads data connections.

### Trigger

Executes when a KPI card is clicked (`click` event on card widgets).

### Click Behavior Logic

**1. GMV Card Click:**
```javascript
var val = changedItem.attributes.Value;
sdk.updateGlobalVariable('label41', {'Value_KT': 'gmv'}, false);

sdk.reload(['C_11', 'C_13']);

sdk.setValue('label43', 'GMV - Monthly Trend');
sdk.setValue('label66', 'Product Breakdown - GMV');

if (sdk.getLayoutType() === "AbsoluteLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1310px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1300px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1300px');

    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1240px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1240px');
}
else if (sdk.getLayoutType() === "MobileLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1420px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1410px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1410px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1350px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1350px');
} 
else if (sdk.getLayoutType()==="TabletLayout") {
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1040px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1030px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1030px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '965px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '965px');
}

sdk.changeBGColor('box174', ['#DBEAFE', '#DBEAFE']);
sdk.changeBGColor('box46', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box181', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box59', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box_EN', ['#ffffff', '#ffffff']);

sdk.showGroup(['product_breakdown']);

setTimeout(()=>{
    // Get the current year
    var currentYear = new Date().getFullYear();

    // Get the previous year
    var lastYear = currentYear - 1;
    var x = sdk.getWidget('timeline48');
    x.m_seriesDisplayNames[1]="Current Year (" + currentYear + ")";
    x.m_seriesDisplayNames[2]="Last Year (" + lastYear + ")";
    x.draw();    
    
    var grid = sdk.getWidget('datagrid48');

    grid.m_dataset.Fields[1].displayname = "Last Year (" + lastYear + ")";
    grid.m_dataset.Fields[2].displayname = "Current Year (" + currentYear + ")";

    grid.draw();

    var grid1 = sdk.getWidget('datagrid68');

    grid1.m_dataset.Fields[1].displayname = "Last Year (" + lastYear + ")";
    grid1.m_dataset.Fields[2].displayname = "Current Year (" + currentYear + ")";

    grid1.draw();
},1000);
```

**2. Revenue Card Click:**
```javascript
var val = changedItem.attributes.Value;
sdk.updateGlobalVariable('label41', {'Value_KT': 'revenue'}, false);

sdk.reload(['C_11', 'C_13']);

sdk.setValue('label43', 'REVENUE - Monthly Trend');
sdk.setValue('label66', 'Product Breakdown - REVENUE');

if (sdk.getLayoutType() === "AbsoluteLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1310px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1300px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1300px');

    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1240px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1240px');
}
else if (sdk.getLayoutType() === "MobileLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1420px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1410px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1410px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1350px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1350px');
} 
else if (sdk.getLayoutType()==="TabletLayout") {
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1040px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1030px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1030px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '965px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '965px');
}

sdk.changeBGColor('box181', ['#DBEAFE', '#DBEAFE']);
sdk.changeBGColor('box174', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box46', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box59', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box_EN', ['#ffffff', '#ffffff']);

sdk.showGroup(['product_breakdown']);

setTimeout(()=>{
    // Get the current year
    var currentYear = new Date().getFullYear();

    // Get the previous year
    var lastYear = currentYear - 1;
    var x = sdk.getWidget('timeline48');
    x.m_seriesDisplayNames[1]="Current Year (" + currentYear + ")";
    x.m_seriesDisplayNames[2]="Last Year (" + lastYear + ")";
    x.draw();    
    
    var grid = sdk.getWidget('datagrid48');

    grid.m_dataset.Fields[1].displayname = "Last Year (" + lastYear + ")";
    grid.m_dataset.Fields[2].displayname = "Current Year (" + currentYear + ")";

    grid.draw();

    var grid1 = sdk.getWidget('datagrid68');

    grid1.m_dataset.Fields[1].displayname = "Last Year (" + lastYear + ")";
    grid1.m_dataset.Fields[2].displayname = "Current Year (" + currentYear + ")";

    grid1.draw();
},1000);
```

**3. Expenses Card Click:**
```javascript
var val = changedItem.attributes.Value;
sdk.updateGlobalVariable('label41', {'Value_KT': 'expense'}, false);

sdk.reload(['C_11']);

sdk.setValue('label43', 'EXPENSES - Monthly Trend');
sdk.setValue('label66', 'Product Breakdown - EXPENSES');

sdk.hideGroup(['product_breakdown']);

if (sdk.getLayoutType() === "AbsoluteLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "888px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '878px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '878px');

    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '818px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '818px');
}
else if (sdk.getLayoutType() === "MobileLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1110px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
} 
else if (sdk.getLayoutType()==="TabletLayout") {
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "635px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '565px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '565px');
}

sdk.changeBGColor('box59', ['#DBEAFE', '#DBEAFE']);
sdk.changeBGColor('box174', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box181', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box46', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box_EN', ['#ffffff', '#ffffff']);

setTimeout(()=>{
    var x = sdk.getWidget('timeline48');
    x.m_seriesDisplayNames[0]="Total Revenue (EXPENSES)";
    x.draw();
},1000);
```

**4. EBITDA Card Click:**
```javascript
var val = changedItem.attributes.Value;
sdk.updateGlobalVariable('label41', {'Value_KT': 'ebitda'}, false);

sdk.reload(['C_11']);

sdk.setValue('label43', 'EBITDA - Monthly Trend');
sdk.setValue('label66', 'Product Breakdown - EBITDA');

if (sdk.getLayoutType() === "AbsoluteLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "888px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '878px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '878px');

    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '818px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '818px');
}
else if (sdk.getLayoutType() === "MobileLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1110px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
} 
else if (sdk.getLayoutType()==="TabletLayout") {
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "635px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '565px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '565px');
}

sdk.changeBGColor('box174', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box46', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box181', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box59', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box_EN', ['#DBEAFE', '#DBEAFE']);

sdk.hideGroup(['product_breakdown']);

setTimeout(()=>{
    var x = sdk.getWidget('timeline48');
    x.m_seriesDisplayNames[0]="Total Revenue (EBITDA)";
    x.draw();
},1000);
```

**5. Net Profit Card Click:**
```javascript
var val = changedItem.attributes.Value;
sdk.updateGlobalVariable('label41', {'Value_KT': 'net_profit'}, false);

sdk.reload(['C_11']);

sdk.setValue('label43', 'NET PROFIT - Monthly Trend');
sdk.setValue('label66', 'Product Breakdown - NET PROFIT');

sdk.hideGroup(['product_breakdown']);

if (sdk.getLayoutType() === "AbsoluteLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "888px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '878px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '878px');

    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '818px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '818px');
}
else if (sdk.getLayoutType() === "MobileLayout"){
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1110px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '1100px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '1035px');
} 
else if (sdk.getLayoutType()==="TabletLayout") {
    sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "635px" });
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box47').m_objectid, 'height', '625px');
    
    sdk.applyStyle('#draggableDiv' + sdk.getWidget('box58').m_objectid, 'height', '565px');
    sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box58').m_objectid, 'height', '565px');
}

sdk.changeBGColor('box46', ['#DBEAFE', '#DBEAFE']);
sdk.changeBGColor('box174', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box181', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box59', ['#ffffff', '#ffffff']);
sdk.changeBGColor('box_EN', ['#ffffff', '#ffffff']);

setTimeout(()=>{
    var x = sdk.getWidget('timeline48');
    x.m_seriesDisplayNames[0]="Total Revenue (NET PROFIT)";
    x.draw();
},1000);
```

### Key Implementation Details

**1. Global Variable Update:**
- All KPI clicks update `Value_KT` in `label41` widget with the metric identifier:
  - GMV: `'gmv'`
  - Revenue: `'revenue'`
  - Expenses: `'expense'`
  - EBITDA: `'ebitda'`
  - Net Profit: `'net_profit'`

**2. Connection Reloads:**
- **GMV & Revenue**: Reload `C_11` and `C_13` (trend and product breakdown)
- **Expenses, EBITDA, Net Profit**: Reload only `C_11` (trend only, no product breakdown)

**3. Label Updates:**
- `label43`: Trend section title (e.g., "GMV - Monthly Trend")
- `label66`: Product breakdown section title (e.g., "Product Breakdown - GMV")

**4. Layout Height Adjustments:**
- Heights adjusted based on layout type (AbsoluteLayout, MobileLayout, TabletLayout)
- **GMV & Revenue** (with product breakdown):
  - AbsoluteLayout: 1310px (parent), 1300px (box47), 1240px (box58)
  - MobileLayout: 1420px (parent), 1410px (box47), 1350px (box58)
  - TabletLayout: 1040px (parent), 1030px (box47), 965px (box58)
- **Expenses, EBITDA, Net Profit** (without product breakdown):
  - AbsoluteLayout: 888px (parent), 878px (box47), 818px (box58)
  - MobileLayout: 1110px (parent), 1100px (box47), 1035px (box58)
  - TabletLayout: 635px (parent), 625px (box47), 565px (box58)

**5. Background Color Changes:**
- Each KPI card highlights a different box with light blue background (`#DBEAFE`):
  - **GMV**: `box174` highlighted
  - **Revenue**: `box181` highlighted
  - **Expenses**: `box59` highlighted
  - **EBITDA**: `box_EN` highlighted
  - **Net Profit**: `box46` highlighted
- All other boxes set to white (`#ffffff`)

**6. Product Breakdown Visibility:**
- **GMV & Revenue**: `sdk.showGroup(['product_breakdown'])` - Product breakdown shown
- **Expenses, EBITDA, Net Profit**: `sdk.hideGroup(['product_breakdown'])` - Product breakdown hidden

**7. Chart and Grid Updates (Delayed):**
- Updates executed after 1 second delay using `setTimeout()`
- **GMV & Revenue**:
  - Updates `timeline48` chart series display names with current year and last year
  - Updates `datagrid48` and `datagrid68` grid field display names
- **Expenses, EBITDA, Net Profit**:
  - Updates `timeline48` chart series display name with metric name (e.g., "Total Revenue (EXPENSES)")

**8. Widget IDs:**
- `label43`: Trend section title label
- `label66`: Product breakdown section title label
- `box47`: Container box for trend section
- `box58`: Container box for product breakdown section
- `box174`, `box181`, `box46`, `box59`, `box_EN`: KPI card highlight boxes
- `timeline48`: Chart widget for trend visualization
- `datagrid48`: Grid widget for trend data
- `datagrid68`: Grid widget for product breakdown data

### Product Breakdown Visibility Logic

**Show Product Breakdown:**
- **GMV**: Product breakdown shown (`sdk.showGroup(['product_breakdown'])`)
- **Revenue**: Product breakdown shown (`sdk.showGroup(['product_breakdown'])`)

**Hide Product Breakdown:**
- **Expenses**: Product breakdown hidden (`sdk.hideGroup(['product_breakdown'])`)
- **EBITDA**: Product breakdown hidden (`sdk.hideGroup(['product_breakdown'])`)
- **Net Profit**: Product breakdown hidden (`sdk.hideGroup(['product_breakdown'])`)

### Implementation Notes

1. **Metric Selection**: Selected metric stored in global variable `Value_KT` in `label41` widget
2. **Layout Responsiveness**: Different heights applied based on layout type for optimal display
3. **Product Breakdown**: Only shown for GMV and Revenue metrics
4. **Data Reload**: Connections reloaded based on selected metric (C_11 for all, C_13 for GMV/Revenue only)
5. **Visual Highlighting**: Selected KPI card highlighted via background color change on corresponding box
6. **Title Updates**: Trend and product breakdown titles update based on selected metric
7. **Delayed Updates**: Chart and grid display names updated after 1 second delay to ensure data is loaded
8. **Year Display**: Current year and last year dynamically calculated and displayed in chart/grid labels

---

## Trend Analysis Sections

### Purpose

Displays detailed trend analysis for the selected metric, showing data over time (monthly or quarterly) and optionally product breakdown for GMV and Revenue metrics.

### Section Structure

#### 1. GMV/Revenue/Expenses/EBITDA/Net Profit - Monthly Trend Section

**Section Title:**
- Dynamic title based on selected metric and frequency
- Format: `"[Metric Name] - [Frequency] Trend"`
- Examples:
  - "GMV - Monthly Trend"
  - "Revenue - Quarterly Trend"
  - "Expenses - Monthly Trend"

**Control Options:**

**Year Comparison:**
- Two radio buttons:
  - **"Current Year (2025)"**: Selected by default (blue dot)
  - **"Last Year (2024)"**: Alternative option (yellow dot)
- Stored in context as `year_selection`
- Updates trend data when changed

**Frequency Selection:**
- Two radio buttons:
  - **"Quarterly"**: Aggregates data by quarters
  - **"Monthly"**: Selected by default, aggregates data by months
- Stored in context as `frequency`
- Updates trend data aggregation when changed

**View Type Selection:**
- Two buttons:
  - **"Chart"**: Displays data as visual chart/graph
  - **"Grid"**: Selected by default (highlighted in blue), displays data in table format
- Stored in context as `view_type`
- Toggles between chart and grid visualization

**Data Display:**

**Grid View (Default):**
- Table with columns: **Year**, **Sales**, **Expense**
- Header row: Yellow background for column headers
- Data rows: Alternating white and light blue backgrounds
- Sample data:
  - 2020: Sales 17, Expense 17
  - 2006: Sales 16, Expense 16
  - 2007: Sales -14, Expense 14
  - 2008: Sales 13, Expense 13
  - 2009: Sales 11, Expense 23
  - 2010: Sales 20, Expense 31
- Vertical scrollbar for long data lists
- Action icons on right side (stacked vertically):
  - Filter icon
  - Sort icon
  - Function (fx) icon
  - Close/remove (X) icon

**Chart View:**
- Visual representation of trend data
- Line chart or bar chart depending on configuration
- X-axis: Time periods (months or quarters)
- Y-axis: Metric values
- Interactive tooltips on hover

**Widget IDs:**
- `label_trend_title`: Section title label
- `datagrid_trend`: Trend data grid widget
- `chart_trend`: Trend chart widget (shown when Chart view selected)
- `radio_current_year`: Current Year radio button
- `radio_last_year`: Last Year radio button
- `radio_quarterly`: Quarterly radio button
- `radio_monthly`: Monthly radio button
- `btn_chart`: Chart view button
- `btn_grid`: Grid view button

#### 2. Product Breakdown Section

**Visibility:**
- **Shown**: Only when GMV or Revenue metric card is clicked
- **Hidden**: For Expenses, EBITDA, and Net Profit metrics

**Section Title:**
- Dynamic title based on selected metric
- Format: `"Product Breakdown - [Metric Name]"`
- Examples:
  - "Product Breakdown - GMV"
  - "Product Breakdown - Revenue"

**Data Display:**

**Grid View:**
- Table with columns: **Year**, **Sales**, **Expense**
- Header row: Yellow background for column headers
- Data rows: Alternating white and light blue backgrounds
- Same structure as trend section grid
- Shows product-level breakdown data
- Sample data (same as trend section):
  - 2020: Sales 17, Expense 17
  - 2006: Sales 16, Expense 16
  - 2007: Sales -14, Expense 14
  - 2008: Sales 13, Expense 13
  - 2009: Sales 11, Expense 23
  - 2010: Sales 20, Expense 31
- Vertical scrollbar for long data lists
- Action icons on right side (stacked vertically):
  - Filter icon
  - Sort icon
  - Function (fx) icon
  - Close/remove (X) icon

**Chart View:**
- Visual representation of product breakdown
- Stacked bar chart or pie chart depending on configuration
- Shows distribution across products
- Interactive tooltips on hover

**Widget IDs:**
- `label_product_title`: Product breakdown section title label
- `datagrid_product`: Product breakdown data grid widget
- `chart_product`: Product breakdown chart widget (shown when Chart view selected)

### Year Comparison Logic

**Current Year Selection:**
```javascript
// When Current Year radio button is clicked
sdk.setContext('year_selection', currentYear);
sdk.updateGlobalVariable('label41', {'Value_Year': currentYear}, false);
sdk.reload(['C_6', 'C_7', 'C_8', 'C_9', 'C_10']);  // Reload trend connections
```

**Last Year Selection:**
```javascript
// When Last Year radio button is clicked
sdk.setContext('year_selection', lastYear);
sdk.updateGlobalVariable('label41', {'Value_Year': lastYear}, false);
sdk.reload(['C_6', 'C_7', 'C_8', 'C_9', 'C_10']);  // Reload trend connections
```

### Frequency Selection Logic

**Monthly Selection:**
```javascript
// When Monthly radio button is clicked
sdk.setContext('frequency', 'Monthly');
sdk.updateGlobalVariable('label41', {'Value_Frequency': 'Monthly'}, false);

// Update section title
var selectedMetric = sdk.getContext('selected_metric');
sdk.setValue('label_trend_title', selectedMetric + ' - Monthly Trend');

// Reload trend connections
sdk.reload(['C_6', 'C_7', 'C_8', 'C_9', 'C_10']);
```

**Quarterly Selection:**
```javascript
// When Quarterly radio button is clicked
sdk.setContext('frequency', 'Quarterly');
sdk.updateGlobalVariable('label41', {'Value_Frequency': 'Quarterly'}, false);

// Update section title
var selectedMetric = sdk.getContext('selected_metric');
sdk.setValue('label_trend_title', selectedMetric + ' - Quarterly Trend');

// Reload trend connections
sdk.reload(['C_6', 'C_7', 'C_8', 'C_9', 'C_10']);
```

### View Type Selection Logic

**Grid View Selection:**
```javascript
// When Grid button is clicked
sdk.setContext('view_type', 'Grid');
sdk.updateGlobalVariable('label41', {'Value_ViewType': 'Grid'}, false);

// Show grid, hide chart
sdk.showComponent(['datagrid_trend']);
sdk.hideComponent(['chart_trend']);

// Apply active styling to Grid button
var gridBtnDiv = sdk.getDivIdFromComponetId('btn_grid');
sdk.applyStyle('#' + gridBtnDiv, "background-color", "#007bff");
sdk.applyStyle('#' + gridBtnDiv, "color", "#ffffff");

// Remove active styling from Chart button
var chartBtnDiv = sdk.getDivIdFromComponetId('btn_chart');
sdk.applyStyle('#' + chartBtnDiv, "background-color", "#ffffff");
sdk.applyStyle('#' + chartBtnDiv, "color", "#000000");
```

**Chart View Selection:**
```javascript
// When Chart button is clicked
sdk.setContext('view_type', 'Chart');
sdk.updateGlobalVariable('label41', {'Value_ViewType': 'Chart'}, false);

// Show chart, hide grid
sdk.showComponent(['chart_trend']);
sdk.hideComponent(['datagrid_trend']);

// Apply active styling to Chart button
var chartBtnDiv = sdk.getDivIdFromComponetId('btn_chart');
sdk.applyStyle('#' + chartBtnDiv, "background-color", "#007bff");
sdk.applyStyle('#' + chartBtnDiv, "color", "#ffffff");

// Remove active styling from Grid button
var gridBtnDiv = sdk.getDivIdFromComponetId('btn_grid');
sdk.applyStyle('#' + gridBtnDiv, "background-color", "#ffffff");
sdk.applyStyle('#' + gridBtnDiv, "color", "#000000");
```

### Table Features

**Visual Styling:**
- **Header Row**: Yellow background (`#FFEB3B` or similar) for column headers
- **Data Rows**: Alternating white and light blue backgrounds for readability
- **Scrollbar**: Vertical scrollbar for long lists of entries
- **Row Hover**: Highlight on row hover for better UX

**Data Grid Widget:**
- Widget ID: `datagrid_trend` (trend section) or `datagrid_product` (product breakdown)
- Supports pagination
- Supports sorting by columns
- Supports filtering
- Supports export functionality

**Data Formatting:**
- **Numbers**: Formatted with comma separators for thousands
- **Negative Values**: Displayed with minus sign (e.g., Sales -14)
- **Currency**: Based on system configuration
- **Empty Values**: Displayed as empty cells

**Grid Action Icons:**
- **Filter Icon**: Opens column filter options
- **Sort Icon**: Sorts data by selected column
- **Function (fx) Icon**: Opens calculation/formula options
- **Close/Remove (X) Icon**: Removes column or clears filters

### Key Features

1. **Dynamic Titles**: Section titles update based on selected metric and frequency
2. **Year Comparison**: Toggle between current year and last year data
3. **Frequency Toggle**: Switch between monthly and quarterly aggregation
4. **View Toggle**: Switch between grid and chart visualization
5. **Product Breakdown**: Available only for GMV and Revenue metrics
6. **Interactive Grids**: Sortable, filterable data tables with action icons
7. **Responsive Charts**: Visual representation of trend data
8. **Data Synchronization**: All controls update data in real-time

---

## Filter Modal Script

**Trigger:** Click on filter button

**Modal Title:** "Filter"

**Modal Structure:**
The filter modal is a centered white overlay dialog with slightly rounded corners, positioned over a blurred background. It allows users to configure filters for the P&L report through five dropdown selections.

### Modal Sections

**1. Modal Header:**
- **Title**: "Filter" displayed at the top of the modal
- **Close Button**: X icon in the top right corner
- Closes modal when clicked without applying changes
- Modal background: White rectangular box with rounded corners
- Overlay background: Blurred gray background

**2. Filter Fields (Five Dropdowns):**
All filter fields are stacked vertically with consistent styling:

**Year Filter:**
- **Label**: "Year"
- **Dropdown Widget**: Year dropdown input field
- **Placeholder**: "Year" (displayed when no selection made)
- **Visual**: Thin gray border, downward-pointing chevron icon on the right
- **Widget ID**: `hfilter_year` (or similar)
- **Purpose**: Filters data by selected year

**Month Filter:**
- **Label**: "Month"
- **Dropdown Widget**: Month dropdown input field
- **Placeholder**: "Year" (displayed when no selection made)
- **Visual**: Thin gray border, downward-pointing chevron icon on the right
- **Widget ID**: `hfilter_month` (or similar)
- **Purpose**: Filters data by selected month

**Market Profile Filter:**
- **Label**: "Market Profile"
- **Dropdown Widget**: Market Profile dropdown input field
- **Placeholder**: "Year" (displayed when no selection made)
- **Visual**: Thin gray border, downward-pointing chevron icon on the right
- **Widget ID**: `hfilter_market_profile` (or similar)
- **Purpose**: Filters data by market profile

**Branch Filter:**
- **Label**: "Branch"
- **Dropdown Widget**: Branch dropdown input field
- **Placeholder**: "Year" (displayed when no selection made)
- **Visual**: Thin gray border, downward-pointing chevron icon on the right
- **Widget ID**: `hfilter_branch` (or similar)
- **Purpose**: Filters data by branch location

**Channel Filter:**
- **Label**: "Channel"
- **Dropdown Widget**: Channel dropdown input field
- **Placeholder**: "Year" (displayed when no selection made)
- **Visual**: Thin gray border, downward-pointing chevron icon on the right
- **Widget ID**: `hfilter_channel` (or similar)
- **Purpose**: Filters data by sales channel

**Common Dropdown Styling:**
- All dropdowns have thin gray borders (`1px solid #7A7A7A` or similar)
- Downward-pointing chevron icon indicates selectable dropdown
- Placeholder text shown when no value selected
- Consistent spacing between filter fields

**3. Action Buttons Section:**
Located at the bottom of the modal, horizontally aligned:

- **Cancel Button** (Left):
  - Light blue border with white background
  - Blue text color
  - Closes modal without applying changes
  - Resets filter selections to previous state
  - Widget ID: `label_cancel` or `btn_cancel`

- **Apply Button** (Right):
  - Solid blue background (`#007bff` or similar)
  - White text color
  - Applies selected filters to dashboard
  - Triggers connection reloads and data refresh
  - Closes modal after applying
  - Widget ID: `label_apply` or `btn_apply`

### Filter Application Flow

```
User Clicks Filter Button
    ↓
Modal Opens (filter group shown)
    ↓
User Selects Filters:
    - Year
    - Month
    - Market Profile
    - Branch
    - Channel
    ↓
User Clicks Apply Button
    ↓
Filters Stored in Context and Global Variables
    ↓
Connections Reloaded
    ↓
Dashboard Data Refreshed
    ↓
Modal Closes
```

### Filter State Management

**On Apply:**
- Filter values stored in SDK context variables
- Global variables updated in `label41` widget:
  - `Value_Year`: Selected year value
  - `Value_Month`: Selected month value
  - `Value_MarketProfile`: Selected market profile value
  - `Value_Branch`: Selected branch value
  - `Value_Channel`: Selected channel value
- Context variables updated:
  - `selected_year`: Year filter value
  - `selected_month`: Month filter value
  - `market_profile`: Market profile filter value
  - `branch`: Branch filter value
  - `channel`: Channel filter value
- All KPI tiles and trend sections recalculate based on selected filters
- Connections reloaded to refresh dashboard data

**On Cancel:**
- Modal closes without applying changes
- Previous filter state maintained
- No data refresh triggered
- Filter selections reset to last applied state

**On Close (X Button):**
- Modal closes without applying changes
- Same behavior as Cancel button
- Previous filter state maintained

### Widget IDs Reference

**Filter Modal:**
- `box_filter_modal`: Filter modal container (or `box229` or similar)
- `label_cancel`: Cancel button widget
- `label_apply`: Apply button widget
- `icon_close`: Close button (X icon) widget

**Filter Dropdowns:**
- `hfilter_year`: Year dropdown widget
- `hfilter_month`: Month dropdown widget
- `hfilter_market_profile`: Market Profile dropdown widget
- `hfilter_branch`: Branch dropdown widget
- `hfilter_channel`: Channel dropdown widget

**Modal Container:**
- `filter`: Filter modal group

### Filter Dropdown Styling

All filter dropdowns have consistent border styling applied:
```javascript
// Border styling applied to all filter dropdowns
var yearDiv = sdk.getDivIdFromComponetId('hfilter_year');
sdk.applyStyle('#' + yearDiv + ' div', "border", "1px solid #7A7A7A");

var monthDiv = sdk.getDivIdFromComponetId('hfilter_month');
sdk.applyStyle('#' + monthDiv + ' div', "border", "1px solid #7A7A7A");

var marketProfileDiv = sdk.getDivIdFromComponetId('hfilter_market_profile');
sdk.applyStyle('#' + marketProfileDiv + ' div', "border", "1px solid #7A7A7A");

var branchDiv = sdk.getDivIdFromComponetId('hfilter_branch');
sdk.applyStyle('#' + branchDiv + ' div', "border", "1px solid #7A7A7A");

var channelDiv = sdk.getDivIdFromComponetId('hfilter_channel');
sdk.applyStyle('#' + channelDiv + ' div', "border", "1px solid #7A7A7A");
```

### Visual Design

**Modal Appearance:**
- White rectangular box with slightly rounded corners
- Centered positioning over blurred background
- Professional, clean design
- Consistent spacing between elements

**Dropdown Fields:**
- Vertical stacking of all five filter fields
- Consistent label positioning above each dropdown
- Gray border styling for visual consistency
- Chevron icons indicate dropdown functionality

**Action Buttons:**
- Horizontal alignment at bottom of modal
- Clear visual distinction between Cancel (outlined) and Apply (filled)
- Adequate spacing between buttons

---

## Export Scripts

### Excel Export

**Trigger:** Click on Excel export icon (`svg_export`)

**Unique Logic:**
1. **Data Selection**: Exports trend analysis and product breakdown data
2. **Filter Application**: Exports filtered data based on current filters
3. **Parameter Mapping**: Maps filter parameters (date range, year, frequency, selected metric)
4. **Export Execution**: Calls `sdk.excelExport()` with configuration

**Export Configuration:**
```javascript
var selectedMetric = sdk.getContext('selected_metric');
var widgetsToExport = ['datagrid_trend'];
var chartNames = [selectedMetric + ' Monthly Trend'];

// Include product breakdown if GMV or Revenue selected
if (selectedMetric === 'GMV' || selectedMetric === 'Revenue') {
    widgetsToExport.push('datagrid_product');
    chartNames.push('Product Breakdown - ' + selectedMetric);
}

sdk.excelExport(
    widgetsToExport,
    chartNames,
    [['startdate', 'enddate', 'year', 'frequency', 'metric']],
    "Executive P&L Report"
);
```

**Exported Data:**
- Trend analysis grid/chart data
- Product breakdown data (if GMV or Revenue selected)
- Current filter settings applied
- Formatted data with proper date and number formatting
- Includes KPI summary if applicable

### PDF Export

**Trigger:** Click on PDF export icon (`svg_pdf`)

**Unique Logic:**
1. **Data Preparation**: Prepares current dashboard state including KPI cards and trend sections
2. **Filter Application**: Exports filtered data based on current filters
3. **Export Format**: Generates PDF with dashboard snapshot
4. **Export Execution**: Calls `sdk.pdfExport()` with configuration

**Export Configuration:**
```javascript
var selectedMetric = sdk.getContext('selected_metric');
var widgetsToExport = ['datagrid_trend'];
var chartNames = [selectedMetric + ' Monthly Trend'];

// Include product breakdown if GMV or Revenue selected
if (selectedMetric === 'GMV' || selectedMetric === 'Revenue') {
    widgetsToExport.push('datagrid_product');
    chartNames.push('Product Breakdown - ' + selectedMetric);
}

sdk.pdfExport(
    widgetsToExport,
    chartNames,
    [['startdate', 'enddate', 'year', 'frequency', 'metric']],
    "Executive P&L Report"
);
```

**Exported Data:**
- Dashboard snapshot including KPI cards
- Trend analysis data
- Product breakdown data (if applicable)
- Current filter settings
- Formatted as PDF document

### Share/Send Functionality

**Trigger:** Click on share/send icon (`svg_share`)

**Unique Logic:**
1. **Data Preparation**: Prepares current dashboard state
2. **Share Options**: Provides sharing options (email, link, etc.)
3. **Export Format**: May export as PDF or generate shareable link
4. **State Capture**: Captures current filter settings and selected metric

**Share Configuration:**
```javascript
// Prepare share data
var shareData = {
    dashboard: 'Executive P&L Report',
    selectedMetric: sdk.getContext('selected_metric'),
    year: sdk.getContext('year_selection'),
    frequency: sdk.getContext('frequency'),
    viewType: sdk.getContext('view_type'),
    filters: {
        startDate: sdk.getContext('sdt'),
        endDate: sdk.getContext('edt')
    }
};

// Generate shareable link or send via email
// Implementation depends on system requirements
```

**Share Options:**
- Email: Send dashboard snapshot via email
- Link: Generate shareable link with current state
- Export: Download as PDF or Excel for sharing

---

## Data Structure & Context Management

### SDK Context Variables

**Filter State:**
- `sdt`: Start date (YYYY-MM-DD format) - Default: January 1 of current year
- `edt`: End date (YYYY-MM-DD format) - Default: Yesterday's date
- `cdc`: Custom date check flag (`true` = custom date selected) - Default: `true`

**Selection State:**
- `year_selection`: Selected year (current year or last year) - Default: Current year
- `frequency`: Data frequency (`'Monthly'` or `'Quarterly'`) - Default: `'Monthly'`
- `view_type`: View type (`'Grid'` or `'Chart'`) - Default: `'Grid'`
- `selected_metric`: Currently selected metric (`null`, `'GMV'`, `'Revenue'`, `'Expenses'`, `'EBITDA'`, `'Net Profit'`) - Default: `null`

**Load State:**
- `firstLoad`: First load flag (`true` initially, reset to `false` after 3 seconds) - Default: `true`

**User Information:**
- `dashboard_user`: User object containing `authToken` and permissions
- `homeURL`: Base URL for API calls

**Table State:**
- `sortColumn`: Column name for sorting
- `sortDirection`: Sort direction (`'asc'` or `'desc'`)

### Global Variables (stored in `label41`)

**Date Range:**
- `Value1`: Start date (YYYY-MM-DD) - Default: January 1 of current year
- `Value2`: End date (YYYY-MM-DD) - Default: Yesterday's date

**Selection Variables:**
- `Value_Year`: Year selection - Default: Current year
- `Value_Frequency`: Frequency selection - Default: `'Monthly'`
- `Value_ViewType`: View type - Default: `'Grid'`
- `Value_SelectedMetric`: Selected metric - Default: Empty string

**Filter Variables:**
- Additional filter variables as needed (data source, label, etc.)

### Widget Properties

**Data Grid Properties:**
- `m_pageSize`: Number of rows per page
- `m_currentPage`: Current page number
- `m_sortColumn`: Column name for sorting
- `m_sortDirection`: Sort direction
- `m_columns`: Array of column definitions

**KPI Card Properties:**
- `m_value`: Display value
- `m_currency`: Currency symbol
- `m_format`: Value format (K/M/B)
- `m_clickable`: Boolean indicating if card is clickable

**Chart Properties:**
- `m_type`: Chart type (line, bar, etc.)
- `m_data`: Chart data array
- `m_xAxis`: X-axis configuration
- `m_yAxis`: Y-axis configuration

---

## Notes

- All currency values default to AED (UAE Dirham) based on system configuration
- Date formats: Display uses `DD-MM-YYYY`, storage uses `YYYY-MM-DD`
- Trend analysis sections support pagination, sorting, and filtering
- KPI values are calculated in real-time based on filtered data
- Product Breakdown section only appears when GMV or Revenue metric cards are clicked
- All KPI cards are clickable and trigger detailed trend analysis
- Instruction banner guides users to click metric cards for detailed analysis
- Grid view is the default view type, with Chart view available as alternative
- Year comparison allows switching between current year and last year data
- Frequency selection allows switching between monthly and quarterly aggregation
- Export functionality exports currently filtered/visible data only
- The initialization script runs automatically on page load
- All amounts displayed with appropriate currency symbols (determined by system configuration)
- Negative values are properly handled and displayed (e.g., negative sales, net losses)

---

**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Author**: Executive P&L Dashboard Development Team

