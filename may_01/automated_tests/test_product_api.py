import requests
import pytest
import json
from typing import List, Dict, Any
from datetime import datetime

class TestProductAPI:
    BASE_URL = "https://fakestoreapi.com/products"
    
    def get_products(self) -> List[Dict[Any, Any]]:
        """Fetch products from the API"""
        response = requests.get(self.BASE_URL)
        return response.json()
    
    def test_server_response_code(self):
        """Test if the server responds with status code 200"""
        response = requests.get(self.BASE_URL)
        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    
    def test_product_title_not_empty(self):
        """Test that all product titles are not empty"""
        products = self.get_products()
        products_with_empty_titles = [
            product for product in products
            if not product.get('title') or len(str(product.get('title')).strip()) == 0
        ]
        
        assert len(products_with_empty_titles) == 0, (
            f"Found {len(products_with_empty_titles)} products with empty titles: "
            f"{[p.get('id') for p in products_with_empty_titles]}"
        )
    
    def test_product_price_validation(self):
        """Test that all products have a valid price (present and not negative)"""
        products = self.get_products()
        products_with_price_issues = []
        
        for product in products:
            product_id = product.get('id', 'Unknown ID')
            price = product.get('price')
            
            if price is None:
                products_with_price_issues.append({
                    'id': product_id,
                    'issue': 'Missing price',
                    'price': None
                })
            elif price < 0:
                products_with_price_issues.append({
                    'id': product_id,
                    'issue': 'Negative price',
                    'price': price
                })
        
        assert len(products_with_price_issues) == 0, (
            f"Found {len(products_with_price_issues)} products with price issues:\n"
            f"{products_with_price_issues}"
        )
    
    def test_rating_validation(self):
        """Test that all products have a valid rating (present and not exceeding 5)"""
        products = self.get_products()
        products_with_rating_issues = []
        
        for product in products:
            product_id = product.get('id', 'Unknown ID')
            rating_obj = product.get('rating')
            
            if not rating_obj:
                products_with_rating_issues.append({
                    'id': product_id,
                    'issue': 'Missing rating object',
                    'rating': None
                })
                continue
                
            rate = rating_obj.get('rate')
            if rate is None:
                products_with_rating_issues.append({
                    'id': product_id,
                    'issue': 'Missing rating.rate',
                    'rating': rating_obj
                })
            elif rate > 5:
                products_with_rating_issues.append({
                    'id': product_id,
                    'issue': 'Rating exceeds 5',
                    'rating': rate
                })
        
        assert len(products_with_rating_issues) == 0, (
            f"Found {len(products_with_rating_issues)} products with rating issues:\n"
            f"{products_with_rating_issues}"
        )
    
    def test_generate_defect_report(self):
        """Generate a comprehensive report of all defects found and save to file"""
        products = self.get_products()
        defects = []
        
        for product in products:
            product_defects = []
            product_id = product.get('id', 'Unknown ID')
            
            # Check title
            if not product.get('title') or len(str(product.get('title')).strip()) == 0:
                product_defects.append("Empty title")
            
            # Check price
            price = product.get('price')
            if price is None:
                product_defects.append("Missing price")
            elif price < 0:
                product_defects.append(f"Negative price: {price}")
            
            # Check rating
            rating_obj = product.get('rating')
            if not rating_obj:
                product_defects.append("Missing rating object")
            else:
                rate = rating_obj.get('rate')
                if rate is None:
                    product_defects.append("Missing rating.rate")
                elif rate > 5:
                    product_defects.append(f"Invalid rating: {rate}")
            
            if product_defects:
                defects.append({
                    'id': product_id,
                    'product_data': product,
                    'defects': product_defects
                })
        
        # Create the report with metadata
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_products_checked': len(products),
            'total_defects_found': len(defects),
            'defective_products': defects if defects else [],
            'summary': 'No defects found' if not defects else f'Found {len(defects)} products with defects'
        }
        
        # Save the report to a file
        with open('defect_report.json', 'w') as f:
            json.dump(report, f, indent=2)
            
        # Also print the report summary
        assert True, f"\nDefect Report Summary:\n- Total products checked: {len(products)}\n- Total defects found: {len(defects)}\n- Report saved to defect_report.json" 