# SQL Analysis Task Report

## Task Overview
Analyzing sales data for an online store using SQLite database.

## Questions and Answers

### 1. Calculate the total sales volume for March 2024

**Query Used:**
```sql
SELECT SUM(amount) as march_2024_sales
FROM orders
WHERE order_date >= '2024-03-01' AND order_date <= '2024-03-31';
```

**Result:** 27,000

**Breakdown of March Sales:**
- March 1: Alice, 5,000
- March 5: Bob, 8,000
- March 15: Alice, 3,000
- March 22: Charlie, 9,000
- March 30: Alice, 2,000

### 2. Find the customer who spent the most overall

**Query Used:**
```sql
SELECT 
    customer,
    SUM(amount) as total_spent
FROM orders
GROUP BY customer
ORDER BY total_spent DESC
LIMIT 1;
```

**Result:** Alice with total spending of 20,000

**Customer Spending Breakdown:**
1. Alice: 20,000 total
   - March 1: 5,000
   - March 15: 3,000
   - February 28: 10,000
   - March 30: 2,000

2. Charlie: 16,000 total
   - February 20: 7,000
   - March 22: 9,000

3. Bob: 12,000 total
   - March 5: 8,000
   - February 10: 4,000

### 3. Calculate the average order value

**Query Used:**
```sql
SELECT 
    ROUND(AVG(amount), 2) as average_order_value,
    ROUND(SUM(amount) * 1.0 / COUNT(*), 2) as average_order_value_calculated
FROM orders;
```

**Result:** 6,000

**Calculation Details:**
- Total sum of all orders: 48,000
- Number of orders: 8
- Average = 48,000 / 8 = 6,000

## Summary of Findings
1. March 2024 was a strong sales month with 27,000 in total sales
2. Alice is the most valuable customer, accounting for 41.67% of total sales (20,000 out of 48,000)
3. The average order value of 6,000 indicates healthy transaction sizes

## Verification
All results have been verified by:
1. Manual calculations
2. SQL query execution
3. Cross-checking with the original data

The results match exactly with the expected values provided in the task description. 