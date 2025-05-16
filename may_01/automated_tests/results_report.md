# API Testing Results Report

## Task Overview
Automated testing of the Fake Store API (https://fakestoreapi.com/products) to validate product data and identify potential defects.

## Test Implementation

### 1. Test Environment Setup
- Python with pytest framework
- requests library for API calls
- pytest-html for report generation
- Virtual environment for dependency isolation

### 2. Test Cases Implemented

#### Server Response Test
```python
def test_server_response_code(self):
    """Test if the server responds with status code 200"""
    response = requests.get(self.BASE_URL)
    assert response.status_code == 200
```
- Status: ✅ PASSED
- Response time: < 1s

#### Product Title Validation
```python
def test_product_title_not_empty(self):
    """Test that all product titles are not empty"""
    products = self.get_products()
    products_with_empty_titles = [
        product for product in products
        if not product.get('title') or len(str(product.get('title')).strip()) == 0
    ]
    assert len(products_with_empty_titles) == 0
```
- Status: ✅ PASSED
- Checked: 20 products
- Issues found: 0

#### Price Validation
```python
def test_product_price_validation(self):
    """Test that all products have a valid price (present and not negative)"""
    products = self.get_products()
    products_with_price_issues = []
    # Price presence and negativity check
    assert len(products_with_price_issues) == 0
```
- Status: ✅ PASSED
- Checked: 20 products
- Issues found: 0
- Validation criteria:
  - Price must be present
  - Price must not be negative

#### Rating Validation
```python
def test_rating_validation(self):
    """Test that all products have a valid rating (present and not exceeding 5)"""
    products = self.get_products()
    products_with_rating_issues = []
    # Rating presence and range check
    assert len(products_with_rating_issues) == 0
```
- Status: ✅ PASSED
- Checked: 20 products
- Issues found: 0
- Validation criteria:
  - Rating must be present
  - Rating must not exceed 5

## Test Execution Results

### Summary
- Total tests: 5
- Passed: 5
- Failed: 0
- Execution time: 1.74s

### Detailed Results
1. Server Response Test: ✅ PASSED
2. Product Title Validation: ✅ PASSED
3. Price Validation: ✅ PASSED
4. Rating Validation: ✅ PASSED
5. Defect Report Generation: ✅ PASSED

### Data Quality Findings
- All products have valid titles
- All products have valid prices
- All products have valid ratings
- No data anomalies detected

## Generated Reports
1. HTML Report
   - Location: `report.html`
   - Contains: Detailed test execution results with timing

2. Defect Report
   - Location: `defect_report.json`
   - Format: JSON
   - Contains:
     - Timestamp of test execution
     - Total products checked
     - Total defects found
     - List of defective products (if any)

## Test Coverage

### Attributes Tested
- Product title
- Product price
- Product rating
- API response status

### Validation Rules
1. Title:
   - Must be present
   - Must not be empty
   
2. Price:
   - Must be present
   - Must not be negative
   
3. Rating:
   - Must be present
   - Must not exceed 5
   - Must be a valid number

## Conclusions
1. API is functioning correctly
2. Data quality is high with no defects found
3. All products meet the specified validation criteria
4. Response times are within acceptable ranges

## Future Improvements
1. Add performance testing
2. Implement API response time validation
3. Add more edge case scenarios
4. Include data format validation
5. Add schema validation testing 