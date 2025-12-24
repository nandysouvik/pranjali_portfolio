# Flight Service Dashboard - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Global Filters](#global-filters)
3. [KPI Metrics Reference](#kpi-metrics-reference)
4. [SDK Methods Reference](#sdk-methods-reference)
5. [Component & Widget IDs Reference](#component--widget-ids-reference)
6. [Dashboard Initialization Script](#dashboard-initialization-script)
7. [KPI Tile Value Updates](#kpi-tile-value-updates)
8. [Tab Navigation Scripts](#tab-navigation-scripts)
9. [View Insights Scripts](#view-insights-scripts)
10. [Filter Modal Script](#filter-modal-script)
11. [Guided Tour Script](#guided-tour-script)
12. [Export Scripts](#export-scripts)
13. [Data Structure & Context Management](#data-structure--context-management)

---

## Overview

The Flight Service Dashboard is a vanilla JavaScript application using jQuery and a proprietary Dashboard SDK. It provides analytics for flight service operations across three main views: Financial Overview, Booking Overview, and Booking Trends and Insights.

### Technology Stack

- **Vanilla JavaScript**: Core application logic
- **jQuery**: AJAX requests and DOM manipulation
- **Dashboard SDK**: Widget management, context handling, component visibility
- **HTML/CSS**: Frontend structure and styling

### Architecture Principles

1. **Widget-Based Components**: All UI elements are widgets identified by unique IDs
2. **Connection-Based Data**: Data connections (`C_1`, `C_2`, etc.) link widgets to data sources
3. **Context-Driven State**: SDK context stores application state (tabs, filters, user info)
4. **Global Variable Management**: Shared variables accessible across widgets via `label253`
5. **Group-Based Visibility**: Component groups enable bulk show/hide operations

---

## Global Filters

The Flight Service Dashboard provides global filtering capabilities that allow users to refine data across all dashboard views. Filters are applied consistently across Financial Overview, Booking Overview, and Booking Trends tabs.

### Available Filters

**Date Range:**
- Filters data between the specified start and end dates
- Supports predefined ranges (Last 1 Day, Last 7 Days, Last 30 Days) and custom date selection
- Date format: `YYYY-MM-DD` (ISO 8601 compliant)
- Stored in SDK context as `sdt` (start date) and `edt` (end date)
- Also stored in global variables as `Value` (start date) and `Value1` (end date) in `label253` widget

**Market Profile:**
- Filters market profiles based on selected ID
- Available options:
  - `'1'`: UAE (AED) - United Arab Emirates Dirham
  - `'2'`: India (INR) - Indian Rupee
  - `'3'`: Qatar (QAR) - Qatari Riyal
  - `'4'`: Saudi Arabia (SAR) - Saudi Riyal
- Stored in SDK context as `mProfile`
- Default value: `'1'` (UAE/AED)
- Affects currency display in KPI tiles and charts

**Business Type:**
- Filters data by business type (Bookings or Sales)
- Stored in global variable `Value_BS` in `label253` widget
- Values: `'Bookings'` or `'Sales'`
- Default: `'Bookings'`
- Used in Booking Overview tab to toggle between booking counts and sales revenue

### Filter Application

**Filter Modal:**
- Triggered by clicking the filter icon
- Modal widget ID: `box229`
- Filter widget connection: `C_27`
- Market profile dropdown: `hfilter250`
- Apply button: `label251`
- Cancel button: `label250`

**Filter State Management:**
- Filter selections stored in SDK context for persistence
- Global variables updated via `sdk.updateGlobalVariable('label253', {...}, false)`
- Context variables updated via `sdk.setContext(key, value)`
- Filter changes trigger connection reloads to refresh dashboard data

**Filter Reset:**
- Default date range: Last 30 days (calculated dynamically)
- Default market profile: UAE (AED)
- Default business type: Bookings
- Reset occurs on dashboard initialization or when filters are cleared

### Filter Impact on Data

**Date Range Impact:**
- All KPI tiles recalculate values based on selected date range
- Charts update to show data for selected period
- Percentage change calculations compare to same period in previous year
- View Insights modals filter data by selected date range

**Market Profile Impact:**
- Currency symbols update in KPI tiles (AED, INR, QAR, SAR)
- Chart series names update with currency suffix (e.g., "Sales (AED)")
- Data filtered to show only bookings/revenue for selected market profile
- Organization and traveler filters may cascade based on market profile selection

**Business Type Impact:**
- Booking Overview charts toggle between booking counts and sales revenue
- Chart series names update (e.g., "Bookings" vs "Sales (AED)")
- Data connections reload with appropriate business type parameter
- KPI tiles display either booking metrics or financial metrics

### Filter Components Reference

**Filter Widget IDs:**
- `C_27`: Filter widget container connection
- `box229`: Filter modal container
- `label_EH`: Label above market profile selector
- `hfilter250`: Market profile dropdown filter widget
- `label250`: Cancel button
- `label251`: Apply button
- `customDateFilter`: Custom date picker group (shown when custom date selected)

**Filter Context Variables:**
- `sdt`: Start date (YYYY-MM-DD format)
- `edt`: End date (YYYY-MM-DD format)
- `mProfile`: Market profile ID (`'1'`, `'2'`, `'3'`, `'4'`)
- `customDateSelected`: Boolean indicating if custom date range is selected

---

## KPI Metrics Reference

This section provides detailed descriptions of all Key Performance Indicators (KPIs) displayed in the Flight Service Dashboard, including their attributes, data sources, and calculation methods.

### Financial Overview KPIs

#### 1. Gross Booking Value

**Description:**
This metric captures the total monetary value of all flight bookings made within a specific period. It represents the cumulative gross booking amount before any deductions, providing insights into booking volume and revenue potential.

**Attributes:**
- `gross_booking_value` (numeric)
  - The total monetary value of all flight bookings within the selected date range
  - Includes ticket cost, taxes, service fees, and other booking-related charges
  - Displayed with currency prefix based on market profile (AED, INR, QAR, SAR)
  - Formatted with abbreviation for large numbers (K/M/B format)
- `booking_date` (date)
  - The date on which the flight bookings were made
  - Used for time-based filtering, grouping (e.g., by day, month), and trend analysis
  - Enables comparison across different time periods
- `gross_booking_percentage_change` (numeric / percentage)
  - The percentage difference in gross booking value compared to the same period in the previous year
  - Calculated as: `((current_value - previous_year_value) / previous_year_value) * 100`
  - Positive values indicate growth, negative values indicate decline
  - Displayed with visual trend indicators (sparkline chart and up/down arrows)

**Widget IDs:**
- `label17`: KPI tile display value
- `sparkline18`: Trend sparkline chart
- `label20`: Percentage change label
- `svg19`: Down arrow icon (negative change)
- `svg20`: Up arrow icon (positive change)

**View Insights:**
- Metric identifier: `'gross_booking'`
- Stored in global variable `Value3`
- Available time granularities: Daily, Quarterly, Monthly
- Insight connections: `C_49`, `C_50`, `C_52`

#### 2. Total Revenue

**Description:**
This metric measures the total revenue generated from flight bookings after accounting for all revenue streams. It provides insights into actual revenue earned from flight operations within the selected period.

**Attributes:**
- `total_revenue` (numeric)
  - The total revenue generated from all flight bookings within the selected date range
  - Represents net revenue after deductions and adjustments
  - Displayed with currency prefix based on market profile
  - Formatted with abbreviation for large numbers (K/M/B format)
- `booking_date` (date)
  - The date when the flight bookings were made
  - Used for time-based analysis and trend tracking
- `total_revenue_percentage_change` (numeric / percentage)
  - The percentage change in total revenue compared to the same period in the previous year
  - Provides year-over-year growth comparison

**Widget IDs:**
- `sparkline27`: Trend sparkline chart
- `label24`: Percentage change label
- `svg22`: Up arrow icon
- `svg23`: Down arrow icon

**View Insights:**
- Metric identifier: `'total_revenue'`
- Available time granularities: Daily, Quarterly, Monthly

#### 3. Profit Margin

**Description:**
This metric calculates the profit margin percentage, representing the profitability of flight bookings. It indicates the percentage of revenue that remains as profit after accounting for costs and expenses.

**Attributes:**
- `profit_margin` (numeric / percentage)
  - The profit margin percentage for flight bookings within the selected date range
  - Calculated as: `((revenue - costs) / revenue) * 100`
  - Displayed as a percentage value
  - Higher values indicate better profitability
- `booking_date` (date)
  - The date when the flight bookings were made
  - Used for tracking profit margin trends over time
- `profit_margin_percentage_change` (numeric / percentage)
  - The percentage change in profit margin compared to the same period in the previous year
  - Indicates whether profitability is improving or declining

**Widget IDs:**
- `sparkline35`: Trend sparkline chart
- `label32`: Percentage change label
- `svg31`: Up arrow icon
- `svg30`: Down arrow icon

**View Insights:**
- Metric identifier: `'profit_margin'`
- Available time granularities: Daily, Quarterly, Monthly

#### 4. Total Supplier Payment

**Description:**
This metric tracks the total amount paid to flight suppliers (airlines) for bookings made within a specific period. It provides visibility into supplier costs and payment obligations.

**Attributes:**
- `total_supplier_payment` (numeric)
  - The total amount paid to flight suppliers for bookings within the selected date range
  - Includes payments for tickets, fees, and other supplier-related charges
  - Displayed with currency prefix based on market profile
  - Formatted with abbreviation for large numbers (K/M/B format)
- `booking_date` (date)
  - The date when the flight bookings were made
  - Used for tracking supplier payment trends over time
- `total_supplier_payment_percentage_change` (numeric / percentage)
  - The percentage change in total supplier payment compared to the same period in the previous year
  - Helps identify cost trends and supplier payment patterns

**Widget IDs:**
- `sparkline43`: Trend sparkline chart
- `label41`: Percentage change label
- `svg39`: Up arrow icon
- `svg40`: Down arrow icon

**View Insights:**
- Metric identifier: `'supplier_payment'`
- Available time granularities: Daily, Quarterly, Monthly

### Booking Overview KPIs

#### 5. Processed Bookings

**Description:**
This metric counts the total number of flight bookings that have been processed within the selected date range, regardless of their final status. It provides insights into booking processing volume and operational activity.

**Attributes:**
- `processed_bookings` (numeric)
  - The total count of flight bookings processed within the selected date range
  - Includes all bookings that entered the processing pipeline
  - Displayed as a whole number (no decimal places)
  - May be formatted with abbreviation for large numbers (K/M/B format)
- `booking_date` (date)
  - The date when the bookings were processed
  - Used for time-based analysis and processing trend tracking
- `processed_bookings_percentage_change` (numeric / percentage)
  - The percentage change in processed bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'processed_bookings'`
- Data grid connections: `C_71`, `C_82`, `C_83`, `C_84`
- Provides detailed breakdown in data grid format

#### 6. Successful Bookings

**Description:**
This metric counts the total number of flight bookings that were successfully completed and confirmed within the selected date range. It represents completed transactions and successful booking outcomes.

**Attributes:**
- `successful_bookings` (numeric)
  - The total count of successfully completed flight bookings within the selected date range
  - Includes only bookings with confirmed status
  - Displayed as a whole number
  - Key indicator of booking success rate
- `booking_date` (date)
  - The date when the bookings were successfully completed
  - Used for tracking success rate trends over time
- `successful_bookings_percentage_change` (numeric / percentage)
  - The percentage change in successful bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'successful_bookings'`
- Provides detailed breakdown in data grid format

#### 7. Failed Bookings

**Description:**
This metric tracks the total number of flight bookings that failed during processing within the selected date range. It helps identify booking failure patterns and operational issues.

**Attributes:**
- `failed_bookings` (numeric)
  - The total count of failed flight bookings within the selected date range
  - Includes bookings that failed due to payment issues, inventory unavailability, or system errors
  - Displayed as a whole number
  - Used for identifying operational problems
- `booking_date` (date)
  - The date when the bookings failed
  - Used for tracking failure patterns and trends
- `failed_bookings_percentage_change` (numeric / percentage)
  - The percentage change in failed bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'failed_bookings'`
- Provides detailed breakdown in data grid format

#### 8. Cancelled Bookings

**Description:**
This metric counts the total number of flight bookings that were cancelled within the selected date range, either by customers or due to operational reasons.

**Attributes:**
- `cancelled_bookings` (numeric)
  - The total count of cancelled flight bookings within the selected date range
  - Includes both customer-initiated and system-initiated cancellations
  - Displayed as a whole number
  - Helps track cancellation rates and patterns
- `booking_date` (date)
  - The date when the bookings were cancelled
  - Used for analyzing cancellation trends over time
- `cancelled_bookings_percentage_change` (numeric / percentage)
  - The percentage change in cancelled bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'cancelled_bookings'`
- Provides detailed breakdown in data grid format

#### 9. Changed Bookings

**Description:**
This metric tracks the total number of flight bookings that were modified or changed within the selected date range, including date changes, route modifications, or passenger updates.

**Attributes:**
- `changed_bookings` (numeric)
  - The total count of modified flight bookings within the selected date range
  - Includes all types of booking changes (dates, routes, passengers, etc.)
  - Displayed as a whole number
  - Indicates booking modification activity
- `booking_date` (date)
  - The date when the bookings were changed
  - Used for tracking change patterns and trends
- `changed_bookings_percentage_change` (numeric / percentage)
  - The percentage change in changed bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'changed_bookings'`
- Provides detailed breakdown in data grid format

#### 10. Fraud Failed Booking

**Description:**
This metric counts the total number of flight bookings that failed due to fraud detection or security concerns within the selected date range. It helps monitor security and fraud prevention effectiveness.

**Attributes:**
- `fraud_failed_booking` (numeric)
  - The total count of flight bookings that failed due to fraud detection within the selected date range
  - Includes bookings flagged by fraud detection systems
  - Displayed as a whole number
  - Critical for security monitoring
- `booking_date` (date)
  - The date when the fraud was detected and booking failed
  - Used for tracking fraud patterns and security trends
- `fraud_failed_booking_percentage_change` (numeric / percentage)
  - The percentage change in fraud failed bookings compared to the same period in the previous year

**View Insights:**
- KPI identifier: `'fraud_failed_booking'`
- Provides detailed breakdown in data grid format

### Chart-Based Metrics

#### 11. Online v/s Offline Bookings

**Description:**
This metric compares booking volumes and revenue between online and offline booking channels. It helps understand channel preferences and performance differences.

**Attributes:**
- `online_bookings` (numeric)
  - Total bookings made through online channels (website, mobile app)
  - Can represent booking count or revenue amount depending on context
- `offline_bookings` (numeric)
  - Total bookings made through offline channels (call center, travel agents)
  - Can represent booking count or revenue amount depending on context
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based trend analysis
- `channel_type` (string)
  - Booking channel identifier (`'Online'` or `'Offline'`)
  - Used for grouping and comparison

**Chart Widget IDs:**
- Financial Overview: `bar63`
- Booking Overview: `bar104`
- View Insights Timeline: `timeline202`
- View Insights Weekdays: `grpcolumn231`

**View Insights:**
- Financial context: `'finance_on_off'`
- Booking context: `'booking_on_off'`
- Insight connections: `C_53`, `C_54`

#### 12. Domestic v/s International Bookings

**Description:**
This metric compares booking volumes and revenue between domestic and international flight routes. It provides insights into travel patterns and route preferences.

**Attributes:**
- `domestic_bookings` (numeric)
  - Total bookings for domestic flights (within same country)
  - Can represent booking count or revenue amount depending on context
- `international_bookings` (numeric)
  - Total bookings for international flights (cross-border)
  - Can represent booking count or revenue amount depending on context
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based trend analysis
- `route_type` (string)
  - Route type identifier (`'Domestic'` or `'International'`)
  - Used for grouping and comparison

**Chart Widget IDs:**
- Financial Overview: `bar243`
- Booking Overview: `bar110`
- View Insights Timeline: `timeline243`
- View Insights Weekdays: `grpcolumn232`

**View Insights:**
- Financial context: `'finance_int_dom'`
- Booking context: `'booking_int_dom'`
- Insight connections: `C_55`, `C_56`

#### 13. Channel Wise Breakdown

**Description:**
This metric provides a detailed breakdown of bookings and revenue by booking channel (e.g., Direct, GDS, LCC, Online Travel Agencies). It helps identify channel performance and distribution.

**Attributes:**
- `channel_name` (string)
  - Name of the booking channel (e.g., "Direct", "GDS", "LCC", "OTA")
  - Used for grouping and categorization
- `channel_bookings` (numeric)
  - Total bookings or revenue for the specific channel
  - Can represent booking count or revenue amount depending on context
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based analysis
- `channel_percentage` (numeric / percentage)
  - Percentage contribution of the channel to total bookings/revenue
  - Calculated for pie chart visualization

**Chart Widget IDs:**
- Financial Overview: `pie52`
- Booking Overview: `pie259`

**Chart Configuration:**
- `m_mindatalabelpercentage = 0`: Shows all data labels regardless of percentage
- Series name updates based on business type (Bookings or Sales)

#### 14. Top 5 Organisation by Revenue/Bookings

**Description:**
This metric identifies the top 5 organizations (customers) by revenue or booking volume within the selected date range. It helps identify key customers and their contribution to business.

**Attributes:**
- `organisation_name` (string)
  - Name of the organization/customer
  - Used for identification and grouping
- `organisation_revenue` (numeric)
  - Total revenue generated from the organization (for Financial Overview)
  - Displayed with currency prefix
- `organisation_bookings` (numeric)
  - Total booking count from the organization (for Booking Overview)
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `rank` (numeric)
  - Ranking position (1-5) based on revenue or booking volume
  - Used for sorting and display order

**Chart Widget IDs:**
- Financial Overview: `bar248` (Top 5 Organisation by Revenue)
- Booking Overview: `bar247` (Top 5 Organisation by Booking)

**Chart Configuration:**
- `m_noofmarkers = 5`: Displays top 5 organizations
- Horizontal bar chart visualization

### Booking Trends Metrics

#### 15. Booking Lifecycle

**Description:**
This metric tracks bookings through different stages of the booking lifecycle (e.g., Initiated, Processing, Confirmed, Completed). It provides visibility into booking flow and conversion rates.

**Attributes:**
- `lifecycle_stage` (string)
  - Stage name in the booking lifecycle (e.g., "Initiated", "Processing", "Confirmed", "Completed")
  - Used for funnel visualization
- `stage_count` (numeric)
  - Number of bookings at each lifecycle stage
  - Displayed as whole number
- `booking_date` (date)
  - The date when bookings reached each stage
  - Used for time-based analysis
- `conversion_rate` (numeric / percentage)
  - Percentage of bookings that progressed from previous stage
  - Calculated for funnel analysis

**Chart Widget ID:**
- `funnel160`: Booking Lifecycle funnel chart

#### 16. Booking Patterns by Time Slot

**Description:**
This metric analyzes booking patterns across different time slots throughout the day. It helps identify peak booking hours and optimize operational resources.

**Attributes:**
- `time_slot` (string)
  - Time slot identifier (e.g., "Morning", "Afternoon", "Evening", "Night")
  - Or specific hour ranges (e.g., "00:00-06:00", "06:00-12:00")
  - Used for grouping bookings by time
- `time_slot_bookings` (numeric)
  - Total bookings made during the time slot
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `time_slot_percentage` (numeric / percentage)
  - Percentage of total bookings in the time slot
  - Used for identifying peak periods

**Chart Widget ID:**
- `bar159`: Booking Patterns by Time Slot bar chart

#### 17. Daily Booking Trend

**Description:**
This metric tracks booking volume trends on a daily basis within the selected date range. It provides insights into booking patterns, seasonality, and day-to-day variations.

**Attributes:**
- `booking_date` (date)
  - The specific date of the booking
  - Used for time-series visualization
- `daily_bookings` (numeric)
  - Total bookings made on the specific date
  - Displayed as whole number or with abbreviation
- `date_group` (string)
  - Date grouping identifier (e.g., "Daily", "Weekly", "Monthly")
  - Determines aggregation level for trend analysis

**Chart Widget ID:**
- `timeline162`: Daily Booking Trend timeline chart

#### 18. Booking Breakdown by Status

**Description:**
This metric provides a breakdown of bookings by their current status (e.g., Confirmed, Pending, Cancelled, Failed). It helps monitor booking status distribution and identify issues.

**Attributes:**
- `booking_status` (string)
  - Current status of the booking (e.g., "Confirmed", "Pending", "Cancelled", "Failed")
  - Used for categorization and grouping
- `status_count` (numeric)
  - Number of bookings with the specific status
  - Displayed as whole number
- `booking_date` (date)
  - The date when bookings reached the status
  - Used for time-based filtering
- `status_percentage` (numeric / percentage)
  - Percentage of total bookings with the status
  - Used for pie chart visualization

**Chart Widget ID:**
- `timeline240`: Booking Breakdown by Status timeline chart

#### 19. Week Day Wise Booking

**Description:**
This metric analyzes booking patterns across different days of the week. It helps identify which days have higher booking volumes and optimize marketing and operational strategies.

**Attributes:**
- `weekday` (string)
  - Day of the week (e.g., "Monday", "Tuesday", "Wednesday", etc.)
  - Used for grouping and comparison
- `weekday_bookings` (numeric)
  - Total bookings made on the specific weekday
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for filtering and aggregation
- `weekday_percentage` (numeric / percentage)
  - Percentage of total bookings on the weekday
  - Used for identifying peak days

**Chart Widget ID:**
- `column175`: Week Day Wise Booking column chart

#### 20. LCC v/s GDS

**Description:**
This metric compares booking volumes between Low-Cost Carriers (LCC) and Global Distribution Systems (GDS). It helps understand distribution channel preferences and performance.

**Attributes:**
- `distribution_type` (string)
  - Distribution channel type (`'LCC'` or `'GDS'`)
  - Used for categorization
- `distribution_bookings` (numeric)
  - Total bookings through the distribution type
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based analysis
- `distribution_percentage` (numeric / percentage)
  - Percentage of total bookings through the distribution type
  - Used for pie chart visualization

**Chart Widget ID:**
- `pie174`: LCC v/s GDS pie chart

#### 21. Airline Wise Performance

**Description:**
This metric tracks booking performance and revenue by airline provider. It helps identify top-performing airlines and partnership opportunities.

**Attributes:**
- `airline_name` (string)
  - Name of the airline provider (e.g., "Emirates", "Delta", "Lufthansa")
  - Used for identification and grouping
- `airline_bookings` (numeric)
  - Total bookings with the airline
  - Can represent booking count or revenue amount
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `airline_percentage` (numeric / percentage)
  - Percentage of total bookings/revenue with the airline
  - Used for performance comparison

**Chart Widget ID:**
- `timeline178`: Airline Wise Performance timeline chart

#### 22. Supplier Wise Booking

**Description:**
This metric provides a breakdown of bookings by supplier. It helps monitor supplier performance and identify key supplier relationships.

**Attributes:**
- `supplier_name` (string)
  - Name of the supplier/provider
  - Used for identification and grouping
- `supplier_bookings` (numeric)
  - Total bookings through the supplier
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `supplier_percentage` (numeric / percentage)
  - Percentage of total bookings through the supplier
  - Used for pie chart visualization

**Chart Widget ID:**
- `pie182`: Supplier Wise Booking pie chart

#### 23. Passenger Wise Booking

**Description:**
This metric analyzes booking patterns by passenger count (number of passengers per booking). It helps understand booking composition and group travel patterns.

**Attributes:**
- `passenger_count` (numeric)
  - Number of passengers in the booking (e.g., 1, 2, 3, 4+)
  - Used for grouping bookings by passenger count
- `passenger_bookings` (numeric)
  - Total bookings with the specific passenger count
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `passenger_percentage` (numeric / percentage)
  - Percentage of total bookings with the passenger count
  - Used for pie chart visualization

**Chart Widget ID:**
- `pie184`: Passenger Wise Booking pie chart

#### 24. Trip Wise Booking

**Description:**
This metric categorizes bookings by trip type (e.g., One-Way, Round-Trip, Multi-City). It helps understand travel patterns and booking preferences.

**Attributes:**
- `trip_type` (string)
  - Type of trip (e.g., "One-Way", "Round-Trip", "Multi-City")
  - Used for categorization
- `trip_bookings` (numeric)
  - Total bookings of the trip type
  - Displayed as whole number
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `trip_percentage` (numeric / percentage)
  - Percentage of total bookings of the trip type
  - Used for bar chart visualization

**Chart Widget ID:**
- `bar190`: Trip Wise Booking bar chart

#### 25. Cabin Wise Booking

**Description:**
This metric analyzes booking distribution across different cabin classes (e.g., Economy, Business, First Class). It helps understand customer preferences and revenue distribution by cabin class.

**Attributes:**
- `cabin_class` (string)
  - Cabin class name (e.g., "Economy", "Business", "First Class", "Premium Economy")
  - Used for categorization and grouping
- `cabin_bookings` (numeric)
  - Total bookings in the cabin class
  - Can represent booking count or revenue amount
- `booking_date` (date)
  - The date when the bookings were made
  - Used for time-based filtering
- `cabin_percentage` (numeric / percentage)
  - Percentage of total bookings/revenue in the cabin class
  - Used for bar chart visualization

**Chart Widget ID:**
- `bar193`: Cabin Wise Booking bar chart
- `m_noofmarkers = 5`: Displays top 5 cabin classes

### KPI Calculation Methods

**Percentage Change Calculation:**
All percentage change metrics use year-over-year comparison:
```
percentage_change = ((current_period_value - previous_year_value) / previous_year_value) * 100
```

**Value Formatting:**
- Large numbers (≥ 1 Billion): Formatted as `X.XB` (e.g., `1.5B`)
- Medium numbers (≥ 1 Million): Formatted as `X.XM` (e.g., `2.3M`)
- Small numbers (≥ 1 Thousand): Formatted as `X.XK` (e.g., `5.7K`)
- Very small numbers (< 1 Thousand): Displayed with 1 decimal place

**Currency Formatting:**
- Values prefixed with currency symbol based on market profile:
  - UAE (AED): `AED X.X`
  - India (INR): `INR X.X`
  - Qatar (QAR): `QAR X.X`
  - Saudi Arabia (SAR): `SAR X.X`

**Date Formatting:**
- All dates stored and displayed in `YYYY-MM-DD` format (ISO 8601)
- Date calculations handle month/year boundaries automatically
- Yesterday calculation excludes today's date

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
sdk.setContext('tabSelected', 'financial_overview');
sdk.setContext('homeURL', 'https://example.com');
```

### Widget Management

#### `sdk.getWidget(widgetId)`
Retrieves widget object for property access and manipulation.

**Parameters:**
- `widgetId` (string): Widget ID (e.g., `'bar63'`, `'pie52'`)

**Returns:** Widget object

**Usage:**
```javascript
var chart = sdk.getWidget('bar63');
chart.m_noofmarkers = 5;
chart.draw();
```

#### `sdk.reload(widgetIds)`
Reloads data connections for specified widgets.

**Parameters:**
- `widgetIds` (array): Array of widget/connection IDs

**Usage:**
```javascript
sdk.reload(['C_1', 'C_2', 'C_3']);
sdk.reload(['bar63', 'pie52']);
```

#### `sdk.setValue(widgetId, value)`
Sets text value for label widgets.

**Parameters:**
- `widgetId` (string): Label widget ID
- `value` (string): Text to display

**Usage:**
```javascript
sdk.setValue('label215', 'Gross Booking Value:');
```

### Component Visibility

#### `sdk.showComponent(componentIds)`
Shows individual components.

**Parameters:**
- `componentIds` (array): Array of component IDs

**Usage:**
```javascript
sdk.showComponent(['label7', 'timeline220']);
```

#### `sdk.hideComponent(componentIds)`
Hides individual components.

**Parameters:**
- `componentIds` (array): Array of component IDs

**Usage:**
```javascript
sdk.hideComponent(['label5', 'label9']);
```

#### `sdk.showGroup(groupNames)`
Shows component groups.

**Parameters:**
- `groupNames` (array): Array of group names

**Usage:**
```javascript
sdk.showGroup(['booking_overview', 'charts_viewInsights']);
```

#### `sdk.hideGroup(groupNames)`
Hides component groups.

**Parameters:**
- `groupNames` (array): Array of group names

**Usage:**
```javascript
sdk.hideGroup(['financial_overview', 'booking_trend_insigh']);
```

### Global Variables

#### `sdk.updateGlobalVariable(widgetId, variables, triggerReload)`
Updates global variables stored in a widget.

**Parameters:**
- `widgetId` (string): Widget ID storing global variables (typically `'label253'`)
- `variables` (object): Key-value pairs of variables to update
- `triggerReload` (boolean): Whether to trigger automatic reload

**Usage:**
```javascript
sdk.updateGlobalVariable('label253', {'Value': '2024-01-01', 'Value1': '2024-01-31'}, false);
sdk.updateGlobalVariable('label253', {'Value_BS': 'Bookings'}, false);
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
var divId = sdk.getDivIdFromComponetId('label6');
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

#### `sdk.getDivIdFromComponetId(componentId)`
Gets the DOM element ID for a component.

**Parameters:**
- `componentId` (string): Component ID

**Returns:** DOM element ID string

**Usage:**
```javascript
var divId = sdk.getDivIdFromComponetId('label6');
```

### Export Functions

#### `sdk.excelExport(widgetIds, chartNames, filterParams, reportTitle)`
Exports chart data to Excel format.

**Parameters:**
- `widgetIds` (array): Array of widget IDs to export
- `chartNames` (array): Array of chart display names
- `filterParams` (array): Array of filter parameter arrays (one per chart)
- `reportTitle` (string): Excel file title

**Usage:**
```javascript
sdk.excelExport(
    ['bar248', 'pie52'],
    ['Top 5 Organisation', 'Channel Breakdown'],
    [['startdate', 'enddate', 'marketprofileid'], ['startdate', 'enddate', 'marketprofileid']],
    "Flight Service Report"
);
```

#### `sdk.getWidget(widgetId).setCustomExportPdf(componentIds)`
Exports dashboard components to PDF.

**Parameters:**
- `componentIds` (array): Array of component IDs to include in PDF

**Usage:**
```javascript
sdk.getWidget('svg242').m_scrnshotfilename = "Report Name";
sdk.getWidget('svg242').m_scrnshotorientation = "P";
sdk.getWidget('svg242').setCustomExportPdf([['box239', 'label238', ...]]);
```

### Tour Functionality

#### `sdk.startDashboardTour(config)`
Starts a guided tour of the dashboard.

**Parameters:**
- `config` (object): Tour configuration with `name` and `steps` array

**Usage:**
```javascript
sdk.startDashboardTour({
    name: "Financial Overview Tour",
    steps: [/* step objects */]
});
```

---

## Component & Widget IDs Reference

### Connection IDs (Data Sources)

**Financial Overview:**
- `C_1` to `C_9`: 9 connections for financial metrics and charts

**Booking Overview:**
- `C_10` to `C_19`: First set of booking metric connections
- `C_28`, `C_GS`: Additional booking connections
- `C_30` to `C_34`: Booking chart connections
- `C_63` to `C_70`: Additional booking analysis connections
- **Total**: 25 connections

**Booking Trends:**
- `C_35` to `C_48`: 14 trend chart connections

**View Insights:**
- `C_49`, `C_50`, `C_52`: Financial KPI insights (trend, weekdays, channel)
- `C_53`, `C_54`: Online/Offline insights (timeline, weekdays)
- `C_55`, `C_56`: Domestic/International insights (timeline, weekdays)
- `C_71`, `C_82`, `C_83`, `C_84`: Booking KPI data grid connections

### Chart Widget IDs

**Financial Overview Charts:**
- `bar248`: Top 5 Organisation by Revenue
- `pie52`: Channel Wise Breakdown
- `bar63`: Online v/s Offline
- `bar243`: Domestic v/s International

**Booking Overview Charts:**
- `bar247`: Top 5 Organisation by Booking
- `pie259`: Channel Wise Breakdown
- `bar104`: Online v/s Offline
- `bar110`: Domestic v/s International

**Booking Trends Charts:**
- `funnel160`: Booking Lifecycle
- `bar159`: Booking Patterns by Time Slot
- `timeline162`: Daily Booking Trend
- `timeline240`: Booking Breakdown by Status
- `column175`: Week Day Wise Booking
- `pie174`: LCC v/s GDS
- `timeline178`: Airline Wise Performance
- `pie182`: Supplier Wise Booking
- `pie184`: Pax wise
- `bar190`: Trip Wise Booking
- `bar193`: Cabin Wise Booking
- `bar314`: Additional trend chart
- `pie323`: Trend breakdown pie chart
- `grpcolumn_NR`: Grouped column trend chart

**View Insights Charts:**
- `timeline220`: Main trend line chart (Financial KPI insights)
- `column222`: Weekdays breakdown chart
- `pie253`, `pie254`: Channel breakdown charts
- `timeline202`: Online/Offline timeline chart
- `grpcolumn231`: Online/Offline weekdays breakdown
- `timeline243`: Domestic/International timeline chart
- `grpcolumn232`: Domestic/International weekdays breakdown

### Component Groups

- `financial_overview`: Financial Overview tab content
- `booking_overview`: Booking Overview tab content
- `booking_trend_insigh`: Booking Trends tab content
- `kpiTile_viewInsight`: KPI tile insight buttons
- `charts_viewInsights`: Chart insight modal group
- `kpiTile2_viewInsight`: Booking KPI insight modal group
- `filter`: Filter modal group
- `customDateFilter`: Custom date picker group

### Navigation Components

- `label4`: Financial Overview tab
- `label6`: Booking Overview tab
- `label8`: Booking Trends and Insights tab
- `label5`: Financial Overview specific component
- `label7`: Booking Overview specific component
- `label9`: Booking Trends specific component

### Global Variable Widget

- `label253`: Widget storing global variables (`Value`, `Value1`, `Value3`, `Value4`, `Value_BS`, `Value_SK`)

### Filter Components

- `C_27`: Filter widget container
- `box229`: Filter modal container
- `label_EH`: Label above market profile selector
- `hfilter250`: Market profile dropdown filter
- `label250`: Cancel button label
- `label251`: Apply button label

### Export Components

- `svg242`: PDF export widget
- `svg275`: Export icon (Excel)
- `svg276`: Export icon (PDF)

---

## Dashboard Initialization Script

### Purpose

Executes on page load to authenticate users, configure permissions, set default filters, and initialize dashboard state.

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
Parse User Permissions
    ↓
Configure Default Filters
    ↓
Set Tab Context
    ↓
Show/Hide Components Based on Permissions
    ↓
Reload Dashboard Connections
    ↓
Configure Chart Properties
    ↓
Update Chart Series Names (Delayed)
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

**2. User Authentication**
- Retrieves `dashboard_user` from SDK context
- Extracts `authToken` for API calls
- Makes AJAX request to `getUserInfoByToken` endpoint
- Parses response for user permissions

**3. Default Configuration**
- **Date Range**: Last 30 days (calculated dynamically)
- **Market Profile**: UAE (AED) - default
- **Active Tab**: Financial Overview
- **Global Variables**: Sets `Value` (start date) and `Value1` (end date) in `label253`

**4. Permission-Based Visibility**
- Checks user permissions from API response
- Shows/hides tabs and components accordingly
- Defaults to Financial Overview if no specific permissions

**5. Connection Reloading**
- Financial Overview: `C_1` to `C_9` (9 connections)
- Booking Overview: `C_10` to `C_70` (25 connections)

**6. Chart Configuration**
- Sets marker counts: `bar63.m_noofmarkers = 5`
- Configures pie charts: `pie52.m_mindatalabelpercentage = 0`
- Updates series names after 2-second delay to ensure data loaded

**7. Layout Adjustment**
- Sets dashboard height: `draggablesParentDiv` height to `1260px`

### Error Handling

- AJAX failures logged to console
- Error messages displayed in `#output` element
- Graceful degradation if user info unavailable

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
- **≥ 1 Million**: Divides by 1,000,000 and appends `'M'` (e.g., `2.3M`)
- **≥ 1 Thousand**: Divides by 1,000 and appends `'K'` (e.g., `5.7K`)
- **< 1 Thousand**: Displays with 1 decimal place (e.g., `123.4`)

**Examples:**
- `1500000000` → `"1.5B"`
- `2300000` → `"2.3M"`
- `5700` → `"5.7K"`
- `123.456` → `"123.5"`

### Implementation Logic

**1. Data Extraction:**
```javascript
if((changedItem.attributes.data).length > 0) {
    var val = changedItem.attributes.data[0].gross_booking_value;
    // ... processing
} else {
    var val = '--';  // No data available
}
```

- Checks if data array exists and has elements
- Extracts value from first data item (e.g., `gross_booking_value`)
- Sets `'--'` as fallback if no data available

**2. Market Profile Retrieval:**
```javascript
var mProfile = sdk.getContext('mProfile');

if(mProfile === undefined) {
    mProfile = '1';  // Default to UAE/AED
}
```

- Retrieves market profile from SDK context
- Defaults to `'1'` (UAE/AED) if undefined

**3. Currency-Based Value Formatting:**

**UAE (AED) - `mProfile === '1'`:**
```javascript
valVI = 'AED ' + (parseFloat(val)).toFixed(1);  // Full value with currency
val = 'AED ' + formatValue(val);                 // Abbreviated value with currency
```

**India (INR) - `mProfile === '2'`:**
```javascript
valVI = 'INR ' + (parseFloat(val)).toFixed(1);
val = 'INR ' + formatValue(val);
```

**Qatar (QAR) - `mProfile === '3'`:**
```javascript
valVI = 'QAR ' + (parseFloat(val)).toFixed(1);
val = 'QAR ' + formatValue(val);
```

**Saudi Arabia (SAR) - Default/Other:**
```javascript
valVI = 'SAR ' + (parseFloat(val)).toFixed(1);
val = 'SAR ' + formatValue(val);
```

**4. Value Assignment:**
```javascript
sdk.setValue('label17', val);                              // Sets displayed value (abbreviated)
sdk.setContext('gross_booking_value', valVI);             // Stores full value in context
```

- **`val`**: Abbreviated value with currency (e.g., `"AED 1.5B"`) - displayed in KPI tile
- **`valVI`**: Full value with currency (e.g., `"AED 1500000000.0"`) - stored for View Insights modal

### Value Storage

**Display Value (`val`):**
- Stored in label widget (e.g., `label17`)
- Abbreviated format for readability
- Includes currency prefix

**Context Value (`valVI`):**
- Stored in SDK context as `gross_booking_value`
- Full numeric value with currency
- Used in View Insights modal for detailed display

### KPI Tile Widget IDs

**Financial Overview KPI Tiles:**
- `label17`: Gross Booking Value
- Additional label IDs for other KPI tiles (Total Revenue, Profit Margin, Total Supplier Payment)

**Booking Overview KPI Tiles:**
- Multiple label IDs for 9 KPI tiles (Processed Bookings, Successful Bookings, etc.)

### Data Flow

```
Widget Data Change Event
    ↓
Extract Value from changedItem.attributes.data[0]
    ↓
Check if Data Exists
    ↓
Get Market Profile from Context
    ↓
Format Value Based on Currency
    ↓
Create Abbreviated Display Value (val)
    ↓
Create Full Context Value (valVI)
    ↓
Update Label Widget (sdk.setValue)
    ↓
Store Full Value in Context (sdk.setContext)
```

### Key Features

1. **Automatic Formatting**: Large numbers automatically abbreviated for better readability
2. **Currency Awareness**: Values prefixed with appropriate currency symbol based on market profile
3. **Fallback Handling**: Displays `'--'` when no data available
4. **Dual Storage**: Stores both abbreviated (display) and full (context) values
5. **Market Profile Default**: Defaults to UAE/AED if market profile undefined

### Usage Example

**Input Data:**
```javascript
changedItem.attributes.data[0].gross_booking_value = 1500000000
mProfile = '1'  // UAE/AED
```

**Output:**
- **Display Value**: `"AED 1.5B"` (stored in `label17`)
- **Context Value**: `"AED 1500000000.0"` (stored in `gross_booking_value` context)

**Input Data:**
```javascript
changedItem.attributes.data[0].gross_booking_value = 2300000
mProfile = '2'  // India/INR
```

**Output:**
- **Display Value**: `"INR 2.3M"` (stored in label widget)
- **Context Value**: `"INR 2300000.0"` (stored in context)

### Percentage Change Comparison & Trend Indicator

**Purpose:** Displays year-over-year percentage change with visual trend indicators (sparkline chart and up/down arrows) based on positive or negative change.

**Where to Use:** This code is typically placed in widget event handlers that fire when data changes. Common locations:
- Widget `onDataChange` event handlers
- Connection reload completion callbacks
- Filter application success handlers
- Tab navigation data refresh handlers

**When It Executes:**
- After `sdk.reload()` completes and widget data updates
- When filters are applied and data refreshes
- On initial dashboard load after data connections load
- When switching between tabs that trigger data reloads

**Trigger:** Executes when widget data changes (`changedItem` event), typically after connection reload or filter updates.

**Implementation Logic:**

**1. Percentage Change Extraction:**
```javascript
var val = (changedItem.attributes.data[0].gross_booking_percentage_change) * 1;
sdk.setContext('gross_booking_comp', val);
```

- Extracts percentage change value from data (multiplied by 1 to ensure numeric type)
- Stores raw percentage value in SDK context as `gross_booking_comp`
- Used for comparison calculations and reference

**2. Sparkline Widget Access:**
```javascript
var a = sdk.getWidget('sparkline18');
```

- Retrieves sparkline widget object for trend visualization
- Sparkline displays mini trend chart showing historical data pattern

**3. Positive Change (Growth) Handling:**

**Condition:** `val > 0`

```javascript
var val = val.toFixed(2);
a.m_fillcolor = '#DAF9EC';        // Light green fill
a.m_linecolor = '#1FD286';        // Green line
sdk.setValue('label20', '<span style="color:#1FD286; font-weight:400">'+val+'%</span> vs last Year');
sdk.showComponent(['svg20']);     // Up arrow icon
sdk.hideComponent(['svg19']);     // Down arrow icon
```

**Visual Configuration:**
- **Fill Color**: `#DAF9EC` (light green background)
- **Line Color**: `#1FD286` (green line)
- **Label Color**: `#1FD286` (green text)
- **Icon**: Shows up arrow (`svg20`), hides down arrow (`svg19`)

**Display Format:** `"5.25% vs last Year"` (green text)

**4. Negative Change (Decline) Handling:**

**Condition:** `val <= 0` (else block)

```javascript
var val = val.toFixed(2);
a.m_fillcolor = '#f9dada';         // Light red fill
a.m_linecolor = '#ff0000';        // Red line
sdk.setValue('label20', '<span style="color:#FF0000; font-weight:400">'+val+'%</span> vs last Year');
sdk.hideComponent(['svg20']);     // Up arrow icon
sdk.showComponent(['svg19']);     // Down arrow icon
```

**Visual Configuration:**
- **Fill Color**: `#f9dada` (light red background)
- **Line Color**: `#ff0000` (red line)
- **Label Color**: `#FF0000` (red text)
- **Icon**: Shows down arrow (`svg19`), hides up arrow (`svg20`)

**Display Format:** `"-3.50% vs last Year"` (red text)

**5. Sparkline Reload:**
```javascript
sdk.reloadDataset(['sparkline18']);
```

- Reloads sparkline dataset to update trend visualization
- Ensures sparkline reflects latest data

### Widget IDs Reference

**Trend Components:**
- `sparkline18`: Mini trend chart widget (displays historical trend)
- `label20`: Label displaying percentage change text
- `svg19`: Down arrow icon (red, shown for negative change)
- `svg20`: Up arrow icon (green, shown for positive change)

**Sparkline Properties:**
- `m_fillcolor`: Background fill color of sparkline area
- `m_linecolor`: Color of sparkline trend line

### Visual States

**Positive Change (Growth):**
```
┌─────────────────────┐
│  AED 1.5B      ↑   │  ← Green up arrow
│  +5.25% vs last Year│  ← Green text
│  [Green Sparkline]  │  ← Green trend line
└─────────────────────┘
```

**Negative Change (Decline):**
```
┌─────────────────────┐
│  AED 1.5B      ↓   │  ← Red down arrow
│  -3.50% vs last Year│  ← Red text
│  [Red Sparkline]    │  ← Red trend line
└─────────────────────┘
```

### Data Flow

```
Widget Data Change Event
    ↓
Extract Percentage Change Value
    ↓
Store in Context (gross_booking_comp)
    ↓
Get Sparkline Widget Object
    ↓
Check if Value > 0
    ↓
┌─────────────────┬─────────────────┐
│   Positive      │    Negative     │
│   (Growth)      │    (Decline)    │
├─────────────────┼─────────────────┤
│ Green colors    │ Red colors      │
│ Up arrow (svg20) │ Down arrow (svg19)│
│ Green text      │ Red text        │
└─────────────────┴─────────────────┘
    ↓
Format Percentage (2 decimals)
    ↓
Update Label with HTML Styling
    ↓
Show/Hide Arrow Icons
    ↓
Reload Sparkline Dataset
```

### Key Features

1. **Visual Trend Indicators**: Color-coded sparkline and arrows provide immediate visual feedback
2. **Year-over-Year Comparison**: Compares current period to same period last year
3. **Dynamic Styling**: Colors and icons change based on positive/negative change
4. **Precise Formatting**: Percentage values formatted to 2 decimal places
5. **HTML Styling**: Inline CSS for color and font weight in label text
6. **Context Storage**: Raw percentage value stored for reference

### Usage Examples

**Example 1: Positive Change**
```javascript
// Input
changedItem.attributes.data[0].gross_booking_percentage_change = 5.25

// Output
- Context: gross_booking_comp = 5.25
- Label: "<span style='color:#1FD286; font-weight:400'>5.25%</span> vs last Year"
- Sparkline: Green fill (#DAF9EC), Green line (#1FD286)
- Icon: Up arrow (svg20) visible, Down arrow (svg19) hidden
```

**Example 2: Negative Change**
```javascript
// Input
changedItem.attributes.data[0].gross_booking_percentage_change = -3.50

// Output
- Context: gross_booking_comp = -3.50
- Label: "<span style='color:#FF0000; font-weight:400'>-3.50%</span> vs last Year"
- Sparkline: Red fill (#f9dada), Red line (#ff0000)
- Icon: Down arrow (svg19) visible, Up arrow (svg20) hidden
```

**Example 3: Zero Change**
```javascript
// Input
changedItem.attributes.data[0].gross_booking_percentage_change = 0

// Output
- Treated as negative (else block)
- Label: "<span style='color:#FF0000; font-weight:400'>0.00%</span> vs last Year"
- Sparkline: Red fill and line
- Icon: Down arrow visible
```

### Complete Code Example

**Full Implementation with Comments:**

```javascript
// Extract percentage change value from widget data
// Multiply by 1 to ensure numeric type conversion
var val = (changedItem.attributes.data[0].gross_booking_percentage_change) * 1;

// Store raw percentage value in SDK context for reference
// Context key: 'gross_booking_comp'
sdk.setContext('gross_booking_comp', val);

// Get sparkline widget object to configure visual properties
var a = sdk.getWidget('sparkline18');

// Check if percentage change is positive (growth) or negative/zero (decline)
if (val > 0) {
    // POSITIVE CHANGE - Growth scenario
    // Format percentage to 2 decimal places
    var val = val.toFixed(2);
    
    // Configure sparkline colors for positive trend
    a.m_fillcolor = '#DAF9EC';  // Light green background fill
    a.m_linecolor = '#1FD286';   // Green trend line
    
    // Update label with green styled text
    // HTML span tag applies inline CSS for color and font weight
    sdk.setValue('label20', '<span style="color:#1FD286; font-weight:400">'+val+'%</span> vs last Year');
    
    // Show up arrow icon (green), hide down arrow icon
    sdk.showComponent(['svg20']);   // Up arrow
    sdk.hideComponent(['svg19']);   // Down arrow
    
} else {
    // NEGATIVE CHANGE OR ZERO - Decline scenario
    // Format percentage to 2 decimal places
    var val = val.toFixed(2);
    
    // Configure sparkline colors for negative trend
    a.m_fillcolor = '#f9dada';  // Light red background fill
    a.m_linecolor = '#ff0000';  // Red trend line
    
    // Update label with red styled text
    sdk.setValue('label20', '<span style="color:#FF0000; font-weight:400">'+val+'%</span> vs last Year');
    
    // Show down arrow icon (red), hide up arrow icon
    sdk.hideComponent(['svg20']);  // Up arrow
    sdk.showComponent(['svg19']);  // Down arrow
}

// Reload sparkline dataset to update trend visualization with latest data
sdk.reloadDataset(['sparkline18']);
```

### How to Adapt for Other KPI Tiles

**To use this code for other KPI metrics, replace the following:**

1. **Data Field Name**: Change `gross_booking_percentage_change` to your metric's percentage field
   ```javascript
   // Example: For Total Revenue
   var val = (changedItem.attributes.data[0].total_revenue_percentage_change) * 1;
   ```

2. **Context Key**: Update context key name to match your metric
   ```javascript
   // Example: For Total Revenue
   sdk.setContext('total_revenue_comp', val);
   ```

3. **Widget IDs**: Replace widget IDs with your KPI tile's widget IDs
   ```javascript
   // Example: For Total Revenue KPI tile
   var a = sdk.getWidget('sparkline27');  // Sparkline widget ID
   sdk.setValue('label24', ...);          // Label widget ID
   sdk.showComponent(['svg22']);         // Up arrow icon ID
   sdk.hideComponent(['svg23']);         // Down arrow icon ID
   sdk.reloadDataset(['sparkline27']);   // Sparkline widget ID
   ```

**Widget ID Mapping for Financial Overview KPI Tiles:**

| KPI Metric | Sparkline Widget | Label Widget | Up Arrow | Down Arrow |
|------------|-----------------|--------------|----------|------------|
| Gross Booking Value | `sparkline18` | `label20` | `svg20` | `svg19` |
| Total Revenue | `sparkline27` | `label24` | `svg22` | `svg23` |
| Profit Margin | `sparkline35` | `label32` | `svg31` | `svg30` |
| Total Supplier Payment | `sparkline43` | `label41` | `svg39` | `svg40` |

### Integration Points

**1. Widget Event Handler:**
```javascript
// Example: Widget onDataChange event
widget.onDataChange = function(changedItem) {
    // Place percentage change code here
    var val = (changedItem.attributes.data[0].gross_booking_percentage_change) * 1;
    // ... rest of code
};
```

**2. Connection Reload Callback:**
```javascript
// Example: After reloading connections
sdk.reload(['C_1', 'C_2'], function() {
    // Access widget data and execute percentage change code
    var widget = sdk.getWidget('widgetId');
    var changedItem = { attributes: { data: [/* data */] } };
    // ... execute percentage change code
});
```

**3. Filter Application Handler:**
```javascript
// Example: After applying filters
function applyFilters() {
    sdk.reload(['C_1'], function() {
        // Widget data updated, execute percentage change code
        // ... percentage change code here
    });
}
```

### Common Use Cases

**Use Case 1: Initial Dashboard Load**
- Code executes after dashboard initialization completes
- Data connections load, triggering widget data change events
- Percentage change indicators update automatically

**Use Case 2: Filter Changes**
- User selects new date range or market profile
- Filters applied, connections reloaded
- Widget data changes, percentage change code executes
- Trend indicators update with new comparison values

**Use Case 3: Tab Navigation**
- User switches between Financial Overview, Booking Overview, etc.
- Tab-specific connections reload
- KPI tiles update with new data
- Percentage change indicators refresh

**Use Case 4: Real-time Data Updates**
- Dashboard receives real-time data updates
- Widget data change events fire
- Percentage change code executes automatically
- Visual indicators update without page refresh

### SDK Method: `sdk.reloadDataset()`

**Purpose:** Reloads dataset for specific widgets without reloading entire connection.

**Parameters:**
- `widgetIds` (array): Array of widget IDs to reload datasets for

**Usage:**
```javascript
sdk.reloadDataset(['sparkline18']);
```

**Difference from `sdk.reload()`:**
- `sdk.reload()`: Reloads entire connection (data source)
- `sdk.reloadDataset()`: Reloads only the dataset for visualization widgets (more efficient for chart updates)

---

## Tab Navigation Scripts

### Booking Overview Tab Handler

**Trigger:** Click on `label6` (Booking Overview tab)

**Unique Logic:**
1. **Tab State Management**: Updates all three tab colors (active: `#0083FF`, inactive: `#000000`)
2. **Group Visibility**: Hides `financial_overview` and `booking_trend_insigh`, shows `booking_overview`
3. **Data Type Default**: Sets `Value_BS` to `'Bookings'` (default view)
4. **Component Visibility**: Hides Financial Overview components (`label5`, various SVGs), shows Booking Overview component (`label7`)
5. **Connection Reload**: Reloads 25 Booking Overview connections (`C_10` to `C_70`)
6. **Chart Configuration**: Sets `bar247.m_noofmarkers = 5`, `pie259.m_mindatalabelpercentage = 0`
7. **Layout Height**: Adjusts to `1440px` (taller than Financial Overview)
8. **Chart Series Update**: Updates `pie259` series name to "Bookings" after 1-second delay

**Bug Note:** Chart tab button styling reuses variables `a` and `b` instead of `c` and `d` for Channel Breakdown chart tabs, causing incorrect styling inheritance.

### Booking Trends and Insights Tab Handler

**Trigger:** Click on `label8` (Booking Trends tab)

**Unique Logic:**
1. **Component Visibility**: Hides `label5` and `label7`, shows `label9`
2. **Tab State Management**: Updates tab colors (same pattern as Booking Overview)
3. **Group Visibility**: Hides `financial_overview` and `booking_overview`, shows `booking_trend_insigh`
4. **Data Type Default**: Sets `Value_BS` to `'Bookings'`
5. **Connection Reload**: Reloads 14 Booking Trends connections (`C_35` to `C_48`)
6. **Chart Configuration**: Sets `bar193.m_noofmarkers = 5`, `pie323.m_mindatalabelpercentage = 0`
7. **Layout Height**: Adjusts to `3130px` (tallest layout due to most content)
8. **Chart Series Update**: Updates 11 chart series names to "Bookings" after 2-second delay (longer delay due to more connections)

### Bookings/Sales Tab Handlers (Within Booking Overview)

**Bookings Tab Handler:**
- **Trigger:** Click on Bookings tab within Booking Overview charts
- **Logic**: Sets `Value_BS` to `'Bookings'`, reloads `C_16`, updates chart series name to "Bookings"

**Sales Tab Handler:**
- **Trigger:** Click on Sales tab within Booking Overview charts
- **Logic**: Sets `Value_BS` to `'Sales'`, reloads `C_41`, determines currency from market profile context, updates chart series name with currency suffix (e.g., "Sales (AED)")

**Currency Determination:**
```javascript
var mProfile = sdk.getContext('mProfile');
var currency = 'AED'; // default
if (mProfile === '2') currency = 'INR';
else if (mProfile === '3') currency = 'QAR';
else if (mProfile === '4') currency = 'SAR';
```

---

## View Insights Scripts

### Financial KPI View Insights (Top 4 Tiles)

**Trigger:** Click "View Insights" on Gross Booking Value, Total Revenue, Profit Margin, or Total Supplier Payment tiles

**Unique Logic:**
1. **Modal Display**: Shows `charts_viewInsights` group, hides `svg251`, `svg250`
2. **Dynamic Title**: Sets `label215` to metric name (e.g., "Gross Booking Value:")
3. **Metric Context**: Updates `Value3` in global variables with metric identifier (`'gross_booking'`, `'total_revenue'`, `'profit_margin'`, `'supplier_payment'`)
4. **Time Granularity**: Sets `Value4` to `'Daily'` (default)
5. **Connection Reload**: Reloads `C_49`, `C_50`, `C_52` (trend, weekdays, channel charts)
6. **Tab State**: Chart tab active by default (blue text on white background)
7. **Component Visibility**: Shows `timeline220`, hides `datagrid221`, `svg250`, `svg251`, `label249`
8. **Scroll Behavior**: Smooth scroll to modal
9. **Radio Default**: Sets `radio252` selected index to `'0'` (Daily)
10. **Chart Series Update**: Updates 4 chart series names to metric name after 1-second delay
11. **Layout Height**: Adjusts modal container to `1300px`

**Chart Tab Handler:**
- Shows `timeline220`, hides `datagrid221`
- Updates tab styling (Chart: active, Grid: inactive)

**Grid Tab Handler:**
- Shows `datagrid221`, hides `timeline220`
- Updates tab styling (Grid: active, Chart: inactive)

**Time Granularity Handler:**
- Updates `Value4` in global variables (`'Daily'`, `'Quarterly'`, `'Monthly'`)
- Reloads insight connections (`C_49`, `C_50`, `C_52`)
- Updates chart series names after 1-second delay

### Online/Offline Chart View Insights (Financial Overview)

**Trigger:** Click "View Insights" on Online/Offline chart in Financial Overview

**Unique Logic:**
1. **View Display**: Shows `kpiTile_viewInsight` group
2. **Title**: Sets `label191` to "Online v/s Offline:"
3. **Context**: Sets `insights` context to `'finance_on_off'`
4. **Time Granularity**: Sets `Value4` to `'Daily'`
5. **Component Visibility**: Shows `timeline202`, `grpcolumn231`, `legend345`, hides others
6. **Connection Reload**: Reloads `C_53`, `C_54`
7. **Radio Default**: Sets `radio251` selected index to `'0'`

### Domestic/International Chart View Insights (Financial Overview)

**Trigger:** Click "View Insights" on Domestic/International chart in Financial Overview

**Unique Logic:**
1. **View Display**: Shows `kpiTile_viewInsight` group
2. **Title**: Sets `label191` to "Domestic v/s International:"
3. **Context**: Sets `insights` context to `'finance_int_dom'`
4. **Component Visibility**: Shows `timeline243`, `grpcolumn232`, `legend345`, hides others
5. **Connection Reload**: Reloads `C_55`, `C_56`

### Booking Overview Chart View Insights

**Online/Offline (Booking Overview):**
- Context: `'booking_on_off'`
- Displays booking counts instead of revenue
- Uses `timeline202` and `grpcolumn231`

**Domestic/International (Booking Overview):**
- Context: `'booking_int_dom'`
- Displays booking counts instead of revenue
- Uses `timeline243` and `grpcolumn232`

### Booking Overview KPI View Insights (Top 9 Tiles)

**Trigger:** Click "View Insights" on any of 9 KPI tiles (Processed Bookings, Successful Bookings, etc.)

**Unique Logic:**
1. **Modal Display**: Shows `kpiTile2_viewInsight` group
2. **Dynamic Title**: Sets `label266` to KPI name (e.g., "Processed Bookings:")
3. **Context**: Sets `view_insight_selected` context to KPI identifier (`'processed_bookings'`, `'successful_bookings'`, etc.)
4. **Pagination**: Sets `Value_SK` to `'0'` (first page)
5. **Connection Reload**: Reloads `C_71`, `C_82`, `C_83`, `C_84` (data grid connections)
6. **Component Visibility**: Shows `datagrid273` and `hfilter321` (data grid and header filter)
7. **Layout Height**: Adjusts `box189` height to `1370px`
8. **Scroll Behavior**: Smooth scroll to modal

**KPI Identifiers:**
- `processed_bookings`: Processed Bookings
- `successful_bookings`: Successful Bookings
- `failed_bookings`: Failed Bookings
- `cancelled_bookings`: Cancelled Bookings
- `changed_bookings`: Changed Bookings
- `fraud_failed_booking`: Fraud Failed Booking
- (3 additional KPI identifiers)

---

## Filter Modal Script

**Trigger:** Click on filter icon

**Unique Logic:**
1. **Filter Reload**: Reloads `C_27` filter widget
2. **Modal Display**: Shows `filter` group
3. **Custom Date Check**: Reads `customDateSelected` from SDK context
4. **Conditional Layout**:
   - **If Custom Date Selected**: Shows `customDateFilter` group
   - **If Custom Date NOT Selected**: 
     - Hides `customDateFilter` group
     - Sets `box229` height to `320px` (compact)
     - Repositions components:
       - `label_EH`: `top: 290px`
       - `hfilter250`: `top: 320px`
       - `label250`, `label251`: `top: 380px`
5. **Dashboard Height**: Adjusts `draggablesParentDiv` to `1550px`

**Layout States:**
- **Compact (Predefined Ranges)**: 320px height, custom date inputs hidden
- **Expanded (Custom Date)**: Taller height, custom date inputs visible

### Date Range Selection Logic

**Trigger:** User selects a date range option (`val` parameter: `'1'`, `'7'`, `'30'`, or custom)

**Date Formatting Utility:**
```javascript
function formatDate(date) {
    return date.toLocaleDateString('en-CA'); // Returns "YYYY-MM-DD" format
}
```

**Purpose:** Converts JavaScript Date object to ISO date string format (`YYYY-MM-DD`) required by the dashboard API.

**Date Range Calculations:**

**1. Last 1 Day (`val === '1'`):**
```javascript
var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

var lastDayStart = formatDate(yesterday); // Yesterday's date
var lastDayEnd = formatDate(yesterday);   // Same as start (single day)

sdk.hideGroup(['customDateFilter']);
sdk.setContext('customDateSelected', false);
```

**Logic:**
- Calculates yesterday's date
- Sets both start and end dates to yesterday
- Hides custom date filter group
- Sets `customDateSelected` context to `false`

**2. Last 7 Days (`val === '7'`):**
```javascript
var today = new Date();
var lastDayStart = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
var lastDayEnd = formatDate(yesterday); // Yesterday's date

sdk.hideGroup(['customDateFilter']);
sdk.setContext('customDateSelected', false);
```

**Logic:**
- Calculates date 7 days before today
- End date is yesterday (excludes today)
- Uses `Date` constructor with year, month, and day parameters for accurate date calculation
- Hides custom date filter group

**3. Last 30 Days (`val === '30'`):**
```javascript
var today = new Date();
var lastDayStart = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
var lastDayEnd = formatDate(yesterday); // Yesterday's date

sdk.hideGroup(['customDateFilter']);
sdk.setContext('customDateSelected', false);
```

**Logic:**
- Calculates date 30 days before today
- End date is yesterday (excludes today)
- Handles month boundaries automatically via Date constructor
- Hides custom date filter group

**4. Custom Date (`val` is any other value):**
```javascript
sdk.showGroup(['customDateFilter']);
sdk.setContext('customDateSelected', true);

var today = new Date();
var lastDayStart = formatDate(new Date(today.getFullYear(), 0, 1)); // January 1st of current year
var lastDayEnd = formatDate(today); // Today's date
```

**Logic:**
- Shows custom date filter group (date picker inputs)
- Sets `customDateSelected` context to `true`
- Sets default start date to January 1st of current year
- Sets default end date to today
- User can then manually select custom dates via date picker inputs

**Key Implementation Details:**

1. **Date Calculation Method**: Uses `Date` constructor with explicit year, month, and day parameters to handle month/year boundaries correctly
   - `new Date(year, month, day)`: Month is 0-indexed (0 = January, 11 = December)
   - Automatically handles leap years and month length variations

2. **Yesterday Calculation**: Uses `setDate()` method which automatically adjusts month/year if needed
   ```javascript
   yesterday.setDate(today.getDate() - 1);
   ```

3. **Date Format**: All dates formatted as `YYYY-MM-DD` using `toLocaleDateString('en-CA')` locale
   - This format is ISO 8601 compliant and required by the dashboard API

4. **Context Management**: Updates `customDateSelected` context to control filter modal layout

5. **Group Visibility**: Shows/hides `customDateFilter` group based on selection type

**Date Range Examples:**

- **Last 1 Day**: If today is 2024-12-15, range is `2024-12-14` to `2024-12-14`
- **Last 7 Days**: If today is 2024-12-15, range is `2024-12-08` to `2024-12-14`
- **Last 30 Days**: If today is 2024-12-15, range is `2024-11-15` to `2024-12-14`
- **Custom Date**: Default range is `2024-01-01` to `2024-12-15` (user can modify)

---

## Guided Tour Script

**Trigger:** Click on Guided Tour icon

**Unique Logic:**
1. **Tab Detection**: Reads `tabSelected` from SDK context
2. **Dynamic Configuration**: Builds tour steps based on active tab
3. **Step Structure**: Each step contains:
   - `element`: Component ID to highlight
   - `title`: Step title
   - `content`: Step description
   - `placement`: Popover position (`'top'`, `'bottom'`, `'left'`, `'right'`, `'auto'`)
   - `duration`: Display duration in milliseconds (3000-5000ms)

**Financial Overview Tour:**
- **Steps**: 25 steps covering all Financial Overview components
- **Components**: KPI tiles, charts, navigation, export icons

**Booking Overview Tour:**
- **Steps**: 16 steps covering Booking Overview components
- **Components**: KPI tiles, charts, tab navigation

**Booking Trends Tour:**
- **Steps**: 15 steps covering Booking Trends components
- **Components**: Summary cards, trend charts, analysis charts

**Tour Execution:**
```javascript
sdk.startDashboardTour({
    name: "Tour Name",
    steps: [/* step objects */]
});
```

---

## Export Scripts

### Excel Export

**Trigger:** Click on Excel export icon (`svg275`)

**Unique Logic:**
1. **Tab Detection**: Reads `tabSelected` from SDK context
2. **Chart Selection**: Selects charts based on active tab
3. **Parameter Mapping**: Maps filter parameters for each chart
4. **Export Execution**: Calls `sdk.excelExport()` with tab-specific configuration

**Financial Overview Export:**
- **Charts**: `bar248`, `pie52`, `bar63`, `bar243` (4 charts)
- **Filter Parameters**: All use `['startdate', 'enddate', 'marketprofileid', 'businesstype']`

**Booking Overview Export:**
- **Charts**: `bar247`, `pie259`, `bar104`, `bar110` (4 charts)
- **Filter Parameters**: Same as Financial Overview

**Booking Trends Export:**
- **Charts**: 11 charts (`funnel160`, `bar159`, `timeline162`, etc.)
- **Filter Parameters**: Mix of `'marketprofileid'` and `'marketprofile'` (inconsistency noted)

**Note:** Booking Trends export uses inconsistent parameter naming (`'marketprofile'` vs `'marketprofileid'`). Standardization recommended.

### PDF Export

**Trigger:** Click on PDF export icon (`svg276`)

**Unique Logic:**
1. **Tab Detection**: Reads `tabSelected` from SDK context
2. **Filename Configuration**: Sets `svg242.m_scrnshotfilename` based on tab
3. **Orientation**: Sets `svg242.m_scrnshotorientation` to `"P"` (Portrait)
4. **Loading Message**: Sets `svg242.m_loadermessage` with HTML-formatted message
5. **Component Selection**: Calls `setCustomExportPdf()` with array of 200+ component IDs

**Exported Components:**
- All visible components from active tab
- Navigation elements
- Header elements
- Charts, labels, containers, SVGs

**Export Process:**
- SDK generates PDF snapshot of all specified components
- PDF downloads to user's device
- Loading message displayed during generation

---

## Data Structure & Context Management

### SDK Context Variables

**Tab Management:**
- `tabSelected`: Current active tab (`'financial_overview'`, `'booking_overview'`, `'booking_trend_insigh'`)

**User Information:**
- `dashboard_user`: User object containing `authToken` and permissions
- `homeURL`: Base URL for API calls

**Filter State:**
- `sdt`: Start date (YYYY-MM-DD format)
- `edt`: End date (YYYY-MM-DD format)
- `mProfile`: Market profile ID (`'1'`=UAE/AED, `'2'`=India/INR, `'3'`=Qatar/QAR, `'4'`=Saudi Arabia/SAR)
- `customDateSelected`: Boolean indicating if custom date range is selected

**View Insights:**
- `insights`: Insight type (`'finance_on_off'`, `'finance_int_dom'`, `'booking_on_off'`, `'booking_int_dom'`)
- `view_insight_selected`: Selected KPI identifier for data grid view
- `gross_booking_value`: Current gross booking value (for display)

### Global Variables (stored in `label253`)

**Date Range:**
- `Value`: Start date (YYYY-MM-DD)
- `Value1`: End date (YYYY-MM-DD)

**View Insights:**
- `Value3`: Metric identifier (`'gross_booking'`, `'total_revenue'`, `'profit_margin'`, `'supplier_payment'`)
- `Value4`: Time granularity (`'Daily'`, `'Quarterly'`, `'Monthly'`)

**Booking Status:**
- `Value_BS`: Booking/Sales filter (`'Bookings'`, `'Sales'`)

**Pagination:**
- `Value_SK`: Page number for data grid pagination (typically `'0'` for first page)

### Widget Properties

**Chart Properties:**
- `m_noofmarkers`: Number of markers to display (e.g., `5`)
- `m_mindatalabelpercentage`: Minimum percentage for data labels (e.g., `0`)
- `m_seriesDisplayNames`: Array of series display names
- `m_selectedindex`: Selected index for radio/filter widgets

**Export Properties:**
- `m_scrnshotfilename`: PDF filename
- `m_scrnshotorientation`: PDF orientation (`"P"` for Portrait, `"L"` for Landscape)
- `m_loadermessage`: HTML message displayed during export

---

## Notes

- All currency values default to AED (UAE Dirham) but can be changed via Market Profile
- Percentage changes are calculated year-over-year
- Charts are responsive and adapt to screen size
- Components/Connections are managed through SDK methods
- Data structure can be easily extended for additional metrics
- The initialization script runs automatically on page load
- User permissions determine which tabs are visible

---

**Documentation Version**: 2.0  
**Last Updated**: 2024  
**Author**: Flight Dashboard Development Team
