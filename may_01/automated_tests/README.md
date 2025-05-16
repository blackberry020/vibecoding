# API Testing - Product Data Validation

This project contains automated tests to validate product data from the Fake Store API (https://fakestoreapi.com/products).

## Test Objectives

The tests verify the following:
1. Server response code (expected 200)
2. Product attributes validation:
   - Title must not be empty
   - Price must not be negative
   - Rating must not exceed 5
3. Generation of a defect report for any products that fail validation

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Tests

To run all tests:
```bash
pytest test_product_api.py -v
```

To generate an HTML report:
```bash
pytest test_product_api.py --html=report.html
```

## Test Cases

1. `test_server_response_code`: Verifies that the API endpoint returns a 200 status code
2. `test_product_title_not_empty`: Checks that no products have empty titles
3. `test_product_price_not_negative`: Ensures all product prices are non-negative
4. `test_rating_not_exceeding_five`: Validates that no product ratings exceed 5
5. `test_generate_defect_report`: Generates a comprehensive report of all defects found

## Output

The tests will output detailed information about any defects found in the product data, including:
- Products with empty titles
- Products with negative prices
- Products with invalid ratings (> 5) 