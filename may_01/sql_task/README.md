# SQL Sales Analysis

This project contains SQL queries to analyze sales data for an online store.

## Queries Explanation

### 1. Total Sales Volume for March 2024
```sql
SELECT SUM(amount) as march_2024_sales
FROM orders
WHERE order_date >= '2024-03-01' AND order_date <= '2024-03-31';
```
- Uses direct date comparison to find orders in March 2024
- Expected result: 27,000 (sum of all March 2024 orders)
- Orders included: 5000 + 8000 + 3000 + 9000 + 2000

### 2. Customer with Highest Total Spending
```sql
SELECT 
    customer,
    SUM(amount) as total_spent
FROM orders
GROUP BY customer
ORDER BY total_spent DESC
LIMIT 1;
```
- Groups orders by customer and sums their amounts
- Orders by total spent in descending order
- Takes the top spender
- Expected result: Alice with 20,000 (5000 + 3000 + 10000 + 2000)

### 3. Average Order Value
```sql
SELECT 
    ROUND(AVG(amount), 2) as average_order_value,
    ROUND(SUM(amount) * 1.0 / COUNT(*), 2) as average_order_value_calculated
FROM orders;
```
- Calculates average in two ways:
  1. Using AVG() function
  2. Manually by dividing total sum by count of orders
- Expected result: 6,000 (48,000 total / 8 orders)
- Shows both methods to verify the calculation

## How to Run

1. Visit [SQLite Online](https://sqliteonline.com/)
2. Copy and paste the contents of `sales_analysis.sql`
3. Execute each query separately to see the results

## Data Summary

Total Orders: 8
- Alice: 4 orders, total 20,000
- Bob: 2 orders, total 12,000
- Charlie: 2 orders, total 16,000

March 2024 Orders:
- March 1: Alice, 5,000
- March 5: Bob, 8,000
- March 15: Alice, 3,000
- March 22: Charlie, 9,000
- March 30: Alice, 2,000
Total March: 27,000 