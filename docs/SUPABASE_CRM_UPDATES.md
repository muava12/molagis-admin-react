# Supabase CRM Updates Documentation

## Overview
This document details the recent Supabase database updates implemented to enhance CRM functionality, specifically focusing on customer last order date tracking and CRM analytics capabilities.

## Changes Made

### 1. New View: `customer_last_order`
Created a view to efficiently retrieve the last order date for each customer without modifying the main customers table.

**View Definition:**
```sql
CREATE OR REPLACE VIEW customer_last_order AS 
SELECT 
    c.id as customer_id, 
    c.nama as customer_name, 
    c.alamat as customer_address, 
    c.telepon as customer_phone, 
    c.date_created as customer_since, 
    MAX(o.tanggal_pesan) as last_order_date 
FROM customers c 
LEFT JOIN orders o ON c.id = o.customer_id AND o.is_deleted = false 
GROUP BY c.id, c.nama, c.alamat, c.telepon, c.date_created 
ORDER BY c.id
```

**Purpose:**
- Provides real-time last order date information
- Maintains data integrity without altering main tables
- Efficient querying for CRM analytics

### 2. New RPC Functions

#### Function: `get_customers_with_last_order`
Retrieves customer list with last order date information, supporting search functionality.

**Function Definition:**
```sql
CREATE OR REPLACE FUNCTION get_customers_with_last_order(search_term TEXT DEFAULT '') 
RETURNS TABLE(
    id INTEGER, 
    nama TEXT, 
    alamat TEXT, 
    telepon TEXT, 
    telepon_alt TEXT, 
    telepon_pemesan TEXT, 
    maps TEXT, 
    ongkir NUMERIC, 
    date_created DATE, 
    last_order_date DATE
)
```

#### Function: `get_customer_crm_stats`
Provides CRM statistics overview.

**Function Definition:**
```sql
CREATE OR REPLACE FUNCTION get_customer_crm_stats() 
RETURNS TABLE(
    total_customers BIGINT, 
    active_customers BIGINT, 
    inactive_customers BIGINT, 
    new_customers_last_30_days BIGINT
)
```

#### Function: `get_customers_by_activity`
Retrieves customers filtered by activity status (active/inactive/all).

**Function Definition:**
```sql
CREATE OR REPLACE FUNCTION get_customers_by_activity(
    activity_status TEXT DEFAULT 'all', 
    search_term TEXT DEFAULT ''
) 
RETURNS TABLE(
    id INTEGER, 
    nama TEXT, 
    alamat TEXT, 
    telepon TEXT, 
    last_order_date DATE, 
    days_since_last_order INTEGER
)
```

## Benefits of This Approach

### Why Views Over Table Columns?
1. **No Schema Modification**: Preserves existing table structure
2. **Real-time Data**: Always up-to-date with order changes
3. **Performance**: Computed only when needed
4. **Flexibility**: Easy to modify without affecting core data
5. **No Triggers Required**: No complex maintenance logic needed

### CRM Analytics Capabilities
- Active customers: Last order within 90 days
- Inactive customers: Last order older than 90 days or no orders
- New customers: Created within last 30 days
- Days since last order tracking

## Implementation Notes

### Active/Inactive Customer Definition
- **Active**: Last order date within 90 days OR no orders (new customers)
- **Inactive**: Last order date older than 90 days
- **New**: Customer created within last 30 days

### Search Functionality
All functions support full-text search across:
- Customer name
- Customer address
- Customer phone number

## Revert Instructions

If you need to revert these changes, follow these steps in order:

### 1. Drop RPC Functions
```sql
DROP FUNCTION IF EXISTS get_customers_by_activity(TEXT, TEXT);
DROP FUNCTION IF EXISTS get_customer_crm_stats();
DROP FUNCTION IF EXISTS get_customers_with_last_order(TEXT);
```

### 2. Drop View
```sql
DROP VIEW IF EXISTS customer_last_order;
```

### 3. Verify Cleanup
```sql
-- Check that functions are removed
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_schema = 'public'
AND routine_name IN ('get_customers_by_activity', 'get_customer_crm_stats', 'get_customers_with_last_order');

-- Check that view is removed
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'customer_last_order';
```

## Testing Verification

### View Testing
```sql
SELECT * FROM customer_last_order LIMIT 10;
```

### Function Testing
```sql
-- Test customer search with last order
SELECT * FROM get_customers_with_last_order('Dewi') LIMIT 5;

-- Test CRM statistics
SELECT * FROM get_customer_crm_stats();

-- Test activity filtering
SELECT * FROM get_customers_by_activity('inactive', '') LIMIT 5;
```

## Performance Considerations

### Indexes (if needed for optimization)
```sql
-- Consider adding indexes if performance becomes an issue
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_tanggal_pesan ON orders(tanggal_pesan);
CREATE INDEX IF NOT EXISTS idx_customers_nama ON customers(nama);
```

## Integration with Frontend

### Expected Data Structure
The functions return data structures compatible with existing frontend components:
- Customer data with all existing fields plus `last_order_date`
- CRM statistics with clear metric definitions
- Activity-based filtering for customer segmentation

### Usage Examples
1. **Customer List Page**: Use `get_customers_with_last_order` for enhanced customer listing
2. **CRM Dashboard**: Use `get_customer_crm_stats` for overview metrics
3. **Customer Segmentation**: Use `get_customers_by_activity` for targeted campaigns

## Future Enhancements

### Potential Improvements
1. Add customer lifetime value calculations
2. Implement customer tier classification
3. Add automated customer tagging based on activity
4. Create scheduled reports using these functions

### Monitoring
Regular monitoring of:
- Function performance
- View query times
- Data accuracy verification

---

*Document created: August 3, 2025*
*Author: AI Assistant*