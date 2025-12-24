# Organization Traveller Tracker Dashboard - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Global Filters](#global-filters)
3. [KPI Metrics Reference](#kpi-metrics-reference)
4. [SDK Methods Reference](#sdk-methods-reference)
5. [Component & Widget IDs Reference](#component--widget-ids-reference)
6. [Dashboard Initialization Script](#dashboard-initialization-script)
7. [KPI Tile Value Updates](#kpi-tile-value-updates)
8. [Geographic Distribution Map](#geographic-distribution-map)
9. [Filter Modal Script](#filter-modal-script)
10. [Export Scripts](#export-scripts)
11. [Data Structure & Context Management](#data-structure--context-management)

---

## Overview

The Organization Traveller Tracker Dashboard is a vanilla JavaScript application using jQuery and a proprietary Dashboard SDK. It provides comprehensive tracking and analytics for organization travellers, displaying trip statuses (Ongoing, Upcoming, Completed) and geographic distribution of trips.

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
6. **Interactive Metric Cards**: Clicking metric cards triggers detailed trend analysis

---

## Global Filters

The Organization Traveller Tracker Dashboard provides global filtering capabilities that allow users to refine trip data based on various criteria.

### Available Filters

**Date Range:**
- Filters data between the specified start and end dates
- Supports predefined ranges (Last 1 Day, Last 7 Days, Last 30 Days) and custom date selection
- **Date Format**:
  - **Display Format**: `DD-MM-YYYY` (e.g., "01-01-2024") - shown in date picker inputs
  - **Storage Format**: `YYYY-MM-DD` (e.g., "2024-01-01") - ISO 8601 compliant, used internally and for API calls
- Stored in SDK context as `sdt` (start date) and `edt` (end date)
- Also stored in global variables as `Value` (start date) and `Value1` (end date)

**Market Profile:**
- Filters market profiles based on selected value
- Stored in SDK context as `mProfile` or global variable
- Dropdown menu with market profile options
- Example values: "Year" (as shown in snapshot) or specific market profiles
- Affects trip data filtering by market region

**Organization Group:**
- Filters data by organization group
- Stored in global variable `Value_OG` (or similar)
- Dropdown menu with organization group options
- Example values: "Year" (as shown in snapshot) or specific organization groups
- Default value may vary

**Organization:**
- Filters data by specific organization
- Stored in global variable `Value_ORG` (or similar)
- Dropdown menu with organization options
- Example values: "Year" (as shown in snapshot) or specific organization names/IDs
- Default value may vary

### Filter Application

**Filter Modal:**
- **Trigger**: Clicking the filter icon in the dashboard header
- **Modal Title**: "Choose the date"
- **Modal Structure**:
  1. **Header Section**:
     - Modal title: "Choose the date" displayed at the top left
     - Close button (X icon) in top right corner
  2. **Date Range Selection**:
     - Radio button group with options:
       - "Last 1 day" (unselected)
       - "Last 7 days" (unselected)
       - "Last 30 days" (selected by default, indicated by blue filled circle)
       - "Custom Date" (unselected)
     - When "Last 30 days" is selected, date range is calculated automatically
  3. **Select Date Range Section** (shown when Custom Date or Last 30 days is selected):
     - Section heading: "Select Date Range"
     - **Start Date Input Field**:
       - Date picker widget for selecting start date
       - Format displayed: `DD-MM-YYYY` (e.g., "01-01-2025")
       - Stored internally as `YYYY-MM-DD` format
       - Example value: "01-01-2025"
     - **End Date Input Field**:
       - Date picker widget for selecting end date
       - Format displayed: `DD-MM-YYYY` (e.g., "17-12-2025")
       - Stored internally as `YYYY-MM-DD` format
       - Example value: "17-12-2025"
  4. **Market Profile Section**:
     - Section heading: "Market Profile"
     - Dropdown menu with market profile options
     - Currently selected value displayed: "Year" (example from snapshot)
     - Down arrow icon indicates expandable menu
  5. **Organization Group Section**:
     - Section heading: "Organization Group"
     - Dropdown menu with organization group options
     - Currently selected value displayed: "Year" (example from snapshot)
     - Down arrow icon indicates expandable menu
  6. **Organization Section**:
     - Section heading: "Organization"
     - Dropdown menu with organization options
     - Currently selected value displayed: "Year" (example from snapshot)
     - Down arrow icon indicates expandable menu
  7. **Action Buttons**:
     - **Cancel Button**:
       - Outlined in blue with white text
       - Closes modal without applying changes
     - **Apply Button**:
       - Filled with blue background and white text
       - Applies selected filters to dashboard
       - Triggers connection reloads and data refresh

**Filter State Management:**
- Filter selections stored in SDK context for persistence
- Global variables updated via `sdk.updateGlobalVariable()`
- Context variables updated via `sdk.setContext(key, value)`
- Filter changes trigger connection reloads to refresh dashboard data

**Filter Reset:**
- Default date range: Last 30 days (calculated dynamically)
- Default market profile: May vary (example shows "Year")
- Default organization group: May vary (example shows "Year")
- Default organization: May vary (example shows "Year")
- Reset occurs on dashboard initialization or when filters are cleared

### Filter Impact on Data

**Date Range Impact:**
- All KPI tiles recalculate values based on selected date range
- Geographic map updates to show trips within selected period
- Trip status counts update based on date range
- When "Last 30 days" is selected, date range is automatically calculated and displayed

**Market Profile Impact:**
- KPI tiles filter to show trips for selected market profile
- Geographic map filters to show locations for selected market profile
- Trip counts update based on market profile selection
- Affects trip data filtering by market region

**Organization Filter Impact:**
- KPI tiles filter to show trips for selected organization(s)
- Geographic map filters to show locations for selected organization(s)
- Trip counts update based on organization selection
- Organization Group filter may cascade to Organization dropdown options

---

## KPI Metrics Reference

This section provides detailed descriptions of all Key Performance Indicators (KPIs) displayed in the Organization Traveller Tracker Dashboard.

### KPI Cards

#### 1. Ongoing Trips

**Description:**
This metric displays the total count of trips that are currently in progress. It represents all active trips where travellers are currently travelling or trips that have started but not yet completed.

**Attributes:**
- `ongoing_trips` (numeric)
  - The total count of ongoing trips
  - Includes trips that have started and are currently active
  - Displayed as a whole number (no decimal places)
  - Example: `9` represents 9 ongoing trips

**Visual Elements:**
- **Icon**: Icon depicting a person with a suitcase and an arrow (representing active travel)
- **Color Scheme**: Typically displayed in blue or active status color
- **Format**: Whole number display
- **Information Icon**: "i" icon in a circle on the top right for additional details

**Widget IDs:**
- `label_[ongoing_value]`: KPI tile display value
- `icon_[ongoing_icon]`: Ongoing trips icon widget
- `icon_[info_ongoing]`: Information icon widget

**Data Source:**
- Calculated from trips where `Trip Start Date <= Current Date` and `Trip End Date >= Current Date` and `Status = 'Ongoing'`

**Interactive Behavior:**
- Clicking the card triggers detailed trend analysis
- Chart and data update automatically based on selection
- Shows trend data for ongoing trips over time

#### 2. Upcoming Trips

**Description:**
This metric displays the total count of trips that are scheduled to occur in the future. It represents all trips that have been booked but have not yet started.

**Attributes:**
- `upcoming_trips` (numeric)
  - The total count of upcoming trips
  - Includes trips scheduled for future dates
  - Displayed as a whole number (no decimal places)
  - Example: `0` represents no upcoming trips

**Visual Elements:**
- **Icon**: Icon depicting a calendar with a suitcase (representing scheduled travel)
- **Color Scheme**: Typically displayed in informational or neutral color
- **Format**: Whole number display
- **Information Icon**: "i" icon in a circle on the top right for additional details

**Widget IDs:**
- `label_[upcoming_value]`: KPI tile display value
- `icon_[upcoming_icon]`: Upcoming trips icon widget
- `icon_[info_upcoming]`: Information icon widget

**Data Source:**
- Calculated from trips where `Trip Start Date > Current Date` and `Status = 'Upcoming'`

**Interactive Behavior:**
- Clicking the card triggers detailed trend analysis
- Chart and data update automatically based on selection
- Shows trend data for upcoming trips over time

#### 3. Completed Trips

**Description:**
This metric displays the total count of trips that have been completed. It represents all trips that have finished, providing insights into historical travel activity.

**Attributes:**
- `completed_trips` (numeric)
  - The total count of completed trips
  - Includes all trips that have ended
  - Displayed as a whole number (no decimal places)
  - Example: `506` represents 506 completed trips

**Visual Elements:**
- **Icon**: Icon depicting a checkmark inside a suitcase (representing completed travel)
- **Color Scheme**: Typically displayed in success or completed status color
- **Format**: Whole number display
- **Information Icon**: "i" icon in a circle on the top right for additional details

**Widget IDs:**
- `label_[completed_value]`: KPI tile display value
- `icon_[completed_icon]`: Completed trips icon widget
- `icon_[info_completed]`: Information icon widget

**Data Source:**
- Calculated from trips where `Trip End Date < Current Date` and `Status = 'Completed'`

**Interactive Behavior:**
- Clicking the card triggers detailed trend analysis
- Chart and data update automatically based on selection
- Shows trend data for completed trips over time

### KPI Calculation Methods

**Value Formatting:**
- All trip counts displayed as whole numbers (no decimal places)
- Large numbers may be formatted with abbreviations (K/M/B format) if needed
- Zero values displayed as `0`

**Status Determination:**
- **Ongoing**: Trip has started but not yet ended
- **Upcoming**: Trip start date is in the future
- **Completed**: Trip end date is in the past

**Date-Based Filtering:**
- All KPIs respect the selected date range filter
- Calculations based on trip dates within the filter range
- Current date used as reference point for status determination

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
var selectedMetric = sdk.getContext('selectedMetric');
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
sdk.setContext('selectedMetric', 'ongoing_trips');
```

### Widget Management

#### `sdk.getWidget(widgetId)`
Retrieves widget object for property access and manipulation.

**Parameters:**
- `widgetId` (string): Widget ID

**Returns:** Widget object

**Usage:**
```javascript
var map = sdk.getWidget('map1');
map.m_zoomLevel = 5;
map.draw();
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
sdk.setValue('label1', 'Ongoing Trips:');
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
sdk.showGroup(['kpi_cards', 'geographic_map']);
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
sdk.updateGlobalVariable('label41', {'Value': '2024-01-01', 'Value1': '2024-01-31'}, false);
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
sdk.applyStyle('#' + divId + ' span', "color", "#0083FF");
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

#### Excel Export Function

The Excel export functionality uses a connection-based approach where the export logic runs within connection `C_9` when data is received.

**Export Trigger:**
```javascript
sdk.reload(['C_9']);
```

**Note:** This implementation differs from the standard `sdk.excelExport()` method. Instead, it uses a connection-based approach where the export logic runs within the connection's data handler, allowing for more control over the export process and dynamic library loading.

**For complete implementation details, see [Export Scripts](#export-scripts) section.**

---

## Component & Widget IDs Reference

### Connection IDs (Data Sources)

**Dashboard Connections (reloaded on initialization):**
- `C_2`: Connection for dashboard data
- `C_3`: Connection for dashboard data
- `C_5`: Connection for dashboard data
- `C_6`: Connection for dashboard data
- `C_7`: Connection for dashboard data
- `C_8`: Connection for dashboard data
- `C_10`: Connection for dashboard data
- **Total**: 7 connections reloaded on page load

**Filter Connections:**
- `C_27`: Filter data connection (reloaded when filter button clicked to fetch latest filter options)

**Status Filter Connections:**
- `C_6`: Dashboard data connection (reloaded when Ongoing/Upcoming/Completed KPI card clicked)
- `C_12`: Additional data connection (reloaded when Ongoing/Upcoming/Completed KPI card clicked)

**Traveller Details Connections:**
- `C_8`: Traveller details data connection (reloaded on marker click)
- `C_MW`: Additional data connection (reloaded on marker click)

**Export Connections:**
- `C_9`: Traveller data export connection (reloaded when Excel export button clicked, provides data for Excel export)

**Additional Connections:**
- `C_1`: Additional connection (not reloaded on initialization)
- `C_4`: Additional connection (not reloaded on initialization)

### Chart Widget IDs

**KPI Cards:**
- `label_[ongoing_value]`: Ongoing Trips value
- `label_[upcoming_value]`: Upcoming Trips value
- `label_[completed_value]`: Completed Trips value
- `icon_[ongoing_icon]`: Ongoing Trips icon
- `icon_[upcoming_icon]`: Upcoming Trips icon
- `icon_[completed_icon]`: Completed Trips icon
- `icon_[info_ongoing]`: Ongoing Trips information icon
- `icon_[info_upcoming]`: Upcoming Trips information icon
- `icon_[info_completed]`: Completed Trips information icon

**Geographic Map:**
- `map`: Map container div element (Leaflet map)
- `bizvizchart`: Chart widget providing map data (via `getData()` method)
- `box80`: Geographic distribution chart container (used in guided tour)

**Location Filters:**
- `filter83`: Location dropdown filter (used in guided tour)

**Traveller Details Components:**
- `label72`: Location label widget (displays selected location name)
- `view_grid`: Traveller details grid group (shown when marker clicked)
- `datagrid_[traveller_details]`: Traveller details data grid widget
- `box74`: Traveller details table (commented out in guided tour)
- `filter80`: Traveller ID dropdown filter (commented out in guided tour)

**Trend Analysis Charts:**
- `chart1`: Trend analysis chart widget (updates based on selected metric)

### Component Groups

- `kpi_cards`: KPI cards group
- `geographic_map`: Geographic distribution map group
- `trend_analysis`: Trend analysis chart group (shown when metric card clicked)
- `view_grid`: Traveller details grid group (shown when map marker clicked)
- `filter`: Filter modal group
- `tab2`: Tab 2 group (hidden by default)
- `filter_status`: Filter status group (hidden by default)
- `tip_banner`: Tip banner group
- `customDateFilter`: Custom date picker group

### Header Components

- `label_title`: Dashboard title "Organization Traveller Tracker"
- `svg_filter`: Filter icon button
- `svg_export`: Export icon button (Excel)
- `svg_share`: Share/send icon button
- `label252`: Filter button (used in guided tour)
- `svg275`: Export icon button (used in guided tour)

### Tip Banner Components

- `tip_banner`: Yellow tip banner container
- `icon_lightbulb`: Lightbulb icon
- `label_tip_text`: Tip text label
- `box134`: Tip message bar container (used in guided tour)

### Filter Components

**Filter Modal:**
- `box229`: Filter modal container (height and width adjusted based on layout type and custom date selection)
- `label250`: Cancel button (position adjusted based on layout and date selection)
- `label251`: Apply button (position adjusted based on layout and date selection)
- `customDateFilter`: Custom date picker group (shown when Custom Date is selected, hidden when predefined date selected)

**Date Range Selection:**
- Radio buttons for "Last 1 day", "Last 7 days", "Last 30 days", "Custom Date"
- `filter93`: Date range filter component (position adjusted based on layout and date selection)
- Start Date date picker widget
- End Date date picker widget

**Filter Labels:**
- `label242`: Date range label (position adjusted based on layout and date selection)
- `label243`: Date range label (position adjusted based on layout and date selection)
- `label81`: Filter label (position adjusted based on layout and date selection)
- `label82`: Filter label (position adjusted based on layout and date selection)
- `label_QM`: Filter label (position adjusted based on layout and date selection)
- `label80`: Filter label (position adjusted based on layout and date selection)

**Filter Dropdowns:**
- `filter94`: Organization filter dropdown (shown when filter button clicked, position adjusted based on layout and date selection)
- `filter81`: Additional filter dropdown (position adjusted based on layout and date selection)
- `hfilter_[market_profile]`: Market Profile dropdown widget
- `hfilter_[organization_group]`: Organization Group dropdown widget
- `hfilter_[organization]`: Organization dropdown widget

### Container Components

- `box76`: Container component for Ongoing status view (shown by default, shown when Ongoing status clicked, hidden when Upcoming or Completed status clicked)
- `box77`: Container component for Upcoming status view (hidden by default, shown when Upcoming status clicked, hidden when Ongoing or Completed status clicked)
- `box_QD`: Container component for Completed status view (hidden by default, shown when Completed status clicked, hidden when Ongoing or Upcoming status clicked)
- `box277`: Main container box (height configured based on layout type and view state)

### Status Card Components

**KPI Cards (Status Filter):**
- `box111`: Ongoing trips KPI card (background color updated on click)
- `box114`: Upcoming trips KPI card (background color updated on status click)
- `box_GG`: Completed trips KPI card (background color updated on status click)

**KPI Cards (Tour/Display):**
- `box72`: Ongoing trips KPI card (used in guided tour)
- `box73`: Upcoming trips KPI card (used in guided tour)
- `box_ZJ`: Completed trips KPI card (used in guided tour)

### Label Components

- `label79`: Filter display label (shows current filter values: dates, market profile, organization, status)
- `label108`: Label component (hidden by default)
- `label111`: Label component (hidden by default)
- `label142`: Label component (hidden by default)

### Radio Components

- `radio106`: Radio component (hidden by default)

### Global Variable Widget

- `label283`: Widget storing global variables (`Value`, `Value1`, `Value_MPID`, `Value_NM`, `Value_ORGrpId`, `Value_ORG`, `Value_ST`, `Value_LC`)

---

## Dashboard Initialization Script

### Purpose

Executes on page load to authenticate users, extract user properties, set default filters, configure widget properties, initialize dashboard state, and prepare the dashboard for user interaction.

### Execution Flow

```
Page Load
    ↓
Check Duplicate Execution Flag
    ↓
Build Dynamic URLs
    ↓
Authenticate User (AJAX)
    ↓
Parse User Properties
    ↓
Extract Market Profile and Organization ID
    ↓
Date Formatting Utility Setup
    ↓
Calculate Default Date Range (Last 30 Days)
    ↓
Set Global Variables (label283)
    ↓
Set SDK Context Variables
    ↓
Show/Hide Component Groups
    ↓
Show/Hide Individual Components
    ↓
Configure Layout Heights (Based on Layout Type)
    ↓
Reload Dashboard Connections
```

### Complete Initialization Script

```javascript
// Duplicate execution prevention
if (window.scriptAlreadyInitialized) {
    console.warn("Script already initialized — skipping duplicate execution.");
    window.scriptAlreadyInitialized = false;
} else {
    window.scriptAlreadyInitialized = true;
    
    /////////////////////// Script for Dynamic URL + Role-based Export ///////////////////////
    
    // Get protocol, hostname, and port to construct homeURL dynamically
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var homeURL = protocol + '//' + hostname;
    if (port) {
        homeURL += ':' + port;
    }
    sdk.setContext('homeURL', homeURL);
    
    // Get user details from dashboard context
    var userDetailObject = sdk.getContext("dashboard_user");
    var auth = userDetailObject.authToken;
    
    // AJAX request to authenticate user and get user information
    var settings = {
        url: "https://viz.musafir.com/cxf/auth/getUserInfoByToken",
        method: "POST",
        timeout: 0,
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/x-www-form-urlencoded"
        },
        data: {
            token: auth,
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log("Response:", response);
        
        // Show raw response in <pre>
        $("#output").text(JSON.stringify(response, null, 2));
        
        // Extract user properties if available
        if (response && response.users && response.users.user) {
            
            var custom_properties = JSON.parse(response.users.user.customproperties);
            
            // Extract market profile and organization ID from user properties
            var market_profile = custom_properties.find(p => p.key === "market_profile_id")?.value;
            var organization_id = custom_properties.find(p => p.key === "organization_id")?.value;
            
            var market_profile_id = JSON.parse(market_profile)[0] + '';
            
            // Date formatting utility function
            function formatDate(date) {
                return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD" format
            }
            
            // Get today's date
            var today = new Date();
            var yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            
            // Last 30 Days
            var lastDayStart = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            var lastDayEnd = formatDate(today); // Note: Uses today, not yesterday
            
            // Set global variables in label283 widget
            sdk.updateGlobalVariable('label283', {'Value': lastDayStart}, false);
            sdk.updateGlobalVariable('label283', {'Value1': lastDayEnd}, false);
            sdk.updateGlobalVariable('label283', {'Value_MPID': market_profile}, false);
            sdk.updateGlobalVariable('label283', {'Value_NM': market_profile_id}, false);
            sdk.updateGlobalVariable('label283', {'Value_ORGrpId': 'No Organization Group'}, false);
            sdk.updateGlobalVariable('label283', {'Value_ORG': organization_id}, false);
            sdk.updateGlobalVariable('label283', {'Value_ST': 'ongoing'}, false);
            sdk.updateGlobalVariable('label283', {'Value_LC': "253,459,645,1094,1917,3859"}, false);
            
            // Set SDK context variables
            sdk.setContext('sdt', lastDayStart);
            sdk.setContext('edt', lastDayEnd);
            sdk.setContext('mProfile', '1');
            sdk.setContext('org_grp_id', 'No Organization Group');
            sdk.setContext('status', 'Ongoing');
            sdk.setContext('status_selected', 'ongoing');
            sdk.setContext('cdc', false);
            sdk.setContext('adg', false);
            sdk.setContext('filter', false);
            sdk.setContext('tabSelected', 'executive_summary');
            sdk.setContext('customDateSelected', false);
            sdk.setContext('adg', true);
            sdk.setContext('pageNumber', '1');
            sdk.setContext('skip', '0');
            sdk.setContext('statusClicked', false);
            sdk.setContext('org_id', organization_id);
            
            // Show/hide component groups
            sdk.hideGroup(['filter', 'tab2', 'filter_status', 'view_grid']);
            
            // Show/hide individual components
            sdk.showComponent(['box76']);
            sdk.hideComponent(['box77']);
            sdk.hideComponent(['label108', 'label111', 'label142', 'radio106']);
            
            // Widget shadow configuration (optional utility function)
            Widget.prototype.setDraggableDivShadow = function () {
                if (IsBoolean(this.getShowShadow())) {
                    var shadow = hex2rgb(convertColorToHex(this.m_shadowcolor), this.m_shadowopacity);
                    $("#draggableDiv" + this.m_objectid).css({
                        "box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
                        "-webkit-box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
                        "-moz-box-shadow": "0 8px 16px 0 rgba(0, 0, 0, 0.2)"
                    });
                } else {
                    // Remove the css property so designMode shadow can be applied if set from preference
                    $("#draggableDiv" + this.m_objectid).css({
                        "box-shadow": "",
                        "-webkit-box-shadow": "",
                        "-moz-box-shadow": ""
                    });
                }
            };
            
            // Configure layout heights based on layout type
            if (sdk.getLayoutType() == "AbsoluteLayout") {
                sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "960px"});
                sdk.applyStyle('#draggableDiv' + sdk.getWidget('box277').m_objectid, 'height', '955px');
                sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box277').m_objectid, 'height', '955px');
            }
            if (sdk.getLayoutType() == "MobileLayout") {
                sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "820px"});
                sdk.applyStyle('#draggableDiv' + sdk.getWidget('box277').m_objectid, 'height', '815px');
                sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box277').m_objectid, 'height', '815px');
            }
            if (sdk.getLayoutType() == "TabletLayout") {
                alert("Tablet Layout");
            }
            
            // Reload dashboard connections
            sdk.reload(['C_2', 'C_3', 'C_5', 'C_6', 'C_7', 'C_8', 'C_10']);
        }
    }).fail(function (xhr, status, error) {
        console.error("AJAX Error:", status, error, xhr.responseText);
        $("#output").text(
            "Request failed.\nStatus: " + xhr.status +
            "\nError: " + error +
            "\nResponse: " + xhr.responseText
        );
    });
}
```

### Key Implementation Details

**1. Duplicate Execution Prevention**
```javascript
if (window.scriptAlreadyInitialized) {
    console.warn("Script already initialized — skipping duplicate execution.");
    window.scriptAlreadyInitialized = false;
} else {
    window.scriptAlreadyInitialized = true;
    // ... initialization code
}
```
- Prevents script from running multiple times on page load
- Uses global flag `window.scriptAlreadyInitialized`

**2. Dynamic URL Construction**
```javascript
var protocol = window.location.protocol;
var hostname = window.location.hostname;
var port = window.location.port;
var homeURL = protocol + '//' + hostname;
if (port) {
    homeURL += ':' + port;
}
sdk.setContext('homeURL', homeURL);
```
- Constructs base URL dynamically from current page location
- Handles cases with and without port numbers
- Stores in SDK context as `homeURL`

**3. User Authentication**
- Retrieves `dashboard_user` from SDK context
- Extracts `authToken` for API calls
- Makes AJAX POST request to `getUserInfoByToken` endpoint
- URL: `https://viz.musafir.com/cxf/auth/getUserInfoByToken`
- Parses response for user properties

**4. User Properties Extraction**
```javascript
var custom_properties = JSON.parse(response.users.user.customproperties);
var market_profile = custom_properties.find(p => p.key === "market_profile_id")?.value;
var organization_id = custom_properties.find(p => p.key === "organization_id")?.value;
var market_profile_id = JSON.parse(market_profile)[0] + '';
```
- Parses `customproperties` JSON string from user object
- Extracts `market_profile_id` and `organization_id` from custom properties
- Converts market profile to string format

**5. Date Formatting Utility**
```javascript
function formatDate(date) {
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD" format
}
```
- Uses `toISOString()` method to get ISO date string
- Splits on `'T'` and takes first part to get date only
- Returns `YYYY-MM-DD` format

**6. Default Date Range Calculation**
- **Last 30 Days**: Calculates date 30 days before today
- **Start Date**: 30 days before today
- **End Date**: Today (not yesterday - note the difference from other dashboards)
- Handles month/year boundaries automatically

**7. Global Variables Setup (label283 widget)**
- `Value`: Start date (`YYYY-MM-DD`)
- `Value1`: End date (`YYYY-MM-DD`)
- `Value_MPID`: Market profile ID (from user properties)
- `Value_NM`: Market profile ID (parsed, first element as string)
- `Value_ORGrpId`: Organization Group ID (`'No Organization Group'`)
- `Value_ORG`: Organization ID (from user properties)
- `Value_ST`: Status filter (`'ongoing'`)
- `Value_LC`: Location IDs (`"253,459,645,1094,1917,3859"`)

**8. SDK Context Variables**
- `sdt`: Start date (`YYYY-MM-DD`)
- `edt`: End date (`YYYY-MM-DD`)
- `mProfile`: Market profile ID (`'1'`)
- `org_grp_id`: Organization Group ID (`'No Organization Group'`)
- `status`: Status (`'Ongoing'`)
- `status_selected`: Selected status (`'ongoing'`)
- `cdc`: Custom date check flag (`false`)
- `adg`: Additional flag (set to `true` after initial `false`)
- `filter`: Filter flag (`false`)
- `tabSelected`: Active tab (`'executive_summary'`)
- `customDateSelected`: Custom date selected flag (`false`)
- `pageNumber`: Page number (`'1'`)
- `skip`: Skip value (`'0'`)
- `statusClicked`: Status clicked flag (`false`)
- `org_id`: Organization ID (from user properties)
- `homeURL`: Base URL (constructed dynamically)

**9. Component Visibility Management**
- **Hidden Groups**: `filter`, `tab2`, `filter_status`, `view_grid`
- **Shown Components**: `box76`
- **Hidden Components**: `box77`, `label108`, `label111`, `label142`, `radio106`

**10. Layout Height Configuration**
- **Absolute Layout**: 
  - Dashboard parent div: `960px`
  - Container box (`box277`): `955px`
  - Canvas element: `955px`
- **Mobile Layout**: 
  - Dashboard parent div: `820px`
  - Container box (`box277`): `815px`
  - Canvas element: `815px`
- **Tablet Layout**: Shows alert (not fully configured)

**11. Connection Reloading**
- Reloads connections: `C_2`, `C_3`, `C_5`, `C_6`, `C_7`, `C_8`, `C_10` (7 connections)
- Executes after all initialization is complete

### Error Handling

**AJAX Failure Handling:**
```javascript
.fail(function (xhr, status, error) {
    console.error("AJAX Error:", status, error, xhr.responseText);
    $("#output").text(
        "Request failed.\nStatus: " + xhr.status +
        "\nError: " + error +
        "\nResponse: " + xhr.responseText
    );
});
```
- Logs errors to console
- Displays error message in `#output` element
- Shows HTTP status, error message, and response text
- Graceful degradation if user info unavailable

### Execution Notes

- Script executes immediately on page load
- User authentication required before dashboard initialization
- Market profile and organization ID extracted from user properties
- Default date range: Last 30 days (from 30 days ago to today)
- Default status: Ongoing trips
- Default organization group: "No Organization Group"
- Layout height adjusts based on layout type (Absolute/Mobile/Tablet)
- Connections reload after initialization completes
- Error handling displays messages in `#output` element

---

## KPI Tile Value Updates

### Purpose

Handles dynamic value updates for KPI tiles when data changes. Formats numeric values and handles metric card click interactions.

### Trigger

Executes when widget data changes (`changedItem` event), typically after connection reload or filter updates.

### Implementation Logic

**1. Data Extraction:**
```javascript
if((changedItem.attributes.data).length > 0) {
    var val = changedItem.attributes.data[0].ongoing_trips;
    // ... processing
} else {
    var val = '0';  // No data available, default to 0
}
```

**2. Value Formatting:**
```javascript
// Format as whole number
val = parseInt(val) || 0;
val = val.toString(); // Convert to string for display
```

**3. Value Assignment:**
```javascript
sdk.setValue('label_[ongoing_value]', val);
```

**4. Metric Card Click Handler:**
```javascript
// When KPI card is clicked
function onMetricCardClick(metricType) {
    // Set selected metric in context
    sdk.setContext('selectedMetric', metricType);
    
    // Show trend analysis group
    sdk.showGroup(['trend_analysis']);
    
    // Reload trend analysis connections
    sdk.reload(['C_7', 'C_8', 'C_9', 'C_10']);
    
    // Update chart based on selected metric
    updateTrendChart(metricType);
}
```

### Key Features

1. **Automatic Formatting**: Trip counts displayed as whole numbers
2. **Fallback Handling**: Displays `0` when no data available
3. **Interactive Cards**: Clicking cards triggers status filtering and dashboard updates
4. **Dynamic Updates**: Values update automatically when filters change
5. **Real-time Calculation**: Trip counts calculated based on current date and filters

---

## KPI Card Click Handlers

### Purpose

Handles click events on KPI cards (Ongoing, Upcoming, Completed) to filter dashboard data by trip status. Updates component visibility, filter display, layout heights, and reloads relevant data connections.

### Ongoing KPI Click Handler

**Trigger:** Click on "Ongoing Trips" KPI card

**Complete Implementation:**

```javascript
// Show/hide components
sdk.showComponent(['box76']);
sdk.hideComponent(['box77', 'box_QD']);

// Set status context and global variable
sdk.setContext('status_selected', 'ongoing');
sdk.updateGlobalVariable('label283', {'Value_ST': 'ongoing'}, false);

// Get filter values from context
var organization_name = sdk.getContext('organization_name');
var sdt = sdk.getContext('sdt');
var edt = sdk.getContext('edt');
var mProfile = sdk.getContext('mProfile');
var org_grp_id = sdk.getContext('org_grp_id');

// Date format conversion utility
function convertDateFormat(dateStr) {
  // Expecting input in format "yy-mm-dd"
  var parts = dateStr.split('-');
  var yy = parts[0];
  var mm = parts[1];
  var dd = parts[2];
  return dd + '-' + mm + '-' + yy;
}

// Convert market profile ID to name
if(mProfile === '1'){
    mProfile = 'UAE';
} else if(mProfile === '2'){
    mProfile = 'India';
} else if(mProfile === '3'){
    mProfile = 'Qatar';
} else {
    mProfile = 'KSA';
}

// Convert dates to display format
var dis_st_date = convertDateFormat(sdt);
var dis_end_date = convertDateFormat(edt);

// Build filter display string
var filterVal = 'Start Date: ' + dis_st_date + ' | End Date: ' + dis_end_date + 
                ' | Market Profile: ' + mProfile + ' | Organization Group: ' + org_grp_id + 
                ' | Organization: ' + organization_name + ' | Status: Ongoing';

// Update filter label
sdk.setValue('label79', filterVal);

// Hide traveller details grid
sdk.hideGroup(['view_grid']);

// Adjust dashboard height (reset to default)
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "900px"});
sdk.applyStyle('#draggableDiv' + sdk.getWidget('box277').m_objectid, 'height', '895px');
sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box277').m_objectid, 'height', '895px');

// Update background colors for status indicators
sdk.changeBGColor('box111', ['#ffffff', '#ffffff']);  // Ongoing card background
sdk.changeBGColor('box114', ['#DBEAFE', '#DBEAFE']);  // Upcoming card background (light blue)
sdk.changeBGColor('box_GG', ['#ffffff', '#ffffff']);  // Completed card background

// Set status clicked flag
sdk.setContext('statusClicked', true);

// Reload connections for filtered data
sdk.reload(['C_6', 'C_12']);
```

### Implementation Details

**1. Component Visibility:**
- **Shown Components**: `box76` (main container)
- **Hidden Components**: `box77`, `box_QD` (alternative containers)

**2. Status Context Updates:**
- Sets `status_selected` context to `'ongoing'`
- Updates global variable `Value_ST` to `'ongoing'` in `label283` widget

**3. Filter Value Retrieval:**
- Retrieves from SDK context:
  - `organization_name`: Organization name
  - `sdt`: Start date (YYYY-MM-DD format)
  - `edt`: End date (YYYY-MM-DD format)
  - `mProfile`: Market profile ID (`'1'`, `'2'`, `'3'`, or other)
  - `org_grp_id`: Organization group ID

**4. Date Format Conversion:**
```javascript
function convertDateFormat(dateStr) {
  // Input format: "yy-mm-dd" (e.g., "24-12-25")
  // Output format: "dd-mm-yy" (e.g., "25-12-24")
  var parts = dateStr.split('-');
  var yy = parts[0];
  var mm = parts[1];
  var dd = parts[2];
  return dd + '-' + mm + '-' + yy;
}
```
- Converts date from `YY-MM-DD` to `DD-MM-YY` format for display
- Used for both start date and end date

**5. Market Profile Conversion:**
- Converts market profile ID to display name:
  - `'1'` → `'UAE'`
  - `'2'` → `'India'`
  - `'3'` → `'Qatar'`
  - Other → `'KSA'` (Saudi Arabia)

**6. Filter Display String:**
- Format: `"Start Date: DD-MM-YY | End Date: DD-MM-YY | Market Profile: [Name] | Organization Group: [Name] | Organization: [Name] | Status: Ongoing"`
- Example: `"Start Date: 25-12-24 | End Date: 17-01-25 | Market Profile: UAE | Organization Group: No Organization Group | Organization: ABC Corp | Status: Ongoing"`
- Displayed in `label79` widget

**7. Component Group Visibility:**
- Hides `view_grid` group (traveller details table)

**8. Layout Height Adjustment:**
- **Dashboard Parent Div**: `900px` (reset from expanded height)
- **Container Box (`box277`)**: `895px`
- **Canvas Element**: `895px`
- Resets dashboard to default height when traveller details are hidden

**9. Background Color Updates:**
- **`box111`**: Ongoing card background → White (`#ffffff`)
- **`box114`**: Upcoming card background → Light blue (`#DBEAFE`)
- **`box_GG`**: Completed card background → White (`#ffffff`)
- Highlights the selected status card

**10. Status Clicked Flag:**
- Sets `statusClicked` context to `true`
- Indicates that a status filter has been applied

**11. Connection Reloading:**
- Reloads connections: `C_6`, `C_12`
- Refreshes dashboard data with "Ongoing" status filter applied

### Widget IDs Reference

**Container Components:**
- `box76`: Main container (shown)
- `box77`: Alternative container (hidden)
- `box_QD`: Additional container (hidden)
- `box277`: Main dashboard container (height adjusted)

**Status Card Components:**
- `box111`: Ongoing trips card (background color updated)
- `box114`: Upcoming trips card (background color updated)
- `box_GG`: Completed trips card (background color updated)

**Label Components:**
- `label79`: Filter display label (shows current filter values)
- `label283`: Global variable widget (stores `Value_ST`)

**Component Groups:**
- `view_grid`: Traveller details grid (hidden)

**Data Connections:**
- `C_6`: Dashboard data connection (reloaded)
- `C_12`: Additional data connection (reloaded)

### Expected Behavior

**On Click:**
1. Dashboard filters to show only "Ongoing" trips
2. Filter display updates with current filter values
3. Traveller details table is hidden (if previously shown)
4. Dashboard height resets to default (900px)
5. Status card backgrounds update to highlight selected status
6. Data connections reload with "Ongoing" status filter
7. Map markers update to show only ongoing trips (blue markers)

**Filter Display Format:**
- Shows all active filters in a single line
- Separated by pipe (`|`) characters
- Includes: Start Date, End Date, Market Profile, Organization Group, Organization, Status

**Status Card Highlighting:**
- Selected status card (Ongoing) gets white background
- Other status cards get light blue background (`#DBEAFE`)
- Visual indication of active filter

### Related Context Variables

**Updated:**
- `status_selected`: Set to `'ongoing'`
- `statusClicked`: Set to `true`

**Read:**
- `organization_name`: Organization name
- `sdt`: Start date (YYYY-MM-DD)
- `edt`: End date (YYYY-MM-DD)
- `mProfile`: Market profile ID
- `org_grp_id`: Organization group ID

### Related Global Variables

**Updated:**
- `Value_ST`: Set to `'ongoing'` in `label283` widget

---

### Upcoming KPI Click Handler

**Trigger:** Click on "Upcoming Trips" KPI card

**Complete Implementation:**

```javascript
// Show/hide components
sdk.showComponent(['box77']);
sdk.hideComponent(['box76', 'box_QD']);

// Set status context and global variable
sdk.setContext('status_selected', 'upcoming');
sdk.updateGlobalVariable('label283', {'Value_ST': 'upcoming'}, false);

// Get filter values from context
var organization_name = sdk.getContext('organization_name');
var sdt = sdk.getContext('sdt');
var edt = sdk.getContext('edt');
var mProfile = sdk.getContext('mProfile');
var org_grp_id = sdk.getContext('org_grp_id');

// Date format conversion utility
function convertDateFormat(dateStr) {
  // Expecting input in format "yy-mm-dd"
  var parts = dateStr.split('-');
  var yy = parts[0];
  var mm = parts[1];
  var dd = parts[2];
  return dd + '-' + mm + '-' + yy;
}

// Convert market profile ID to name
if(mProfile === '1'){
    mProfile = 'UAE';
} else if(mProfile === '2'){
    mProfile = 'India';
} else if(mProfile === '3'){
    mProfile = 'Qatar';
} else {
    mProfile = 'KSA';
}

// Convert dates to display format
var dis_st_date = convertDateFormat(sdt);
var dis_end_date = convertDateFormat(edt);

// Build filter display string
var filterVal = 'Start Date: ' + dis_st_date + ' | End Date: ' + dis_end_date + 
                ' | Market Profile: ' + mProfile + ' | Organization Group: ' + org_grp_id + 
                ' | Organization: ' + organization_name + ' | Status: Upcoming';

// Update filter label
sdk.setValue('label79', filterVal);

// Hide traveller details grid
sdk.hideGroup(['view_grid']);

// Adjust dashboard height (reset to default)
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "900px"});
sdk.applyStyle('#draggableDiv' + sdk.getWidget('box277').m_objectid, 'height', '895px');
sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box277').m_objectid, 'height', '895px');

// Update background colors for status indicators
sdk.changeBGColor('box111', ['#DBEAFE', '#DBEAFE']);  // Ongoing card background (light blue)
sdk.changeBGColor('box114', ['#ffffff', '#ffffff']);  // Upcoming card background (white - selected)
sdk.changeBGColor('box_GG', ['#ffffff', '#ffffff']);  // Completed card background (white)

// Set status clicked flag
sdk.setContext('statusClicked', true);

// Reload connections for filtered data
sdk.reload(['C_6', 'C_12']);
```

### Implementation Details

**1. Component Visibility:**
- **Shown Components**: `box77` (alternative container for Upcoming status)
- **Hidden Components**: `box76`, `box_QD` (main container and additional container)

**2. Status Context Updates:**
- Sets `status_selected` context to `'upcoming'`
- Updates global variable `Value_ST` to `'upcoming'` in `label283` widget

**3. Filter Value Retrieval:**
- Same as Ongoing handler - retrieves from SDK context:
  - `organization_name`: Organization name
  - `sdt`: Start date (YYYY-MM-DD format)
  - `edt`: End date (YYYY-MM-DD format)
  - `mProfile`: Market profile ID (`'1'`, `'2'`, `'3'`, or other)
  - `org_grp_id`: Organization group ID

**4. Date Format Conversion:**
- Same utility function as Ongoing handler
- Converts date from `YY-MM-DD` to `DD-MM-YY` format for display

**5. Market Profile Conversion:**
- Same conversion logic as Ongoing handler:
  - `'1'` → `'UAE'`
  - `'2'` → `'India'`
  - `'3'` → `'Qatar'`
  - Other → `'KSA'` (Saudi Arabia)

**6. Filter Display String:**
- Format: `"Start Date: DD-MM-YY | End Date: DD-MM-YY | Market Profile: [Name] | Organization Group: [Name] | Organization: [Name] | Status: Upcoming"`
- Example: `"Start Date: 25-12-24 | End Date: 17-01-25 | Market Profile: UAE | Organization Group: No Organization Group | Organization: ABC Corp | Status: Upcoming"`
- Displayed in `label79` widget

**7. Component Group Visibility:**
- Hides `view_grid` group (traveller details table)

**8. Layout Height Adjustment:**
- **Dashboard Parent Div**: `900px` (reset from expanded height)
- **Container Box (`box277`)**: `895px`
- **Canvas Element**: `895px`
- Resets dashboard to default height when traveller details are hidden

**9. Background Color Updates:**
- **`box111`**: Ongoing card background → Light blue (`#DBEAFE`) - not selected
- **`box114`**: Upcoming card background → White (`#ffffff`) - selected
- **`box_GG`**: Completed card background → White (`#ffffff`) - not selected
- Highlights the selected status card (Upcoming)

**10. Status Clicked Flag:**
- Sets `statusClicked` context to `true`
- Indicates that a status filter has been applied

**11. Connection Reloading:**
- Reloads connections: `C_6`, `C_12`
- Refreshes dashboard data with "Upcoming" status filter applied

### Key Differences from Ongoing Handler

**Component Visibility:**
- Shows `box77` instead of `box76` (different container for Upcoming status view)
- Hides `box76` instead of `box77`

**Status Values:**
- Sets `status_selected` to `'upcoming'` instead of `'ongoing'`
- Updates `Value_ST` to `'upcoming'` instead of `'ongoing'`
- Filter display shows "Status: Upcoming" instead of "Status: Ongoing"

**Background Colors:**
- Upcoming card (`box114`) gets white background (selected)
- Ongoing card (`box111`) gets light blue background (not selected)
- Completed card (`box_GG`) gets white background (not selected)

### Expected Behavior

**On Click:**
1. Dashboard filters to show only "Upcoming" trips
2. Filter display updates with current filter values
3. Traveller details table is hidden (if previously shown)
4. Dashboard height resets to default (900px)
5. Status card backgrounds update to highlight selected status (Upcoming)
6. Data connections reload with "Upcoming" status filter
7. Map markers update to show only upcoming trips (green markers)

**Filter Display Format:**
- Shows all active filters in a single line
- Separated by pipe (`|`) characters
- Includes: Start Date, End Date, Market Profile, Organization Group, Organization, Status
- Status shows as "Upcoming"

**Status Card Highlighting:**
- Selected status card (Upcoming) gets white background
- Other status cards get light blue background (`#DBEAFE`) or white
- Visual indication of active filter

### Related Context Variables

**Updated:**
- `status_selected`: Set to `'upcoming'`
- `statusClicked`: Set to `true`

**Read:**
- `organization_name`: Organization name
- `sdt`: Start date (YYYY-MM-DD)
- `edt`: End date (YYYY-MM-DD)
- `mProfile`: Market profile ID
- `org_grp_id`: Organization group ID

### Related Global Variables

**Updated:**
- `Value_ST`: Set to `'upcoming'` in `label283` widget

---

### Completed KPI Click Handler

**Trigger:** Click on "Completed Trips" KPI card

**Complete Implementation:**

```javascript
// Show/hide components
sdk.showComponent(['box_QD']);
sdk.hideComponent(['box76', 'box77']);

// Set status context and global variable
sdk.setContext('status_selected', 'completed');
sdk.updateGlobalVariable('label283', {'Value_ST': 'completed'}, false);

// Get filter values from context
var organization_name = sdk.getContext('organization_name');
var sdt = sdk.getContext('sdt');
var edt = sdk.getContext('edt');
var mProfile = sdk.getContext('mProfile');
var org_grp_id = sdk.getContext('org_grp_id');

// Date format conversion utility
function convertDateFormat(dateStr) {
  // Expecting input in format "yy-mm-dd"
  var parts = dateStr.split('-');
  var yy = parts[0];
  var mm = parts[1];
  var dd = parts[2];
  return dd + '-' + mm + '-' + yy;
}

// Convert market profile ID to name
if(mProfile === '1'){
    mProfile = 'UAE';
} else if(mProfile === '2'){
    mProfile = 'India';
} else if(mProfile === '3'){
    mProfile = 'Qatar';
} else {
    mProfile = 'KSA';
}

// Convert dates to display format
var dis_st_date = convertDateFormat(sdt);
var dis_end_date = convertDateFormat(edt);

// Build filter display string
// Note: Filter display should show "Status: Completed" (may need correction in actual implementation)
var filterVal = 'Start Date: ' + dis_st_date + ' | End Date: ' + dis_end_date + 
                ' | Market Profile: ' + mProfile + ' | Organization Group: ' + org_grp_id + 
                ' | Organization: ' + organization_name + ' | Status: Upcoming';

// Update filter label
sdk.setValue('label79', filterVal);

// Hide traveller details grid
sdk.hideGroup(['view_grid']);

// Adjust dashboard height (reset to default)
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "900px"});
sdk.applyStyle('#draggableDiv' + sdk.getWidget('box277').m_objectid, 'height', '895px');
sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box277').m_objectid, 'height', '895px');

// Update background colors for status indicators
sdk.changeBGColor('box111', ['#ffffff', '#ffffff']);  // Ongoing card background (white)
sdk.changeBGColor('box114', ['#ffffff', '#ffffff']);  // Upcoming card background (white)
sdk.changeBGColor('box_GG', ['#DBEAFE', '#DBEAFE']);  // Completed card background (light blue - selected)

// Set status clicked flag
sdk.setContext('statusClicked', true);

// Reload connections for filtered data
sdk.reload(['C_6', 'C_12']);
```

### Implementation Details

**1. Component Visibility:**
- **Shown Components**: `box_QD` (container for Completed status view)
- **Hidden Components**: `box76`, `box77` (Ongoing and Upcoming containers)

**2. Status Context Updates:**
- Sets `status_selected` context to `'completed'`
- Updates global variable `Value_ST` to `'completed'` in `label283` widget

**3. Filter Value Retrieval:**
- Same as Ongoing and Upcoming handlers - retrieves from SDK context:
  - `organization_name`: Organization name
  - `sdt`: Start date (YYYY-MM-DD format)
  - `edt`: End date (YYYY-MM-DD format)
  - `mProfile`: Market profile ID (`'1'`, `'2'`, `'3'`, or other)
  - `org_grp_id`: Organization group ID

**4. Date Format Conversion:**
- Same utility function as Ongoing and Upcoming handlers
- Converts date from `YY-MM-DD` to `DD-MM-YY` format for display

**5. Market Profile Conversion:**
- Same conversion logic as other handlers:
  - `'1'` → `'UAE'`
  - `'2'` → `'India'`
  - `'3'` → `'Qatar'`
  - Other → `'KSA'` (Saudi Arabia)

**6. Filter Display String:**
- **Note**: The provided code shows `"Status: Upcoming"` in the filter display string, but this should be `"Status: Completed"` to match the status context. This may be a copy-paste error that needs correction.
- Expected format: `"Start Date: DD-MM-YY | End Date: DD-MM-YY | Market Profile: [Name] | Organization Group: [Name] | Organization: [Name] | Status: Completed"`
- Example: `"Start Date: 25-12-24 | End Date: 17-01-25 | Market Profile: UAE | Organization Group: No Organization Group | Organization: ABC Corp | Status: Completed"`
- Displayed in `label79` widget

**7. Component Group Visibility:**
- Hides `view_grid` group (traveller details table)

**8. Layout Height Adjustment:**
- **Dashboard Parent Div**: `900px` (reset from expanded height)
- **Container Box (`box277`)**: `895px`
- **Canvas Element**: `895px`
- Resets dashboard to default height when traveller details are hidden

**9. Background Color Updates:**
- **`box111`**: Ongoing card background → White (`#ffffff`) - not selected
- **`box114`**: Upcoming card background → White (`#ffffff`) - not selected
- **`box_GG`**: Completed card background → Light blue (`#DBEAFE`) - selected
- Highlights the selected status card (Completed)

**10. Status Clicked Flag:**
- Sets `statusClicked` context to `true`
- Indicates that a status filter has been applied

**11. Connection Reloading:**
- Reloads connections: `C_6`, `C_12`
- Refreshes dashboard data with "Completed" status filter applied

### Key Differences from Other Handlers

**Component Visibility:**
- Shows `box_QD` instead of `box76` (Ongoing) or `box77` (Upcoming)
- Uses a different container specifically for Completed status view
- Hides both `box76` and `box77`

**Status Values:**
- Sets `status_selected` to `'completed'` instead of `'ongoing'` or `'upcoming'`
- Updates `Value_ST` to `'completed'` instead of `'ongoing'` or `'upcoming'`
- Filter display should show "Status: Completed" (note: code shows "Upcoming" - needs correction)

**Background Colors:**
- Completed card (`box_GG`) gets light blue background (`#DBEAFE`) - selected
- Ongoing card (`box111`) gets white background (not selected)
- Upcoming card (`box114`) gets white background (not selected)

### Expected Behavior

**On Click:**
1. Dashboard filters to show only "Completed" trips
2. Filter display updates with current filter values (should show "Status: Completed")
3. Traveller details table is hidden (if previously shown)
4. Dashboard height resets to default (900px)
5. Status card backgrounds update to highlight selected status (Completed)
6. Data connections reload with "Completed" status filter
7. Map markers update to show only completed trips (gray markers)

**Filter Display Format:**
- Shows all active filters in a single line
- Separated by pipe (`|`) characters
- Includes: Start Date, End Date, Market Profile, Organization Group, Organization, Status
- Status should show as "Completed" (note: code may need correction)

**Status Card Highlighting:**
- Selected status card (Completed) gets light blue background (`#DBEAFE`)
- Other status cards get white background
- Visual indication of active filter

### Related Context Variables

**Updated:**
- `status_selected`: Set to `'completed'`
- `statusClicked`: Set to `true`

**Read:**
- `organization_name`: Organization name
- `sdt`: Start date (YYYY-MM-DD)
- `edt`: End date (YYYY-MM-DD)
- `mProfile`: Market profile ID
- `org_grp_id`: Organization group ID

### Related Global Variables

**Updated:**
- `Value_ST`: Set to `'completed'` in `label283` widget

### Implementation Note

**Filter Display String Correction:**
The provided code contains `"Status: Upcoming"` in the filter display string, but since the handler sets the status to `'completed'`, the filter display should show `"Status: Completed"`. This appears to be a copy-paste error from the Upcoming handler. The correct line should be:

```javascript
var filterVal = 'Start Date: ' + dis_st_date + ' | End Date: ' + dis_end_date + 
                ' | Market Profile: ' + mProfile + ' | Organization Group: ' + org_grp_id + 
                ' | Organization: ' + organization_name + ' | Status: Completed';
```

---

## Geographic Distribution Map

### Purpose

Displays the geographic distribution of trips on an interactive Leaflet map, showing trip locations across different regions and countries. The map uses marker clustering and status-based coloring to visualize trip data. Clicking on markers displays detailed traveller information in a table format.

### Map Technology

- **Leaflet.js**: Open-source JavaScript library for interactive maps
- **MarkerClusterGroup**: Plugin for clustering markers at different zoom levels
- **CartoDB Basemaps**: Light-themed base map tiles
- **Custom Tooltips**: HTML-based tooltips showing traveller names

### HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>Map with Connections & PDF Download</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="map"></div>
</body>
</html>
```

### CSS Styling

```css
body {
  font-family: Verdana, sans-serif;
  margin: 0;
  padding: 20px;
}

#map {
  height: 100%;
  width: 100%;
}

#refreshBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

#refreshBtn:hover {
  background-color: #f1f1f1;
}

.custom-tooltip {
  white-space: normal !important;
  max-width: 1000px !important;
  font-size: 12px !important;
  background: white !important;
  border: 1px solid #ccc !important;
  padding: 4px 8px !important;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2) !important;
}

.tooltip-columns {
  display: flex;
  gap: 20px;
}

.tooltip-columns ul {
  list-style-type: disc;
  margin: 4px 0 0 16px;
  padding: 0;
}

.tooltip-columns ul li {
  margin-bottom: 2px;
}

.map-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  font-size: 14px;
}

.legend {
  display: flex;
  gap: 20px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
}

.ongoing {
  background-color: #0589f9;
}

.upcoming {
  background-color: #04d336;
}

.completed {
  background-color: #a0a0a0;
}
```

### JavaScript Implementation

```javascript
// Get data from chart widget
const backendData = bizvizchart.getData();

// Initialize map
const map = L.map("map");
map.scrollWheelZoom.disable();

// Base Tiles - CartoDB Light theme
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
  attribution: "",
  subdomains: ["a", "b", "c", "d"]
}).addTo(map);

// ====================================================================
//  HELPER FUNCTIONS
// ====================================================================

// Get marker color from trip_status
function getStatusColor(items) {
  if (items.some(i => i.trip_status === "Ongoing")) return "#0589f9";  // Blue
  if (items.some(i => i.trip_status === "Upcoming")) return "#04d336"; // Green
  if (items.some(i => i.trip_status === "Completed")) return "#a0a0a0"; // Gray
  return "#999999"; // Default gray
}

// Convert traveler list into columns in tooltip
function chunkArray(arr, size = 5) {
  let chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Tooltip HTML builder
function buildTooltip(items) {
  const columns = chunkArray(items);
  const columnHTML = columns
    .map(col => `<ul>${col.map(i => `<li>${i.traveler_name}</li>`).join("")}</ul>`)
    .join("");

  return `
    <div style="display:flex; justify-content:space-between; font-weight:bold;">
      <span>Total Traveller Count: ${items.length}</span>
      <span>${items[0].location_name}</span>
    </div>
    <div class="tooltip-columns">${columnHTML}</div>
  `;
}

// ====================================================================
//  MAP PLOT LOGIC
// ====================================================================

if (backendData.length > 0) {
  // Initial map view - centered on first data point
  map.setView([
    parseFloat(backendData[0].arrival_latitude),
    parseFloat(backendData[0].arrival_longitude)
  ], 5);

  // Cluster icon color logic
  const markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
      const children = cluster.getAllChildMarkers();
      let ongoing = 0, upcoming = 0, completed = 0;

      // Count markers by status
      children.forEach(m => {
        let html = m.options.icon.options.html;
        if (html.includes("#0589f9")) ongoing++;
        else if (html.includes("#04d336")) upcoming++;
        else if (html.includes("#a0a0a0")) completed++;
      });

      // Determine cluster color based on majority status
      let color = "#999999";
      if (ongoing >= upcoming && ongoing >= completed) color = "#0589f9"; // Blue
      else if (upcoming >= ongoing && upcoming >= completed) color = "#04d336"; // Green
      else color = "#a0a0a0"; // Gray

      return L.divIcon({
        html: `
          <div style="
            background:${color};
            color:#fff;
            width:32px;
            height:32px;
            line-height:32px;
            text-align:center;
            border-radius:50%;
            border:2px solid #fff;
            font-weight:bold;
          ">${cluster.getChildCount()}</div>
        `,
        className: "custom-cluster-icon",
        iconSize: [32, 32]
      });
    }
  });

  // Group items by lat,lng (same location)
  let grouped = {};
  backendData.forEach(item => {
    const key = item.arrival_latitude + "," + item.arrival_longitude;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  // Create markers for each location
  for (let key in grouped) {
    const items = grouped[key];

    const lat = parseFloat(items[0].arrival_latitude);
    const lng = parseFloat(items[0].arrival_longitude);
    const color = getStatusColor(items);

    // Create marker with status-based color
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid #fff;"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    });

    // Bind tooltip showing traveller names
    marker.bindTooltip(buildTooltip(items), {
      direction: "top",
      className: "custom-tooltip"
    });

    // ============================================================
    //  MARKER CLICK ACTION - Shows Traveller Details Table
    // ============================================================
    marker.on("click", () => {
      const ids = items.map(i => i.traveler_profile_id).join(",");
      const location_id = items.map(i => i.location_id);

      // Update global variables with selected traveller IDs and location
      parent.sdk.updateGlobalVariable("label283", { Value_TN: ids }, false);
      parent.sdk.updateGlobalVariable("label283", { Value_LC: location_id }, false);

      // Reload connections to fetch traveller details
      parent.sdk.reload(["C_8", "C_MW"]);

      // Show traveller details grid
      parent.sdk.showGroup(["view_grid"]);

      // Update location label
      parent.sdk.setValue(
        "label72",
        `📍 <span style="color:#0492ff;">${items[0].location_name}</span>`
      );

      // Adjust dashboard height to accommodate traveller details table
      parent.sdk.applyStyles(
        "#draggablesParentDiv" + parent.sdk.dashboard.m_id,
        { height: "1490px" }
      );

      parent.sdk.applyStyle(
        "#draggableDiv" + parent.sdk.getWidget("box277").m_objectid,
        "height",
        "1485px"
      );

      parent.sdk.applyStyle(
        "#draggableCanvas" + parent.sdk.getWidget("box277").m_objectid,
        "height",
        "1485px"
      );
    });

    markers.addLayer(marker);
  }

  map.addLayer(markers);
  // Fit map bounds to show all markers
  if (markers.getLayers().length) map.fitBounds(markers.getBounds());
}
```

### Map Structure

**Map Container:**
- **Element ID**: `map`
- **Map Library**: Leaflet.js
- **Base Map**: CartoDB Light theme (`light_all`)
- **Scroll Wheel Zoom**: Disabled (`map.scrollWheelZoom.disable()`)

**Info Banner (Above Map):**
- **Background**: Light gray with abstract map-like pattern
- **Left Side**: Information icon (blue circle with white 'i') + text "Click on the destinations to get detailed information for traveller."
- **Right Side**: Status legend indicators:
  - **Ongoing**: Blue circle (`#0589f9`)
  - **Upcoming**: Green circle (`#04d336`)
  - **Completed**: Gray circle (`#a0a0a0`)

**Map Title Section:**
- **Title**: "Traveller Details" (bold text)
- **Location Display**: Pink location pin icon + location name (e.g., "Abu Dhabi, United Arab Emirates")
- **Traveller ID Field**: Input field showing "No Field Available" (red text) when empty

### Marker Styling

**Individual Markers:**
- **Size**: 16px × 16px circular markers
- **Border**: 2px solid white border
- **Colors** (based on trip status):
  - **Ongoing**: `#0589f9` (Blue)
  - **Upcoming**: `#04d336` (Green)
  - **Completed**: `#a0a0a0` (Gray)
- **Position**: Based on `arrival_latitude` and `arrival_longitude` from data

**Cluster Markers:**
- **Size**: 32px × 32px circular markers
- **Border**: 2px solid white border
- **Color**: Determined by majority status of clustered markers
- **Display**: Shows count of markers in cluster
- **Styling**: White text on colored background, bold font

### Tooltip Functionality

**Tooltip Content:**
- **Header**: 
  - Left: "Total Traveller Count: X" (where X is number of travellers)
  - Right: Location name
- **Body**: 
  - Traveller names displayed in columns (5 names per column)
  - Multiple columns displayed side-by-side with gap
  - List format with bullet points

**Tooltip Styling:**
- **Max Width**: 1000px
- **Background**: White
- **Border**: 1px solid #ccc
- **Shadow**: 2px 2px 6px rgba(0, 0, 0, 0.2)
- **Font Size**: 12px
- **Padding**: 4px 8px

**Tooltip Display:**
- Shown on marker hover
- Direction: Top (above marker)
- Custom CSS class: `custom-tooltip`

### Marker Click Functionality

**On Marker Click:**

1. **Extract Traveller Data:**
   ```javascript
   const ids = items.map(i => i.traveler_profile_id).join(",");
   const location_id = items.map(i => i.location_id);
   ```

2. **Update Global Variables:**
   - `Value_TN`: Comma-separated traveller profile IDs
   - `Value_LC`: Location ID(s)

3. **Reload Connections:**
   - `C_8`: Traveller details data connection
   - `C_MW`: Additional data connection

4. **Show Traveller Details Grid:**
   - Shows `view_grid` component group
   - Displays "Traveller Details" table

5. **Update Location Label:**
   - Updates `label72` with location name
   - Format: `📍 <span style="color:#0492ff;">Location Name</span>`

6. **Adjust Dashboard Height:**
   - Dashboard parent div: `1490px`
   - Container box (`box277`): `1485px`
   - Canvas element: `1485px`

### Traveller Details Table

**Table Container:**
- **Card Style**: White card with rounded corners
- **Background**: Light gray page background
- **Layout**: Centered card layout

**Table Header Section:**

**1. Info Banner (Above Table):**
- **Background**: Light gray header area with abstract map-like background pattern
- **Left Side**: 
  - Information icon: Blue circle with white 'i'
  - Text: "Click on the destinations to get detailed information for traveller."
- **Right Side**: Status legend indicators:
  - **Ongoing**: Blue circle (`#0589f9`)
  - **Upcoming**: Green circle (`#04d336`)
  - **Completed**: Gray circle (`#a0a0a0`)

**2. Table Title Section:**
- **Title**: "Traveller Details" (bold text)
- **Location Display**: 
  - Pink location pin icon (📍)
  - Location name: "Abu Dhabi, United Arab Emirates"
  - Appears as clickable link
  - Positioned next to title
- **Traveller ID Field**: 
  - Label: "Traveller ID"
  - Input field displaying "No Field Available" (red text) when empty
  - Positioned to the right of title

**Table Structure:**

**Column Headers (8 columns) - Yellow Header Row:**
1. **Trip ID**: 
   - Trip identifier code
   - Format: Alphanumeric (e.g., "M-16X2ZE", "M-16WXFQ")
   - Example: "M-16X2ZE"

2. **Traveler Name**: 
   - Full name of traveller
   - Format: Full name text
   - Example: "Rajesh Sivaraj", "Vikash Kumar Mishra"

3. **Type**: 
   - Trip type classification
   - Values: "One way", "Round trip", etc.
   - Example: "One way"

4. **Booking Date**: 
   - Date and time when trip was booked
   - Format: `DD-MM-YYYY HH:mm:ss`
   - Example: "26-11-2025 10:14:00"

5. **Location**: 
   - City name where trip is located
   - Format: City name text
   - Example: "Abu Dhabi"

6. **Route**: 
   - Route code indicating origin and destination
   - Format: Origin-Destination code (e.g., "CJB-AUH")
   - Example: "CJB-AUH", "CCU-AUH"

7. **Start Date**: 
   - Trip start date and time
   - Format: `DD-MM-YYYY HH:mm:ss` or `DD-MM-YYYY 00:00:00`
   - Example: "09-12-2025 14:55:00", "21-11-2025 00:00:00"

8. **End Date**: 
   - Trip end date and time
   - Format: `DD-MM-YYYY HH:mm:ss` or `DD-MM-YYYY 00:00:00`
   - Example: "06-01-2026 00:00:00", "19-12-2025 00:00:00"

**Table Styling:**
- **Header Row**: Yellow background (`#FFD700` or similar)
- **Data Rows**: Alternating white and light blue backgrounds for readability
- **Empty Rows**: Shown with alternating backgrounds indicating space for more data
- **Card Background**: White with rounded corners
- **Page Background**: Light gray

**Sample Data Rows:**

**Row 1:**
- Trip ID: "M-16X2ZE"
- Traveler Name: "Rajesh Sivaraj"
- Type: "One way"
- Booking Date: "26-11-2025 10:14:00"
- Location: "Abu Dhabi"
- Route: "CJB-AUH"
- Start Date: "09-12-2025 14:55:00"
- End Date: "06-01-2026 00:00:00"

**Row 2:**
- Trip ID: "M-16WXFQ"
- Traveler Name: "Vikash Kumar Mishra"
- Type: "One way"
- Booking Date: "20-11-2025 15:07:00"
- Location: "Abu Dhabi"
- Route: "CCU-AUH"
- Start Date: "21-11-2025 00:00:00"
- End Date: "19-12-2025 00:00:00"

**Table Functionality:**
- **Pagination**: Empty rows shown for pagination
- **Sorting**: May support column sorting
- **Filtering**: Filtered by selected location and traveller IDs
- **Data Source**: Loaded via `C_8` and `C_MW` connections when marker clicked

### Data Structure

**Backend Data Format:**
```javascript
[
  {
    traveler_profile_id: "123",
    traveler_name: "Rajesh Sivaraj",
    trip_status: "Ongoing", // or "Upcoming", "Completed"
    arrival_latitude: "24.4539",
    arrival_longitude: "54.3773",
    location_name: "Abu Dhabi, United Arab Emirates",
    location_id: "253",
    // ... other trip data
  },
  // ... more items
]
```

**Required Data Fields:**
- `traveler_profile_id`: Unique identifier for traveller
- `traveler_name`: Name of traveller
- `trip_status`: Status ("Ongoing", "Upcoming", "Completed")
- `arrival_latitude`: Latitude coordinate (string)
- `arrival_longitude`: Longitude coordinate (string)
- `location_name`: Full location name
- `location_id`: Location identifier

### Map Features

**Visual Styling:**
- **Map Type**: Interactive Leaflet map
- **Base Map**: CartoDB Light theme (light gray background)
- **Marker Style**: Circular markers with status-based colors
- **Cluster Style**: Larger circular markers with count display
- **Tooltip Style**: White background with shadow, multi-column layout

**Interactive Functionality:**
- **Zoom**: Users can zoom in/out using zoom controls
- **Pan**: Users can drag map to navigate
- **Marker Hover**: Shows tooltip with traveller names
- **Marker Click**: Shows detailed traveller information table
- **Cluster Click**: Expands cluster to show individual markers
- **Auto-fit Bounds**: Map automatically fits to show all markers

**Status-Based Coloring:**
- **Ongoing Trips**: Blue (`#0589f9`)
- **Upcoming Trips**: Green (`#04d336`)
- **Completed Trips**: Gray (`#a0a0a0`)
- **Mixed Status**: Color determined by majority status

### Widget IDs Reference

**Map Widget:**
- `map`: Map container div element
- Chart widget: `bizvizchart` (provides data via `getData()`)

**Traveller Details Components:**
- `label72`: Location label widget
- `view_grid`: Traveller details grid group
- `box277`: Main container box (height adjusted on marker click)

**Global Variable Widget:**
- `label283`: Widget storing global variables (`Value_TN`, `Value_LC`)

**Data Connections:**
- `C_8`: Traveller details data connection
- `C_MW`: Additional data connection

### Implementation Notes

- Map uses Leaflet.js library for rendering
- Marker clustering groups nearby markers automatically
- Tooltip displays traveller names in columns for better readability
- Clicking marker triggers SDK calls to update global variables and reload connections
- Dashboard height adjusts dynamically when traveller details table is shown
- Location name displayed in blue color with location pin emoji
- Traveller IDs are comma-separated when multiple travellers at same location
- Map automatically fits bounds to show all markers on load

---

## Filter Modal Script

**Trigger:** Click on filter icon (`svg_filter`)

### Filter Button Click Handler

**Complete Implementation:**

```javascript
// Reload filter data connection
sdk.reload(['C_27']);

// Show filter modal group
sdk.showGroup(['filter']);

// Get current tab selection
var tabSelected = sdk.getContext('tabSelected');

// Show filter94 component (Organization filter)
sdk.showComponent(['filter94']);

// Adjust dashboard height to accommodate filter modal
sdk.applyStyles("#draggablesParentDiv" + sdk.dashboard.m_id, {"height": "1040"});

// Layout-specific adjustments based on layout type
if (sdk.getLayoutType() == "AbsoluteLayout") {
    if (sdk.getContext('customDateSelected')) {
        // Custom Date selected - taller modal
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('box229').m_objectid, 'height', '675px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box229').m_objectid, 'height', '675px');

        // Adjust positions for custom date filter components
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label242').m_objectid, 'top', '364px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label242').m_objectid, 'top', '364px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label243').m_objectid, 'top', '378px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label243').m_objectid, 'top', '378px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter93').m_objectid, 'top', '409px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter93').m_objectid, 'top', '409px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label81').m_objectid, 'top', '469px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label81').m_objectid, 'top', '469px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label82').m_objectid, 'top', '482px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label82').m_objectid, 'top', '482px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter94').m_objectid, 'top', '516px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter94').m_objectid, 'top', '516px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label_QM').m_objectid, 'top', '576px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label_QM').m_objectid, 'top', '576px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label80').m_objectid, 'top', '591px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label80').m_objectid, 'top', '591px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter81').m_objectid, 'top', '625px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter81').m_objectid, 'top', '625px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label250').m_objectid, 'top', '684px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label250').m_objectid, 'top', '684px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label251').m_objectid, 'top', '684px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label251').m_objectid, 'top', '684px');

        // Show custom date filter group
        sdk.showGroup(['customDateFilter']);
    } else {
        // Predefined date range selected - shorter modal
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('box229').m_objectid, 'height', '565px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box229').m_objectid, 'height', '565px');

        // Adjust positions for predefined date filter components
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label242').m_objectid, 'top', '246px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label242').m_objectid, 'top', '246px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label243').m_objectid, 'top', '264px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label243').m_objectid, 'top', '264px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter93').m_objectid, 'top', '304px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter93').m_objectid, 'top', '304px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label81').m_objectid, 'top', '364px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label81').m_objectid, 'top', '364px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label82').m_objectid, 'top', '374px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label82').m_objectid, 'top', '374px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter94').m_objectid, 'top', '410px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter94').m_objectid, 'top', '410px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label_QM').m_objectid, 'top', '470px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label_QM').m_objectid, 'top', '470px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label80').m_objectid, 'top', '484px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label80').m_objectid, 'top', '484px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter81').m_objectid, 'top', '520px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter81').m_objectid, 'top', '520px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label250').m_objectid, 'top', '575px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label250').m_objectid, 'top', '575px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label251').m_objectid, 'top', '575px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label251').m_objectid, 'top', '575px');

        // Hide custom date filter group
        sdk.hideGroup(['customDateFilter']);
    }
}

if (sdk.getLayoutType() == "MobileLayout") {
    if (sdk.getContext('customDateSelected')) {
        // Custom Date selected - taller modal for mobile
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('box229').m_objectid, 'height', '540px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box229').m_objectid, 'height', '540px');

        // Adjust positions for custom date filter components (mobile)
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label242').m_objectid, 'top', '343px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label242').m_objectid, 'top', '343px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label243').m_objectid, 'top', '354px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label243').m_objectid, 'top', '354px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter93').m_objectid, 'top', '384px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter93').m_objectid, 'top', '384px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label81').m_objectid, 'top', '424px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label81').m_objectid, 'top', '424px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label82').m_objectid, 'top', '433px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label82').m_objectid, 'top', '433px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter94').m_objectid, 'top', '465px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter94').m_objectid, 'top', '465px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label_QM').m_objectid, 'top', '509px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label_QM').m_objectid, 'top', '509px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label80').m_objectid, 'top', '520px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label80').m_objectid, 'top', '520px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter81').m_objectid, 'top', '550px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter81').m_objectid, 'top', '550px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label250').m_objectid, 'top', '593px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label250').m_objectid, 'top', '593px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label251').m_objectid, 'top', '593px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label251').m_objectid, 'top', '593px');

        // Show custom date filter group
        sdk.showGroup(['customDateFilter']);
    } else {
        // Predefined date range selected - shorter modal for mobile
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('box229').m_objectid, 'height', '450px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box229').m_objectid, 'height', '450px');

        // Adjust positions for predefined date filter components (mobile)
        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label242').m_objectid, 'top', '249px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label242').m_objectid, 'top', '249px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label243').m_objectid, 'top', '260px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label243').m_objectid, 'top', '260px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter93').m_objectid, 'top', '290px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter93').m_objectid, 'top', '290px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label81').m_objectid, 'top', '330px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label81').m_objectid, 'top', '330px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label82').m_objectid, 'top', '339px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label82').m_objectid, 'top', '339px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter94').m_objectid, 'top', '371px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter94').m_objectid, 'top', '371px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label_QM').m_objectid, 'top', '415px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label_QM').m_objectid, 'top', '415px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label80').m_objectid, 'top', '426px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label80').m_objectid, 'top', '426px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('filter81').m_objectid, 'top', '456px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('filter81').m_objectid, 'top', '456px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label250').m_objectid, 'top', '499px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label250').m_objectid, 'top', '499px');

        sdk.applyStyle('#draggableDiv' + sdk.getWidget('label251').m_objectid, 'top', '499px');
        sdk.applyStyle('#draggableCanvas' + sdk.getWidget('label251').m_objectid, 'top', '499px');

        // Hide custom date filter group
        sdk.hideGroup(['customDateFilter']);
    }
}

if (sdk.getLayoutType() == "TabletLayout") {
    alert("Tablet Layout");
}

// Set filter modal width
sdk.applyStyle('#draggableDiv' + sdk.getWidget('box229').m_objectid, 'width', '337px');
sdk.applyStyle('#draggableCanvas' + sdk.getWidget('box229').m_objectid, 'width', '337px');
```

### Implementation Details

**1. Connection Reloading:**
- Reloads connection `C_27` to fetch latest filter data

**2. Component Visibility:**
- Shows `filter` group (filter modal container)
- Shows `filter94` component (Organization filter dropdown)

**3. Dashboard Height Adjustment:**
- Sets dashboard parent div height to `1040px` to accommodate filter modal

**4. Layout-Specific Adjustments:**

**Absolute Layout:**

**When Custom Date Selected (`customDateSelected === true`):**
- Modal height: `675px`
- Shows `customDateFilter` group
- Component positions adjusted for taller modal:
  - `label242`: `364px` from top
  - `label243`: `378px` from top
  - `filter93`: `409px` from top
  - `label81`: `469px` from top
  - `label82`: `482px` from top
  - `filter94`: `516px` from top
  - `label_QM`: `576px` from top
  - `label80`: `591px` from top
  - `filter81`: `625px` from top
  - `label250` (Cancel): `684px` from top
  - `label251` (Apply): `684px` from top

**When Predefined Date Selected (`customDateSelected === false`):**
- Modal height: `565px`
- Hides `customDateFilter` group
- Component positions adjusted for shorter modal:
  - `label242`: `246px` from top
  - `label243`: `264px` from top
  - `filter93`: `304px` from top
  - `label81`: `364px` from top
  - `label82`: `374px` from top
  - `filter94`: `410px` from top
  - `label_QM`: `470px` from top
  - `label80`: `484px` from top
  - `filter81`: `520px` from top
  - `label250` (Cancel): `575px` from top
  - `label251` (Apply): `575px` from top

**Mobile Layout:**

**When Custom Date Selected (`customDateSelected === true`):**
- Modal height: `540px`
- Shows `customDateFilter` group
- Component positions adjusted for mobile:
  - `label242`: `343px` from top
  - `label243`: `354px` from top
  - `filter93`: `384px` from top
  - `label81`: `424px` from top
  - `label82`: `433px` from top
  - `filter94`: `465px` from top
  - `label_QM`: `509px` from top
  - `label80`: `520px` from top
  - `filter81`: `550px` from top
  - `label250` (Cancel): `593px` from top
  - `label251` (Apply): `593px` from top

**When Predefined Date Selected (`customDateSelected === false`):**
- Modal height: `450px`
- Hides `customDateFilter` group
- Component positions adjusted for mobile:
  - `label242`: `249px` from top
  - `label243`: `260px` from top
  - `filter93`: `290px` from top
  - `label81`: `330px` from top
  - `label82`: `339px` from top
  - `filter94`: `371px` from top
  - `label_QM`: `415px` from top
  - `label80`: `426px` from top
  - `filter81`: `456px` from top
  - `label250` (Cancel): `499px` from top
  - `label251` (Apply): `499px` from top

**Tablet Layout:**
- Shows alert: "Tablet Layout"
- Layout-specific adjustments not implemented

**5. Modal Width:**
- Sets filter modal (`box229`) width to `337px`
- Applied to both `draggableDiv` and `draggableCanvas` elements

### Widget IDs Reference

**Filter Modal Container:**
- `box229`: Filter modal container (height and width adjusted)

**Filter Components:**
- `filter93`: Date range filter component
- `filter94`: Organization filter component (shown on click)
- `filter81`: Additional filter component

**Label Components:**
- `label242`: Date range label
- `label243`: Date range label
- `label81`: Filter label
- `label82`: Filter label
- `label_QM`: Filter label
- `label80`: Filter label
- `label250`: Cancel button
- `label251`: Apply button

**Component Groups:**
- `filter`: Filter modal group (shown)
- `customDateFilter`: Custom date filter group (shown/hidden based on selection)

**Data Connections:**
- `C_27`: Filter data connection (reloaded)

### Expected Behavior

**On Filter Button Click:**
1. Filter modal appears as overlay
2. Dashboard height expands to `1040px` to accommodate modal
3. Filter modal width set to `337px`
4. Organization filter (`filter94`) is shown
5. Modal height and component positions adjust based on:
   - Layout type (Absolute/Mobile/Tablet)
   - Custom date selection state
6. Custom date filter group shown/hidden based on selection
7. Filter data connection (`C_27`) reloaded to fetch latest options

**Modal Height Variations:**
- **Absolute Layout**: `675px` (custom date) or `565px` (predefined)
- **Mobile Layout**: `540px` (custom date) or `450px` (predefined)
- **Tablet Layout**: Not configured (shows alert)

**Modal Title:** "Choose the date"

**Modal Structure:**
The filter modal is a centered overlay dialog on a partially visible background that allows users to configure date ranges, market profile, and organization filters.

### Modal Sections

**1. Modal Header:**
- **Title**: "Choose the date" prominently displayed at the top left
- **Close Button**: X icon in the top right corner
- Closes modal when clicked without applying changes

**2. Date Range Selection Section:**
- **Radio Button Group**: Four options for quick date range selection
  - **"Last 1 day"** (unselected)
    - Single day range (yesterday)
    - When selected, calculates yesterday's date
  - **"Last 7 days"** (unselected)
    - Seven day range ending yesterday
    - When selected, calculates date 7 days before today
  - **"Last 30 days"** (selected by default)
    - Thirty day range ending yesterday
    - Indicated by blue filled circle
    - When selected, calculates date 30 days before today
    - Date range fields are populated automatically
  - **"Custom Date"** (unselected)
    - User-defined date range
    - When selected, allows manual date selection

**3. Select Date Range Section:**
- **Section Heading**: "Select Date Range"
- **Date Input Fields**: Displayed side-by-side
  - **Start Date Input Field:**
    - Date picker widget for selecting start date
    - Format displayed: `DD-MM-YYYY` (e.g., "01-01-2025")
    - Stored internally as `YYYY-MM-DD` format
    - Example value: "01-01-2025"
    - Editable date picker (calendar UI available on click)
  - **End Date Input Field:**
    - Date picker widget for selecting end date
    - Format displayed: `DD-MM-YYYY` (e.g., "17-12-2025")
    - Stored internally as `YYYY-MM-DD` format
    - Example value: "17-12-2025"
    - Editable date picker (calendar UI available on click)
- **Note**: Date range fields are visible and populated even when "Last 30 days" is selected

**4. Market Profile Section:**
- **Section Heading**: "Market Profile"
- **Dropdown Widget**: Market profile dropdown menu
- **Currently Selected**: "Year" (example from snapshot)
- **Type**: Dropdown menu with down arrow icon on the right
- **Purpose**: Filters trip data by market profile/region
- **Options**: Expandable list of market profile options
- **Default Value**: May vary (example shows "Year")

**5. Organization Group Section:**
- **Section Heading**: "Organization Group"
- **Dropdown Widget**: Organization group dropdown menu
- **Currently Selected**: "Year" (example from snapshot)
- **Type**: Dropdown menu with down arrow icon on the right
- **Purpose**: Filters trip data by organization group
- **Options**: Expandable list of organization group options
- **Default Value**: May vary (example shows "Year")

**6. Organization Section:**
- **Section Heading**: "Organization"
- **Dropdown Widget**: Organization dropdown menu
- **Currently Selected**: "Year" (example from snapshot)
- **Type**: Dropdown menu with down arrow icon on the right
- **Purpose**: Filters trip data by specific organization
- **Options**: Expandable list of organization options
- **Default Value**: May vary (example shows "Year")

**7. Action Buttons Section:**
- **Cancel Button**:
  - Outlined in blue with white text
  - Closes modal without applying changes
  - Resets filter selections to previous state
- **Apply Button**:
  - Filled with blue background and white text
  - Applies selected filters to dashboard
  - Triggers connection reloads and data refresh
  - Closes modal after applying

**Date Range Calculations:**

**1. Last 1 Day:**
```javascript
var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

var lastDayStart = formatDate(yesterday);
var lastDayEnd = formatDate(yesterday);
```

**2. Last 7 Days:**
```javascript
var today = new Date();
var lastDayStart = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
var lastDayEnd = formatDate(yesterday);
```

**3. Last 30 Days:**
```javascript
var today = new Date();
var lastDayStart = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
var lastDayEnd = formatDate(yesterday);
```

**4. Custom Date:**
- User selects custom start and end dates via date pickers
- Dates stored in `YYYY-MM-DD` format internally
- Displayed in `DD-MM-YYYY` format in UI

---

## Export Scripts

### Excel Export

**Trigger:** Click on Excel export icon (`svg_export`)

**Click Handler:**

```javascript
// Reload connection C_9 to fetch data and trigger export
sdk.reload(['C_9']);
```

**Connection C_9 Export Logic:**

The export logic runs in connection `C_9` when data is received (`changedItem` event). It dynamically loads the XLSX library and creates an Excel file with filter information and traveller data.

**Complete Implementation:**

```javascript
// Get data from connection
var val = changedItem.attributes.data;

// Load XLSX library dynamically
function loadXLSX(callback) {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = callback;
    document.head.appendChild(script);
}

// Execute export after library loads
loadXLSX(() => {
    console.log("XLSX loaded!");

    // Fetch filter values from SDK context
    var org_id = sdk.getContext('org_id');
    var start_date = sdk.getContext('sdt');
    var end_date = sdk.getContext('edt');   // FIXED

    // Prepare filter information rows
    var filterInfo = [
        { Filter: "Org ID", Value: org_id || "-" },
        { Filter: "Start Date", Value: start_date || "-" },
        { Filter: "End Date", Value: end_date || "-" },
        {}, // Blank row for spacing
        { Filter: "---- Traveller Data Starts Below ----", Value: "" }
    ];

    // Combine filter info + actual data
    const combinedData = [...filterInfo, ...val];

    // Create sheet
    const ws = XLSX.utils.json_to_sheet(combinedData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Export file
    XLSX.writeFile(wb, "Organization Traveller Tracker Report.xlsx");
});
```

**Execution Flow:**

1. **User clicks Excel export icon** (`svg_export`)
2. **Click handler executes**: `sdk.reload(['C_9'])`
3. **Connection C_9 reloads**: Fetches traveller data based on current filters
4. **Data received**: `changedItem.attributes.data` contains traveller data
5. **XLSX library loads**: Dynamically loaded from CDN
6. **Export executes**: After library loads, creates Excel file with filter info and data
7. **File downloads**: Browser automatically downloads "Organization Traveller Tracker Report.xlsx"

### Implementation Details

**1. Connection Reloading:**
- Reloads connection `C_9` when export button is clicked
- Connection `C_9` fetches traveller data based on current filters
- Export logic executes when data is received (`changedItem` event)

**2. XLSX Library Loading:**
- Dynamically loads XLSX library from CDN: `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`
- Uses version 0.18.5 of SheetJS XLSX library
- Loads asynchronously via script tag injection
- Executes export callback after library loads

**3. Filter Value Retrieval:**
- Retrieves filter values from SDK context:
  - `org_id`: Organization ID
  - `sdt`: Start date (YYYY-MM-DD format)
  - `edt`: End date (YYYY-MM-DD format)
- Uses fallback value `"-"` if filter value is not available

**4. Filter Information Rows:**
- Creates header rows with filter information:
  - **Row 1**: `{ Filter: "Org ID", Value: org_id || "-" }`
  - **Row 2**: `{ Filter: "Start Date", Value: start_date || "-" }`
  - **Row 3**: `{ Filter: "End Date", Value: end_date || "-" }`
  - **Row 4**: Empty row for spacing
  - **Row 5**: `{ Filter: "---- Traveller Data Starts Below ----", Value: "" }`
- Provides context about applied filters in exported file

**5. Data Combination:**
- Combines filter information rows with actual traveller data
- Uses spread operator: `[...filterInfo, ...val]`
- Filter info appears at the top of the Excel file
- Traveller data follows below the separator row

**6. Excel File Creation:**
- Creates worksheet using `XLSX.utils.json_to_sheet(combinedData)`
- Converts JSON array to Excel worksheet format
- Creates workbook using `XLSX.utils.book_new()`
- Appends worksheet to workbook with name "Sheet1"

**7. File Export:**
- Exports file using `XLSX.writeFile(wb, "Organization Traveller Tracker Report.xlsx")`
- File name: `"Organization Traveller Tracker Report.xlsx"`
- Automatically triggers browser download
- File contains filter information and traveller data

### Exported Data Structure

**Filter Information Section:**
- **Column A**: Filter name (e.g., "Org ID", "Start Date", "End Date")
- **Column B**: Filter value (e.g., organization ID, date values)
- Blank row for spacing
- Separator row indicating where traveller data starts

**Traveller Data Section:**
- All columns from traveller data connection (`C_9`)
- Data filtered based on current dashboard filters:
  - Organization ID (`org_id`)
  - Start date (`sdt`)
  - End date (`edt`)
  - Additional filters applied in dashboard

### Export Features

**Dynamic Library Loading:**
- XLSX library loaded only when export is triggered
- Reduces initial page load time
- Library loaded from CDN (Cloudflare)

**Filter Context Preservation:**
- Exported file includes filter information
- Users can see what filters were applied when data was exported
- Helps with data traceability and audit trails

**Data Format:**
- Excel format (.xlsx)
- Compatible with Microsoft Excel, Google Sheets, LibreOffice
- Structured data with headers

**File Naming:**
- Fixed filename: `"Organization Traveller Tracker Report.xlsx"`
- Descriptive name indicating report type
- Consistent naming for easy identification

### Widget IDs Reference

**Export Components:**
- `svg_export`: Excel export icon button (triggers export)

**Data Connections:**
- `C_9`: Traveller data connection (reloaded on export click, provides data for export)

### Context Variables Used

**Filter Values:**
- `org_id`: Organization ID (from SDK context)
- `sdt`: Start date (from SDK context)
- `edt`: End date (from SDK context)

**Note:** The export uses current filter values from SDK context, ensuring exported data matches what's displayed on the dashboard.

### Share/Send Functionality

**Trigger:** Click on share/send icon (`svg_share`)

**Unique Logic:**
1. **Data Preparation**: Prepares current dashboard state
2. **Share Options**: Provides sharing options (email, link, etc.)
3. **Export Format**: May export as PDF or generate shareable link

---

## Guided Tour

### Purpose

The Guided Tour feature provides an interactive walkthrough of the dashboard, helping users understand key features and components. The tour highlights important elements and explains their functionality.

### Tour Configuration

**Complete Implementation:**

```javascript
var hasScrolledToBottom = false;

var tabSelected = sdk.getContext('tabSelected');

if (tabSelected === 'executive_summary') {
    var config = {
        name: 'dashboardTour',
        steps: [
            {
                "element": "#" + sdk.getDivIdFromComponetId('label252'),
                "title": "Filter Button",
                "content": "Clicking this button opens a menu to refine the data displayed on the dashboard.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('svg275'),
                "title": "Export ",
                "content": "Export as Excel Data ",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('box134'),
                "title": "Tip Message Bar",
                "content": "Provides a quick hint explaining that clicking any metric card updates the trend analysis.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('box72'),
                "title": "Ongoing Trips Card",
                "content": "Shows the current number of ongoing trips.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('box73'),
                "title": "Upcoming Trips Card",
                "content": "Displays the count of trips scheduled in the near future.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('box_ZJ'),
                "title": "Completed Trips Card",
                "content": "Indicates the total number of trips already completed.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('box80'),
                "title": "Geographic Distribution Chart",
                "content": "Visualizes trip trends over time based on the selected location filter.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('filter83'),
                "title": "Location Dropdown",
                "content": "Allows filtering the chart by location-based criteria.",
                "placement": "auto",
                "duration": "3000"
            }
            /* Commented out steps:
            {
                "element": "#" + sdk.getDivIdFromComponetId('box74'),
                "title": "Traveller Details Table",
                "content": "Displays the detailed travel information for the selected location.",
                "placement": "auto",
                "duration": "3000"
            },
            {
                "element": "#" + sdk.getDivIdFromComponetId('filter80'),
                "title": "Traveller ID Dropdown",
                "content": "Lets you choose a traveller to display their trip details.",
                "placement": "auto",
                "duration": "3000"
            }
            */
        ]
    };
}

sdk.startDashboardTour(config);
```

### Implementation Details

**1. Tab-Based Activation:**
- Tour only activates when `tabSelected === 'executive_summary'`
- Checks current tab selection from SDK context
- Ensures tour runs only on the executive summary tab

**2. Tour Configuration:**
- **Tour Name**: `'dashboardTour'`
- **Steps Array**: Contains 8 active steps (2 steps commented out)
- Each step highlights a specific dashboard component

**3. Tour Steps:**

**Step 1: Filter Button**
- **Element**: `label252` (Filter button)
- **Title**: "Filter Button"
- **Content**: "Clicking this button opens a menu to refine the data displayed on the dashboard."
- **Purpose**: Introduces filter functionality

**Step 2: Export Button**
- **Element**: `svg275` (Export icon)
- **Title**: "Export "
- **Content**: "Export as Excel Data "
- **Purpose**: Explains Excel export functionality

**Step 3: Tip Message Bar**
- **Element**: `box134` (Tip banner container)
- **Title**: "Tip Message Bar"
- **Content**: "Provides a quick hint explaining that clicking any metric card updates the trend analysis."
- **Purpose**: Explains the tip banner feature

**Step 4: Ongoing Trips Card**
- **Element**: `box72` (Ongoing trips KPI card)
- **Title**: "Ongoing Trips Card"
- **Content**: "Shows the current number of ongoing trips."
- **Purpose**: Introduces Ongoing trips metric

**Step 5: Upcoming Trips Card**
- **Element**: `box73` (Upcoming trips KPI card)
- **Title**: "Upcoming Trips Card"
- **Content**: "Displays the count of trips scheduled in the near future."
- **Purpose**: Introduces Upcoming trips metric

**Step 6: Completed Trips Card**
- **Element**: `box_ZJ` (Completed trips KPI card)
- **Title**: "Completed Trips Card"
- **Content**: "Indicates the total number of trips already completed."
- **Purpose**: Introduces Completed trips metric

**Step 7: Geographic Distribution Chart**
- **Element**: `box80` (Geographic distribution chart container)
- **Title**: "Geographic Distribution Chart"
- **Content**: "Visualizes trip trends over time based on the selected location filter."
- **Purpose**: Explains the geographic chart functionality

**Step 8: Location Dropdown**
- **Element**: `filter83` (Location filter dropdown)
- **Title**: "Location Dropdown"
- **Content**: "Allows filtering the chart by location-based criteria."
- **Purpose**: Explains location filtering

**Commented Out Steps (Not Active):**

**Step 9: Traveller Details Table** (Commented)
- **Element**: `box74` (Traveller details table)
- **Title**: "Traveller Details Table"
- **Content**: "Displays the detailed travel information for the selected location."
- **Status**: Currently disabled in tour

**Step 10: Traveller ID Dropdown** (Commented)
- **Element**: `filter80` (Traveller ID filter dropdown)
- **Title**: "Traveller ID Dropdown"
- **Content**: "Lets you choose a traveller to display their trip details."
- **Status**: Currently disabled in tour

**4. Step Properties:**
- **element**: CSS selector for the component (using `sdk.getDivIdFromComponetId()`)
- **title**: Step title displayed in tour popup
- **content**: Step description/explanation text
- **placement**: `"auto"` - automatically determines best placement
- **duration**: `"3000"` milliseconds (3 seconds) - time to display step

**5. Tour Execution:**
- Calls `sdk.startDashboardTour(config)` to initiate the tour
- Tour library handles step navigation, highlighting, and user interaction
- Users can navigate through steps using Next/Previous buttons

### Widget IDs Reference

**Tour Elements:**
- `label252`: Filter button
- `svg275`: Export icon button
- `box134`: Tip message bar container
- `box72`: Ongoing trips KPI card
- `box73`: Upcoming trips KPI card
- `box_ZJ`: Completed trips KPI card
- `box80`: Geographic distribution chart container
- `filter83`: Location dropdown filter

**Commented Elements (Not in Active Tour):**
- `box74`: Traveller details table
- `filter80`: Traveller ID dropdown filter

### Tour Features

**Interactive Walkthrough:**
- Highlights each component sequentially
- Shows tooltips with explanations
- Guides users through dashboard features

**Auto Placement:**
- Tour popup automatically positions itself optimally
- Adjusts based on element position and screen size

**Timed Display:**
- Each step displays for 3 seconds (3000ms)
- Users can navigate manually if needed

**Tab-Specific:**
- Only runs on "executive_summary" tab
- Prevents tour from running on incorrect tabs

**Context-Aware:**
- Uses SDK component ID resolution
- Dynamically generates element selectors

### Usage Notes

- Tour activates automatically when conditions are met (tab selection)
- Can be triggered programmatically via `sdk.startDashboardTour()`
- Tour steps can be enabled/disabled by commenting/uncommenting steps
- Additional steps can be added to the steps array
- Tour library handles user navigation and step progression

---

## Data Structure & Context Management

### SDK Context Variables

**Filter State:**
- `sdt`: Start date (YYYY-MM-DD format) - Default: 30 days before today
- `edt`: End date (YYYY-MM-DD format) - Default: Today
- `cdc`: Custom date check flag (`false` = predefined range selected) - Default: `false`
- `customDateSelected`: Boolean indicating if custom date range is selected - Default: `false`
- `mProfile`: Market profile ID - Default: `'1'`
- `filter`: Filter flag - Default: `false`

**Organization State:**
- `org_grp_id`: Organization Group ID - Default: `'No Organization Group'`
- `org_id`: Organization ID (extracted from user properties)
- `organization_name`: Organization name (used in filter display) - Retrieved from context

**Status State:**
- `status`: Status filter - Default: `'Ongoing'`
- `status_selected`: Selected status (`'ongoing'`, `'upcoming'`, `'completed'`) - Updated when KPI card clicked - Default: `'ongoing'`
- `statusClicked`: Status clicked flag - Set to `true` when status KPI card is clicked - Default: `false`

**Tab State:**
- `tabSelected`: Active tab - Default: `'executive_summary'`

**Pagination State:**
- `pageNumber`: Page number - Default: `'1'`
- `skip`: Skip value - Default: `'0'`

**Additional Flags:**
- `adg`: Additional flag - Default: `true` (set after initial `false`)

**User Information:**
- `dashboard_user`: User object containing `authToken` and permissions
- `homeURL`: Base URL for API calls (constructed dynamically from `window.location`)

**Map State:**
- `mapZoomLevel`: Current zoom level of the map
- `mapLocation`: Currently focused location
- `mapFullscreen`: Boolean indicating if map is in fullscreen mode

### Global Variables (stored in `label283`)

**Date Range:**
- `Value`: Start date (YYYY-MM-DD) - Default: 30 days before today
- `Value1`: End date (YYYY-MM-DD) - Default: Today

**Market Profile:**
- `Value_MPID`: Market profile ID (from user properties, JSON format)
- `Value_NM`: Market profile ID (parsed, first element as string)

**Organization Filters:**
- `Value_ORG`: Organization ID (extracted from user properties)
- `Value_ORGrpId`: Organization Group ID - Default: `'No Organization Group'`

**Status Filter:**
- `Value_ST`: Status filter (`'ongoing'`, `'upcoming'`, `'completed'`) - Updated when KPI card is clicked - Default: `'ongoing'`

**Location Filter:**
- `Value_LC`: Location IDs (comma-separated string or array) - Default: `"253,459,645,1094,1917,3859"`
- Updated when marker is clicked with selected location ID(s)

**Traveller Filter:**
- `Value_TN`: Traveller profile IDs (comma-separated string) - Set when marker is clicked
- Contains traveller profile IDs for travellers at selected location
- Used to filter traveller details table

### Widget Properties

**Map Properties:**
- `m_zoomLevel`: Current zoom level
- `m_centerLat`: Center latitude
- `m_centerLng`: Center longitude
- `m_markers`: Array of map markers

**KPI Card Properties:**
- `m_value`: Display value (trip count)
- `m_clickable`: Boolean indicating if card is clickable
- `m_selected`: Boolean indicating if card is currently selected

**Chart Properties:**
- `m_seriesDisplayNames`: Array of series display names
- `m_dataSource`: Data source connection ID

---

## Notes

- All trip counts displayed as whole numbers
- Date formats: Display uses `DD-MM-YYYY`, storage uses `YYYY-MM-DD`
- Geographic map supports zoom, location focus, and fullscreen modes
- KPI cards are interactive - clicking triggers detailed trend analysis
- Trend analysis chart updates automatically based on selected metric card
- Excel export functionality exports currently filtered/visible data only
- Excel export uses XLSX library (SheetJS) loaded dynamically from CDN when export button is clicked
- Exported Excel file includes filter information (Org ID, Start Date, End Date) at the top, followed by traveller data
- Excel export file name: "Organization Traveller Tracker Report.xlsx"
- Excel export reloads connection `C_9` to fetch filtered traveller data for export
- The initialization script runs automatically on page load
- Tip banner provides user guidance on interactive features
- Guided tour feature provides interactive walkthrough of dashboard components (8 active steps)
- Guided tour activates only on "executive_summary" tab
- Guided tour highlights key features: Filter button, Export button, Tip banner, KPI cards, Geographic chart, Location dropdown
- Each tour step displays for 3 seconds with auto-placement of tooltips
- Map markers show trip counts at each location
- Trip status is determined based on current date and trip start/end dates
- User authentication required before dashboard initialization
- Market profile and organization ID extracted from user properties via AJAX call
- Base URL (`homeURL`) constructed dynamically from current page location
- Default date range: Last 30 days (from 30 days ago to today, not yesterday)
- Default status: Ongoing trips (`'ongoing'`)
- Default organization group: "No Organization Group"
- Layout height adjusts automatically based on layout type (Absolute/Mobile/Tablet)
- Connections reloaded: `C_2`, `C_3`, `C_5`, `C_6`, `C_7`, `C_8`, `C_10` (7 connections)
- Duplicate execution prevention prevents script from running multiple times
- KPI cards (Ongoing, Upcoming, Completed) are clickable and filter dashboard by trip status
- Clicking Ongoing KPI card filters to show only ongoing trips, shows `box76` container, updates filter display, and reloads connections `C_6` and `C_12`
- Clicking Upcoming KPI card filters to show only upcoming trips, shows `box77` container, updates filter display, and reloads connections `C_6` and `C_12`
- Clicking Completed KPI card filters to show only completed trips, shows `box_QD` container, updates filter display, and reloads connections `C_6` and `C_12`
- Status card backgrounds update to highlight selected status:
  - Ongoing: White background when selected, light blue (`#DBEAFE`) when not selected
  - Upcoming: White background when selected, light blue (`#DBEAFE`) when not selected
  - Completed: Light blue (`#DBEAFE`) background when selected, white when not selected
- Filter display shows all active filters in format: "Start Date: DD-MM-YY | End Date: DD-MM-YY | Market Profile: [Name] | Organization Group: [Name] | Organization: [Name] | Status: [Status]"
- Dashboard height resets to 900px when status filter is applied (hides traveller details if shown)
- Each status uses a different container component (`box76` for Ongoing, `box77` for Upcoming, `box_QD` for Completed)
- Filter button click handler shows filter modal, adjusts dashboard height to 1040px, and reloads connection `C_27` for filter options
- Filter modal height and component positions adjust dynamically based on layout type (Absolute/Mobile/Tablet) and custom date selection state
- Filter modal width is set to 337px when opened
- Custom date filter group (`customDateFilter`) is shown/hidden based on whether custom date is selected
- Filter modal component positions are adjusted for both Absolute and Mobile layouts with different heights for custom vs predefined date selections

---

**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Author**: Organization Traveller Tracker Dashboard Development Team

