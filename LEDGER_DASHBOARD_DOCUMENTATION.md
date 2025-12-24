# Ledger Report Dashboard - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Global Filters](#global-filters)
3. [KPI Metrics Reference](#kpi-metrics-reference)
4. [SDK Methods Reference](#sdk-methods-reference)
5. [Component & Widget IDs Reference](#component--widget-ids-reference)
6. [Dashboard Initialization Script](#dashboard-initialization-script)
7. [KPI Tile Value Updates](#kpi-tile-value-updates)
8. [Summary Report Table](#summary-report-table)
9. [Filter Modal Script](#filter-modal-script)
10. [Export Scripts](#export-scripts)
11. [Data Structure & Context Management](#data-structure--context-management)

---

## Overview

The Ledger Report Dashboard is a vanilla JavaScript application using jQuery and a proprietary Dashboard SDK. It provides comprehensive financial ledger analytics, tracking overdue amounts, credit limits, outstanding balances, and available credit across transactions.

### Technology Stack

- **Vanilla JavaScript**: Core application logic
- **jQuery**: AJAX requests and DOM manipulation
- **Dashboard SDK**: Widget management, context handling, component visibility
- **HTML/CSS**: Frontend structure and styling

### Architecture Principles

1. **Widget-Based Components**: All UI elements are widgets identified by unique IDs
2. **Connection-Based Data**: Data connections (`C_1`, `C_2`, etc.) link widgets to data sources
3. **Context-Driven State**: SDK context stores application state (filters, user info)
4. **Global Variable Management**: Shared variables accessible across widgets via global variable widget
5. **Group-Based Visibility**: Component groups enable bulk show/hide operations

---

## Global Filters

The Ledger Report Dashboard provides global filtering capabilities that allow users to refine ledger data based on various criteria.

### Available Filters

**Date Range:**
- Filters data between the specified start and end dates
- Supports predefined ranges (Last 1 Day, Last 7 Days, Last 30 Days) and custom date selection
- **Date Format**:
  - **Display Format**: `DD-MM-YYYY` (e.g., "02-01-2024") - shown in date picker inputs
  - **Storage Format**: `YYYY-MM-DD` (e.g., "2024-01-02") - ISO 8601 compliant, used internally and for API calls
- Stored in SDK context as `sdt` (start date) and `edt` (end date)
- Also stored in global variables as `Value` (start date) and `Value1` (end date)

**Data Source:**
- Filters data by data source type
- Stored in global variable `Value_DS` in `label41` widget
- Default value: `'ExistingMB'`
- Widget ID: `hfilter25`

**Date Range Selection:**
- Two options via radio buttons:
  - **"As of Now"**: Shows current data as of the current moment (no date range)
  - **"Custom Date Range"**: Allows custom start and end date selection
- When "Custom Date Range" is selected:
  - Start Date: User-selectable date picker (format: `DD-MM-YYYY`)
  - End Date: User-selectable date picker (format: `DD-MM-YYYY`)
- Stored in SDK context as `sdt` (start date) and `edt` (end date)
- Also stored in global variables as `Value1` (start date) and `Value2` (end date) in `label41` widget
- Context variable `cdc` indicates if custom date is selected (`true`) or "As of Now" (`false`)

**Sales Executive:**
- Filters data by assigned sales executive
- Stored in global variable `Value_SE` in `label41` widget
- Default value: `'Balu Mani'`
- Widget ID: `hfilter33`

**Finance Executive:**
- Filters data by assigned finance executive
- Stored in global variable `Value_FE` in `label41` widget
- Default value: `'Shishir S Nair'`
- Widget ID: `hfilter34`

**Organization Group:**
- Filters data by organization group
- Stored in global variable `Value_OG` in `label41` widget
- Default value: `'No Organization Group'`
- Widget ID: `hfilter36`

**Organization:**
- Filters data by specific organization
- Stored in global variable `Value_ORG` in `label41` widget
- Default value: `'14688'` (Organization ID)
- Widget ID: `hfilter38`
- May display organization name (e.g., "247 Charters Tourism") or ID depending on configuration

### Filter Application

**Filter Modal:**
- **Trigger**: Clicking the filter icon in the dashboard header
- **Modal Title**: "Data Source" and "Choose the date"
- **Modal Structure**:
  1. **Header Section**:
     - Modal titles: "Data Source" and "Choose the date"
     - Close button (X icon) in top right corner
  2. **Data Source Section**:
     - Dropdown menu (`hfilter25`)
     - Default selection: "ExistingMB"
  3. **Date Range Selection**:
     - Radio button group with two options:
       - "As of Now" (unselected by default)
       - "Custom Date Range" (selected by default)
     - Date input fields shown when "Custom Date Range" is selected:
       - Start Date input field (displays `DD-MM-YYYY` format, e.g., "01-01-2024")
       - End Date input field (displays `DD-MM-YYYY` format, e.g., "15-12-2025")
  4. **Sales Executive Section**:
     - Dropdown menu (`hfilter33`)
     - Default selection: "Balu Mani"
  5. **Finance Executive Section**:
     - Dropdown menu (`hfilter34`)
     - Default selection: "Shishir S Nair"
  6. **Organization Group Section**:
     - Dropdown menu (`hfilter36`)
     - Default selection: "No Organization Group"
  7. **Organization Section**:
     - Dropdown menu (`hfilter38`)
     - Default selection: Organization ID or name
  8. **Action Buttons**:
     - Cancel button: Light blue border, white background
     - Apply button: Solid blue background, white text

**Filter State Management:**
- Filter selections stored in SDK context for persistence
- Global variables updated via `sdk.updateGlobalVariable()`
- Context variables updated via `sdk.setContext(key, value)`
- Filter changes trigger connection reloads to refresh dashboard data

**Filter Reset:**
- Default date range: Custom Date Range (January 1, 2024 to yesterday)
- Default data source: "ExistingMB"
- Default sales executive: "Balu Mani"
- Default finance executive: "Shishir S Nair"
- Default organization group: "No Organization Group"
- Default organization: "14688" (Organization ID)
- Reset occurs on dashboard initialization or when filters are cleared

### Filter Impact on Data

**Date Range Impact:**
- All KPI tiles recalculate values based on selected date range
- Summary Report table filters entries by selected period
- Statement Due Date filtering based on date range

**Filter Impact:**
- All filters (Data Source, Sales Executive, Finance Executive, Organization Group, Organization) affect both KPI tiles and Summary Report table
- KPI values recalculate based on selected filters
- Summary Report table filters entries based on all selected filter criteria

---

## KPI Metrics Reference

This section provides detailed descriptions of all Key Performance Indicators (KPIs) displayed in the Ledger Report Dashboard.

### KPI Cards

#### 1. Total Overdue

**Description:**
This metric displays the total amount of overdue payments across all ledger entries. It represents the cumulative value of all transactions that have passed their statement due date and remain unpaid.

**Attributes:**
- `total_overdue` (numeric)
  - The total monetary value of all overdue transactions
  - Includes all amounts past their statement due date
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `3.8M` represents 3.8 million

**Visual Elements:**
- **Icon**: Yellow icon depicting a credit card with a dollar sign and an arrow pointing outwards
- **Color Scheme**: Typically displayed in red or warning color to indicate overdue status
- **Format**: Abbreviated format (K/M/B) for readability

**Widget IDs:**
- `label_[overdue_value]`: KPI tile display value
- `icon_[overdue_icon]`: Overdue icon widget

**Data Source:**
- Calculated from Summary Report entries where `Statement Due Date < Current Date` and `Balance > 0`

#### 2. Credit Limit

**Description:**
This metric shows the total credit limit available across all accounts or organizations. It represents the maximum credit amount that can be extended to customers or partners.

**Attributes:**
- `credit_limit` (numeric)
  - The total credit limit amount across all accounts
  - Represents maximum allowable credit
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `6.0M` represents 6.0 million

**Visual Elements:**
- **Icon**: Yellow icon showing a stack of coins or bills
- **Color Scheme**: Typically displayed in neutral or informational color
- **Format**: Abbreviated format (K/M/B) for readability

**Widget IDs:**
- `label_[credit_limit_value]`: KPI tile display value
- `icon_[credit_limit_icon]`: Credit limit icon widget

**Data Source:**
- Aggregated from account/organization credit limit settings

#### 3. Total Outstanding

**Description:**
This metric displays the total outstanding balance across all ledger entries. It represents the cumulative amount of all unpaid transactions, regardless of their due date status.

**Attributes:**
- `total_outstanding` (numeric)
  - The total outstanding balance across all transactions
  - Includes both overdue and not-yet-due amounts
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/M format)
  - Example: `21.2M` represents 21.2 million

**Visual Elements:**
- **Icon**: Yellow icon with three stacked rectangular shapes (representing documents or ledgers)
- **Color Scheme**: Typically displayed in informational color
- **Format**: Abbreviated format (K/M/B) for readability

**Widget IDs:**
- `label_[outstanding_value]`: KPI tile display value
- `icon_[outstanding_icon]`: Outstanding icon widget

**Data Source:**
- Calculated from Summary Report entries where `Balance > 0`

#### 4. Available Limit

**Description:**
This metric shows the available credit limit remaining after accounting for outstanding balances. It represents how much credit is still available for use. Negative values indicate that outstanding balances exceed the credit limit.

**Attributes:**
- `available_limit` (numeric)
  - The remaining available credit limit
  - Calculated as: `Credit Limit - Total Outstanding`
  - Can be negative if outstanding exceeds credit limit
  - Displayed with currency prefix (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
  - Example: `-15.1M` represents negative 15.1 million (over limit)

**Visual Elements:**
- **Icon**: Yellow icon depicting a credit card with a dollar sign and an arrow pointing inwards
- **Color Scheme**: 
  - Negative values: Typically displayed in red/warning color
  - Positive values: Typically displayed in green/success color
- **Format**: Abbreviated format (K/M/B) for readability
- **Sign Display**: Negative sign displayed prominently for negative values

**Widget IDs:**
- `label_[available_limit_value]`: KPI tile display value
- `icon_[available_limit_icon]`: Available limit icon widget

**Data Source:**
- Calculated as: `Credit Limit - Total Outstanding`

**Calculation Logic:**
```javascript
available_limit = credit_limit - total_outstanding
```

**Example:**
- Credit Limit: 6.0M
- Total Outstanding: 21.2M
- Available Limit: 6.0M - 21.2M = -15.2M

### KPI Calculation Methods

**Value Formatting:**
- Large numbers (≥ 1 Billion): Formatted as `X.XB` (e.g., `1.5B`)
- Medium numbers (≥ 1 Million): Formatted as `X.XM` (e.g., `3.8M`)
- Small numbers (≥ 1 Thousand): Formatted as `X.XK` (e.g., `5.7K`)
- Very small numbers (< 1 Thousand): Displayed with 1 decimal place

**Currency Formatting:**
- Values prefixed with currency symbol (currency determined by system configuration):
  - UAE (AED): `AED X.X`
  - India (INR): `INR X.X`
  - Qatar (QAR): `QAR X.X`
  - Saudi Arabia (SAR): `SAR X.X`

**Negative Value Handling:**
- Negative values displayed with minus sign prefix
- Available Limit can be negative when outstanding exceeds credit limit
- Negative values typically styled in red/warning color

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
var tabSelected = sdk.getContext('tabSelected');
var userInfo = sdk.getContext('dashboard_user');
```

#### `sdk.setContext(key, value)`
Stores a value in SDK context.

**Parameters:**
- `key` (string): Context key name
- `value` (any): Value to store

**Usage:**
```javascript
sdk.setContext('sdt', '2024-01-01');
sdk.setContext('cdc', true);
```

### Widget Management

#### `sdk.getWidget(widgetId)`
Retrieves widget object for property access and manipulation.

**Parameters:**
- `widgetId` (string): Widget ID

**Returns:** Widget object

**Usage:**
```javascript
var table = sdk.getWidget('datagrid1');
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
sdk.setValue('label1', 'Total Overdue:');
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
sdk.showGroup(['kpi_cards', 'summary_table']);
```

#### `sdk.hideGroup(groupNames)`
Hides component groups.

**Parameters:**
- `groupNames` (array): Array of group names

**Usage:**
```javascript
sdk.hideGroup(['filter_modal']);
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
sdk.updateGlobalVariable('label283', {'Value': '2024-01-01', 'Value1': '2024-01-31'}, false);
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
var divId = sdk.getDivIdFromComponetId('label1');
sdk.applyStyle('#' + divId + ' span', "color", "#FF0000");
```

#### `sdk.applyStyles(selector, styles)`
Applies multiple CSS styles to elements.

**Parameters:**
- `selector` (string): CSS selector
- `styles` (object): Object with CSS property-value pairs

**Usage:**
```javascript
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, { "height": "1440px" });
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
    ['datagrid1'],
    ['Summary Report'],
    [['startdate', 'enddate', 'marketprofileid']],
    "Ledger Report"
);
```

---

## Component & Widget IDs Reference

### Connection IDs (Data Sources)

**KPI Connections:**
- `C_1` to `C_4`: 4 connections for KPI metrics

**Summary Report Connections:**
- `C_5` to `C_10`: Connections for summary report table data

### Chart Widget IDs

**KPI Cards:**
- `label_[overdue_value]`: Total Overdue value
- `label_[credit_limit_value]`: Credit Limit value
- `label_[outstanding_value]`: Total Outstanding value
- `label_[available_limit_value]`: Available Limit value
- `icon_[overdue_icon]`: Total Overdue icon
- `icon_[credit_limit_icon]`: Credit Limit icon
- `icon_[outstanding_icon]`: Total Outstanding icon
- `icon_[available_limit_icon]`: Available Limit icon

**Summary Report Table:**
- `datagrid1`: Summary Report data grid widget

### Component Groups

- `kpi_cards`: KPI cards group
- `summary_report`: Summary Report table group
- `filter`: Filter modal group
- `customDateFilter`: Custom date picker group

### Header Components

- `label_title`: Dashboard title "Ledger Report"
- `svg_filter`: Filter icon button
- `svg_export`: Export icon button (Excel)
- `svg_share`: Share/send icon button

### Filter Components

**Filter Modal:**
- `box229`: Filter modal container
- `box57`: Container component (hidden by default)
- `label250`: Cancel button
- `label251`: Apply button
- `customDateFilter`: Custom date picker group (shown when Custom Date Range is selected)

**Filter Dropdowns (with border styling):**
- `hfilter25`: Filter dropdown widget 1 (border: `1px solid #7A7A7A`)
- `hfilter33`: Filter dropdown widget 2 (border: `1px solid #7A7A7A`)
- `hfilter34`: Filter dropdown widget 3 (border: `1px solid #7A7A7A`)
- `hfilter36`: Filter dropdown widget 4 (border: `1px solid #7A7A7A`)
- `hfilter38`: Filter dropdown widget 5 (border: `1px solid #7A7A7A`)

**Global Variable Widget:**
- `label41`: Widget storing global variables (`Value1`, `Value2`, `Value_DS`, `Value_SE`, `Value_FE`, `Value_OG`, `Value_ORG`, `Value_SK`, `Value_LT`)

**Display Components:**
- `label50`: Page number display label (shows "Showing records of page number : X")

### Export Components

- `svg_export`: Excel export icon
- `svg_share`: Share/send icon

---

## Dashboard Initialization Script

### Purpose

Executes on page load to set default filters, configure widget properties, initialize dashboard state, style filter components, and prepare the dashboard for user interaction.

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
sdk.updateGlobalVariable('label41', {'Value2': lastDayEnd}, false);            // End date
sdk.updateGlobalVariable('label41', {'Value_DS': 'ExistingMB'}, false);        // Data source filter
sdk.updateGlobalVariable('label41', {'Value_SE': 'Balu Mani'}, false);         // SE (Sales Executive?) filter
sdk.updateGlobalVariable('label41', {'Value_FE': 'Shishir S Nair'}, false);    // FE (Finance Executive?) filter
sdk.updateGlobalVariable('label41', {'Value_OG': 'No Organization Group'}, false);  // Organization Group filter
sdk.updateGlobalVariable('label41', {'Value_ORG': '14688'}, false);            // Organization ID filter
sdk.updateGlobalVariable('label41', {'Value_SK': '0'}, false);                 // Pagination offset (start from 0)
sdk.updateGlobalVariable('label41', {'Value_LT': '10'}, false);                // Limit value (10 records per page)

// Set additional SDK context variables
sdk.setContext('init_load', 'Yes');              // Initial load flag
sdk.setContext('skip_count', 0);                 // Skip count for pagination
sdk.setContext('page_size', 10);                 // Page size (10 records per page)
sdk.setContext('page_number', 1);                // Current page number (starts at 1)

// Update page display label
sdk.setValue('label50', 'Showing records of page number : ' + sdk.getContext('page_number'));

// Set date tab selection context
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
- `hfilter25`: Filter dropdown widget 1
- `hfilter33`: Filter dropdown widget 2
- `hfilter34`: Filter dropdown widget 3
- `hfilter36`: Filter dropdown widget 4
- `hfilter38`: Filter dropdown widget 5
- `box57`: Container component (hidden)

**Display Components:**
- `label50`: Page number display label
- `label41`: Global variable widget storing filter values

**Component Groups:**
- `filter`: Filter modal group (hidden by default)

### Execution Notes

- Script executes immediately on page load
- Filter modal hidden by default
- Custom date range selected by default (January 1, 2024 to yesterday)
- Default pagination: 10 records per page, starting from page 1
- Default filters applied: Data source, Sales Executive, Finance Executive, Organization Group, Organization ID
- First load flag prevents user interactions for first 3 seconds
- Border styling applied to all filter dropdowns for consistent appearance
- All date calculations handle month/year boundaries automatically

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

### Implementation Logic

**1. Data Extraction:**
```javascript
if((changedItem.attributes.data).length > 0) {
    var val = changedItem.attributes.data[0].total_overdue;
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
val = currency + ' ' + formatValue(val);
// Example: 'AED 3.8M'
```

**4. Negative Value Handling:**
```javascript
if (val < 0) {
    val = '-' + formatValue(Math.abs(val));  // Ensure negative sign displayed
    // Apply red/warning styling
}
```

**5. Value Assignment:**
```javascript
sdk.setValue('label_[overdue_value]', val);
```

### Key Features

1. **Automatic Formatting**: Large numbers automatically abbreviated for better readability
2. **Currency Awareness**: Values prefixed with appropriate currency symbol (determined by system configuration)
3. **Fallback Handling**: Displays `'--'` when no data available
4. **Negative Value Support**: Properly handles and displays negative values (e.g., Available Limit)
5. **Currency Default**: Default currency is typically AED (UAE Dirham)

---

## Summary Report Table

### Purpose

Displays detailed ledger entries in a tabular format, showing all transaction details including particulars, trip information, statement details, amounts, and due dates.

### Table Structure

**Table Title:** "Summary Report"

**Column Headers (13 columns):**

1. **Particulars**
   - Transaction identifier or reference number
   - Example: "1P-804962"
   - Format: Alphanumeric identifier

2. **Trip**
   - Trip identifier or booking reference
   - Example: "M-6L8G7"
   - Format: Alphanumeric code

3. **Statement Id**
   - Statement identifier number
   - Example: "100,363"
   - Format: Numeric with comma separators

4. **Order Reference**
   - Order or booking reference
   - Example: "Email confirmation" or empty
   - Format: Text or empty

5. **Approved**
   - Approval date
   - Example: "02-01-2024"
   - Format: `DD-MM-YYYY`

6. **Trip Tags**
   - Tags associated with the trip
   - Example: "Ali Kafil-Hussain, Noon KSA, minutes general, Noon in Minutes"
   - Format: Comma-separated text

7. **Item**
   - Type of item/service
   - Example: "Hotel", "Flight", "Flight, Hotel"
   - Format: Single or comma-separated item types

8. **Voucher**
   - Voucher number(s)
   - Example: "837,584,462" or "176-6072706321"
   - Format: Numeric with separators, can be multiple comma-separated

9. **For**
   - Customer or account name
   - Example: "IBRAHIM ADEL ABDELMOLA IBRAHIM"
   - Format: Full name text

10. **Debit**
    - Debit amount
    - Example: "35", "1,485"
    - Format: Numeric with comma separators
    - Currency: Based on system configuration

11. **Credit**
    - Credit amount
    - Example: "0"
    - Format: Numeric with comma separators
    - Currency: Based on system configuration

12. **Balance**
    - Current balance amount
    - Example: "10,848"
    - Format: Numeric with comma separators
    - Currency: Based on system configuration

13. **Statement Due Date**
    - Due date for the statement
    - Example: "16-03-2024"
    - Format: `DD-MM-YYYY`

### Table Features

**Visual Styling:**
- **Header Row**: Yellow background for column headers
- **Data Rows**: Alternating white and light blue backgrounds for readability
- **Scrollbar**: Vertical scrollbar for long lists of entries
- **Row Hover**: Highlight on row hover for better UX

**Data Grid Widget:**
- Widget ID: `datagrid1` (or similar)
- Supports pagination
- Supports sorting by columns
- Supports filtering
- Supports export functionality

**Data Formatting:**
- **Dates**: Displayed in `DD-MM-YYYY` format
- **Numbers**: Formatted with comma separators for thousands
- **Currency**: Based on system configuration
- **Empty Values**: Displayed as empty cells

**Sample Data Row:**
```
Particulars: "1P-804962"
Trip: "M-6L8G7"
Statement Id: "100,363"
Order Reference: (empty)
Approved: "02-01-2024"
Trip Tags: "Ali Kafil-Hussain, Noon KSA, minutes general, Noon in Minutes"
Item: "Hotel"
Voucher: "837,584,462"
For: "IBRAHIM ADEL ABDELMOLA IBRAHIM"
Debit: "35"
Credit: "0"
Balance: "10,848"
Statement Due Date: "16-03-2024"
```

### Table Functionality

**Sorting:**
- Click column headers to sort ascending/descending
- Multi-column sorting support
- Visual indicators for sort direction

**Filtering:**
- Column-level filtering
- Global search functionality
- Date range filtering
- Status filtering

**Pagination:**
- Page size configuration (e.g., 10, 25, 50, 100 rows per page)
- Page navigation controls
- Total record count display

**Export:**
- Export to Excel functionality
- Export filtered/visible data only
- Includes all columns in export

---

## Filter Modal Script

**Trigger:** Click on filter icon

**Modal Title:** "Data Source" and "Choose the date"

**Modal Structure:**
The filter modal is a centered white overlay dialog on a blurred dark background that allows users to configure multiple filters for the ledger report.

### Modal Sections

**1. Modal Header:**
- **Title**: "Data Source" and "Choose the date" displayed at the top
- **Close Button**: X icon in the top right corner
- Closes modal when clicked without applying changes

**2. Data Source Section:**
- **Section Label**: "Data Source"
- **Dropdown Widget**: `hfilter25` (or similar)
- **Currently Selected**: "ExistingMB"
- **Type**: Dropdown menu with downward-pointing arrow
- **Purpose**: Filters data by data source type
- **Default Value**: "ExistingMB"

**3. Choose the date Section:**
- **Section Label**: "Choose the date"
- **Radio Button Group**: Two options for date selection
  - **"As of Now"** (unselected)
    - Shows current data as of the current moment
    - No date range selection when selected
  - **"Custom Date Range"** (selected by default)
    - Allows user to select custom start and end dates
    - When selected, shows date input fields below
    - Indicated by blue filled circle
- **Date Input Fields** (shown when "Custom Date Range" is selected):
  - **Start Date Input Field:**
    - Date picker widget for selecting start date
    - Format displayed: `DD-MM-YYYY` (e.g., "01-01-2024")
    - Stored internally as `YYYY-MM-DD` format
    - Example value: "01-01-2024"
  - **End Date Input Field:**
    - Date picker widget for selecting end date
    - Format displayed: `DD-MM-YYYY` (e.g., "15-12-2025")
    - Stored internally as `YYYY-MM-DD` format
    - Example value: "15-12-2025"

**4. Sales Executive Section:**
- **Section Label**: "Sales Executive"
- **Dropdown Widget**: `hfilter33` (or similar)
- **Currently Selected**: "Balu Mani"
- **Type**: Dropdown menu
- **Purpose**: Filters data by assigned sales executive
- **Default Value**: "Balu Mani"

**5. Finance Executive Section:**
- **Section Label**: "Finance Executive"
- **Dropdown Widget**: `hfilter34` (or similar)
- **Currently Selected**: "Shishir S Nair"
- **Type**: Dropdown menu
- **Purpose**: Filters data by assigned finance executive
- **Default Value**: "Shishir S Nair"

**6. Organization Group Section:**
- **Section Label**: "Organization Group"
- **Dropdown Widget**: `hfilter36` (or similar)
- **Currently Selected**: "No Organization Group"
- **Type**: Dropdown menu
- **Purpose**: Filters data by organization group
- **Default Value**: "No Organization Group"

**7. Organization Section:**
- **Section Label**: "Organization"
- **Dropdown Widget**: `hfilter38` (or similar)
- **Currently Selected**: "247 Charters Tourism" (example from snapshot)
- **Type**: Dropdown menu
- **Purpose**: Filters data by specific organization
- **Default Value**: "14688" (Organization ID in initialization script)
- **Note**: May display organization name or ID depending on configuration

**8. Action Buttons Section:**
- **Cancel Button**:
  - Light blue border with white background
  - Closes modal without applying changes
  - Resets filter selections to previous state
- **Apply Button**:
  - Solid blue background with white text
  - Applies selected filters to dashboard
  - Triggers connection reloads and data refresh
  - Closes modal after applying

### Date Range Selection Logic

**As of Now Option:**
- When "As of Now" is selected:
  - Date input fields are hidden
  - Data shows current state as of the current moment
  - No date range filtering applied
  - `cdc` context variable set to `false`

**Custom Date Range Option:**
- When "Custom Date Range" is selected:
  - Date input fields become visible
  - User can select custom start and end dates
  - Dates stored in `YYYY-MM-DD` format internally
  - Dates displayed in `DD-MM-YYYY` format in UI
  - `cdc` context variable set to `true`
  - `date_tab_selected` context variable set to `'custom_date'`

**Date Format:**
- **Display Format**: `DD-MM-YYYY` (e.g., "01-01-2024", "15-12-2025")
- **Storage Format**: `YYYY-MM-DD` (e.g., "2024-01-01", "2025-12-15")
- **API Format**: `YYYY-MM-DD` (ISO 8601 compliant)

### Filter Application Flow

```
User Clicks Filter Icon
    ↓
Modal Opens (filter group shown)
    ↓
User Selects Filters:
    - Data Source
    - Date Range (As of Now or Custom Date Range)
    - Sales Executive
    - Finance Executive
    - Organization Group
    - Organization
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
  - `Value_DS`: Data Source value
  - `Value_SE`: Sales Executive value
  - `Value_FE`: Finance Executive value
  - `Value_OG`: Organization Group value
  - `Value_ORG`: Organization value
  - `Value1`: Start date (if custom date selected)
  - `Value2`: End date (if custom date selected)
- Context variables updated:
  - `sdt`: Start date
  - `edt`: End date
  - `cdc`: Custom date check flag
  - `date_tab_selected`: Date tab selection

**On Cancel:**
- Modal closes without applying changes
- Previous filter state maintained
- No data refresh triggered

### Widget IDs Reference

**Filter Dropdowns:**
- `hfilter25`: Data Source dropdown
- `hfilter33`: Sales Executive dropdown
- `hfilter34`: Finance Executive dropdown
- `hfilter36`: Organization Group dropdown
- `hfilter38`: Organization dropdown

**Date Selection:**
- Radio buttons for "As of Now" and "Custom Date Range"
- Start Date date picker widget
- End Date date picker widget

**Action Buttons:**
- Cancel button widget
- Apply button widget

**Modal Container:**
- `box229`: Filter modal container (or similar)
- `filter`: Filter modal group

---

## Export Scripts

### Excel Export

**Trigger:** Click on Excel export icon (`svg_export`)

**Unique Logic:**
1. **Data Selection**: Exports Summary Report table data
2. **Filter Application**: Exports filtered data based on current filters
3. **Parameter Mapping**: Maps filter parameters (date range, data source, executives, organizations)
4. **Export Execution**: Calls `sdk.excelExport()` with configuration

**Export Configuration:**
```javascript
sdk.excelExport(
    ['datagrid1'],
    ['Summary Report'],
    [['startdate', 'enddate', 'datasource', 'salesexecutive', 'financeexecutive', 'organizationgroup', 'organization']],
    "Ledger Report"
);
```

**Exported Data:**
- All visible columns from Summary Report table
- Current filter settings applied
- Formatted data with proper date and number formatting
- Includes KPI summary if applicable

### Share/Send Functionality

**Trigger:** Click on share/send icon (`svg_share`)

**Unique Logic:**
1. **Data Preparation**: Prepares current dashboard state
2. **Share Options**: Provides sharing options (email, link, etc.)
3. **Export Format**: May export as PDF or generate shareable link

---

## Data Structure & Context Management

### SDK Context Variables

**Filter State:**
- `sdt`: Start date (YYYY-MM-DD format) - Default: `'2024-01-01'`
- `edt`: End date (YYYY-MM-DD format) - Default: Yesterday's date
- `cdc`: Custom date check flag (`true` = custom date selected) - Default: `true`
- `adg`: Additional flag - Default: `false`
- `date_tab_selected`: Date tab selection - Default: `'custom_date'`

**Pagination State:**
- `skip`: Pagination skip value (string) - Default: `'0'` (start from first record)
- `skip_count`: Skip count for pagination (number) - Default: `0`
- `page_size`: Page size (records per page) - Default: `10`
- `page_number`: Current page number - Default: `1`

**Load State:**
- `firstLoad`: First load flag (`true` initially, reset to `false` after 3 seconds) - Default: `true`
- `init_load`: Initial load flag - Default: `'Yes'`

**User Information:**
- `dashboard_user`: User object containing `authToken` and permissions
- `homeURL`: Base URL for API calls

**Table State:**
- `sortColumn`: Column name for sorting
- `sortDirection`: Sort direction (`'asc'` or `'desc'`)

### Global Variables (stored in `label41`)

**Date Range:**
- `Value1`: Start date (YYYY-MM-DD) - Default: `'2024-01-01'`
- `Value2`: End date (YYYY-MM-DD) - Default: Yesterday's date

**Data Source:**
- `Value_DS`: Data source filter - Default: `'ExistingMB'`

**Executive Filters:**
- `Value_SE`: Sales Executive filter - Default: `'Balu Mani'`
- `Value_FE`: Finance Executive filter - Default: `'Shishir S Nair'`

**Organization Filters:**
- `Value_OG`: Organization Group filter - Default: `'No Organization Group'`
- `Value_ORG`: Organization ID filter - Default: `'14688'`

**Pagination:**
- `Value_SK`: Pagination offset - Default: `'0'` (start from first record)
- `Value_LT`: Limit value (records per page) - Default: `'10'` (10 records per page)

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

---

## Notes

- All currency values default to AED (UAE Dirham) based on system configuration
- Date formats: Display uses `DD-MM-YYYY`, storage uses `YYYY-MM-DD`
- Summary Report table supports pagination, sorting, and filtering
- KPI values are calculated in real-time based on filtered data
- Available Limit can be negative when outstanding exceeds credit limit
- Export functionality exports currently filtered/visible data only
- The initialization script runs automatically on page load
- All amounts displayed with appropriate currency symbols (determined by system configuration)
- Filter modal includes 6 filter types: Data Source, Date Range, Sales Executive, Finance Executive, Organization Group, and Organization

---

**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Author**: Ledger Dashboard Development Team

