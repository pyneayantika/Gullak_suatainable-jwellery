"""
Gullak Backend API Test Suite
Tests all backend endpoints including public catalog, auth, wishlist, cart, orders, and admin CRUD.
"""
import requests
import sys
import os
from datetime import datetime

# Use the public preview URL
BASE_URL = "https://gullak-studio.preview.emergentagent.com/api"

class GullakAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_token = None
        self.customer_session_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def log(self, msg, level="INFO"):
        print(f"[{level}] {msg}")
    
    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, check_fn=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)
        
        self.tests_run += 1
        self.log(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=10)
            
            success = response.status_code == expected_status
            
            if success:
                # Additional validation if check_fn provided
                if check_fn:
                    try:
                        json_data = response.json() if response.text else {}
                        check_result = check_fn(json_data)
                        if not check_result:
                            success = False
                            self.log(f"❌ FAILED - Validation check failed", "ERROR")
                            self.failed_tests.append({"test": name, "reason": "Validation check failed"})
                        else:
                            self.tests_passed += 1
                            self.log(f"✅ PASSED - Status: {response.status_code}", "SUCCESS")
                    except Exception as e:
                        success = False
                        self.log(f"❌ FAILED - Validation error: {str(e)}", "ERROR")
                        self.failed_tests.append({"test": name, "reason": f"Validation error: {str(e)}"})
                else:
                    self.tests_passed += 1
                    self.log(f"✅ PASSED - Status: {response.status_code}", "SUCCESS")
            else:
                self.log(f"❌ FAILED - Expected {expected_status}, got {response.status_code}", "ERROR")
                self.log(f"Response: {response.text[:200]}", "DEBUG")
                self.failed_tests.append({"test": name, "reason": f"Expected {expected_status}, got {response.status_code}"})
            
            return success, response.json() if response.text and response.status_code < 500 else {}
        
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            self.failed_tests.append({"test": name, "reason": str(e)})
            return False, {}
    
    # ========== PUBLIC CATALOG TESTS ==========
    
    def test_home_endpoint(self):
        """Test GET /api/home returns aggregated home content"""
        def check(data):
            required_keys = ['featured_products', 'collections', 'artisans', 'testimonials', 'journal']
            for key in required_keys:
                if key not in data:
                    self.log(f"Missing key: {key}", "ERROR")
                    return False
            # Check collections count (should be 5)
            if len(data.get('collections', [])) != 5:
                self.log(f"Expected 5 collections, got {len(data.get('collections', []))}", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/home - aggregated home content",
            "GET", "home", 200,
            check_fn=check
        )
    
    def test_collections_list(self):
        """Test GET /api/collections returns 5 collections"""
        def check(data):
            if not isinstance(data, list):
                self.log("Response is not a list", "ERROR")
                return False
            if len(data) != 5:
                self.log(f"Expected 5 collections, got {len(data)}", "ERROR")
                return False
            # Check for terracotta collection
            terracotta = next((c for c in data if c.get('slug') == 'terracotta'), None)
            if not terracotta:
                self.log("Terracotta collection not found", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/collections - returns 5 collections",
            "GET", "collections", 200,
            check_fn=check
        )
    
    def test_collection_detail(self):
        """Test GET /api/collections/terracotta returns collection + products"""
        def check(data):
            if 'collection' not in data or 'products' not in data:
                self.log("Missing collection or products key", "ERROR")
                return False
            if len(data.get('products', [])) != 10:
                self.log(f"Expected 10 products, got {len(data.get('products', []))}", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/collections/terracotta - collection + 10 products",
            "GET", "collections/terracotta", 200,
            check_fn=check
        )
    
    def test_products_list(self):
        """Test GET /api/products returns products"""
        def check(data):
            if not isinstance(data, list):
                self.log("Response is not a list", "ERROR")
                return False
            if len(data) == 0:
                self.log("No products returned", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/products - returns products list",
            "GET", "products", 200,
            check_fn=check
        )
    
    def test_product_detail(self):
        """Test GET /api/products/{slug} returns product + artisan + pair_with"""
        def check(data):
            required_keys = ['product', 'artisan', 'pair_with']
            for key in required_keys:
                if key not in data:
                    self.log(f"Missing key: {key}", "ERROR")
                    return False
            return True
        
        # Use a known product slug from seed data
        return self.run_test(
            "GET /api/products/saanjh-terracotta-earrings - product detail",
            "GET", "products/saanjh-terracotta-earrings", 200,
            check_fn=check
        )
    
    def test_journal_list(self):
        """Test GET /api/journal returns 5 seeded posts"""
        def check(data):
            if not isinstance(data, list):
                self.log("Response is not a list", "ERROR")
                return False
            if len(data) != 5:
                self.log(f"Expected 5 journal posts, got {len(data)}", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/journal - returns 5 posts",
            "GET", "journal", 200,
            check_fn=check
        )
    
    def test_journal_detail(self):
        """Test GET /api/journal/{slug} returns article + related"""
        def check(data):
            if 'article' not in data or 'related' not in data:
                self.log("Missing article or related key", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/journal/the-quiet-heritage-of-terracotta - article detail",
            "GET", "journal/the-quiet-heritage-of-terracotta", 200,
            check_fn=check
        )
    
    def test_artisans_list(self):
        """Test GET /api/artisans returns 3 seeded artisans"""
        def check(data):
            if not isinstance(data, list):
                self.log("Response is not a list", "ERROR")
                return False
            if len(data) != 3:
                self.log(f"Expected 3 artisans, got {len(data)}", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/artisans - returns 3 artisans",
            "GET", "artisans", 200,
            check_fn=check
        )
    
    def test_newsletter_signup(self):
        """Test POST /api/newsletter accepts email"""
        test_email = f"test_{datetime.now().timestamp()}@example.com"
        return self.run_test(
            "POST /api/newsletter - accepts email",
            "POST", "newsletter", 200,
            data={"email": test_email}
        )
    
    # ========== ADMIN AUTH TESTS ==========
    
    def test_admin_login(self):
        """Test POST /api/admin/login with correct credentials"""
        success, response = self.run_test(
            "POST /api/admin/login - admin authentication",
            "POST", "admin/login", 200,
            data={"email": "admin@gullak.com", "password": "gullak@admin2025"}
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.log(f"Admin token obtained: {self.admin_token[:20]}...", "INFO")
            return True, response
        return False, {}
    
    def test_admin_me(self):
        """Test GET /api/admin/me with admin token"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        return self.run_test(
            "GET /api/admin/me - admin profile",
            "GET", "admin/me", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    # ========== ADMIN CRUD TESTS ==========
    
    def test_admin_list_products(self):
        """Test GET /api/admin/products"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        return self.run_test(
            "GET /api/admin/products - list all products",
            "GET", "admin/products", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    def test_admin_create_product(self):
        """Test POST /api/admin/products - create product"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        test_product = {
            "name": "Test Terracotta Piece",
            "slug": "test-terracotta-piece",
            "price": 999.0,
            "material": "Terracotta",
            "collection_slug": "terracotta",
            "story": "A test piece for automated testing",
            "images": ["https://via.placeholder.com/400"],
            "featured": False,
            "in_stock": True
        }
        
        success, response = self.run_test(
            "POST /api/admin/products - create test product",
            "POST", "admin/products", 200,
            data=test_product,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success and 'id' in response:
            self.test_product_id = response['id']
            self.log(f"Test product created: {self.test_product_id}", "INFO")
            return True, response
        return False, {}
    
    def test_admin_delete_product(self):
        """Test DELETE /api/admin/products/{id}"""
        if not self.admin_token or not hasattr(self, 'test_product_id'):
            self.log("Skipping - no admin token or test product", "WARN")
            return False, {}
        
        return self.run_test(
            f"DELETE /api/admin/products/{self.test_product_id} - delete test product",
            "DELETE", f"admin/products/{self.test_product_id}", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    def test_admin_list_journal(self):
        """Test GET /api/admin/journal"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        return self.run_test(
            "GET /api/admin/journal - list all journal posts",
            "GET", "admin/journal", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    def test_admin_list_orders(self):
        """Test GET /api/admin/orders"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        return self.run_test(
            "GET /api/admin/orders - list all orders",
            "GET", "admin/orders", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    # ========== HEALTH CHECK ==========
    
    def test_health_endpoint(self):
        """Test GET /api/ returns 200"""
        def check(data):
            if 'service' not in data or 'status' not in data:
                self.log("Missing service or status key", "ERROR")
                return False
            if data.get('status') != 'ok':
                self.log(f"Expected status 'ok', got {data.get('status')}", "ERROR")
                return False
            return True
        
        return self.run_test(
            "GET /api/ - health check",
            "GET", "", 200,
            check_fn=check
        )
    
    # ========== CUSTOMER AUTH TESTS (without token) ==========
    
    def test_auth_me_without_token(self):
        """Test GET /api/auth/me returns 401 without token"""
        return self.run_test(
            "GET /api/auth/me - 401 without token",
            "GET", "auth/me", 401
        )
    
    def test_auth_logout(self):
        """Test POST /api/auth/logout returns 200"""
        return self.run_test(
            "POST /api/auth/logout - 200",
            "POST", "auth/logout", 200
        )
    
    def test_wishlist_requires_auth(self):
        """Test GET /api/wishlist returns 401 without token"""
        return self.run_test(
            "GET /api/wishlist - 401 without auth",
            "GET", "wishlist", 401
        )
    
    def test_cart_requires_auth(self):
        """Test GET /api/cart returns 401 without token"""
        return self.run_test(
            "GET /api/cart - 401 without auth",
            "GET", "cart", 401
        )
    
    def test_orders_me_requires_auth(self):
        """Test GET /api/orders/me returns 401 without token"""
        return self.run_test(
            "GET /api/orders/me - 401 without auth",
            "GET", "orders/me", 401
        )
    
    # ========== IMAGE UPLOAD TESTS ==========
    
    def test_upload_requires_admin_auth(self):
        """Test POST /api/admin/upload returns 401 without admin token"""
        return self.run_test(
            "POST /api/admin/upload - 401 without admin auth",
            "POST", "admin/upload", 401
        )
    
    def test_upload_valid_image(self):
        """Test POST /api/admin/upload with valid image file"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        # Create a minimal 1x1 PNG image
        import io
        from PIL import Image
        img = Image.new('RGB', (1, 1), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        url = f"{self.base_url}/admin/upload"
        files = {'file': ('test.png', img_bytes, 'image/png')}
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        self.tests_run += 1
        self.log(f"\n🔍 Test {self.tests_run}: POST /api/admin/upload - valid image")
        
        try:
            response = requests.post(url, files=files, headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if 'url' in data and 'filename' in data and 'size' in data:
                    self.uploaded_filename = data['filename']
                    self.tests_passed += 1
                    self.log(f"✅ PASSED - Image uploaded: {data['filename']}", "SUCCESS")
                    return True, data
                else:
                    self.log(f"❌ FAILED - Missing required fields in response", "ERROR")
                    self.failed_tests.append({"test": "Upload valid image", "reason": "Missing url/filename/size"})
                    return False, {}
            else:
                self.log(f"❌ FAILED - Expected 200, got {response.status_code}", "ERROR")
                self.log(f"Response: {response.text[:200]}", "DEBUG")
                self.failed_tests.append({"test": "Upload valid image", "reason": f"Expected 200, got {response.status_code}"})
                return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            self.failed_tests.append({"test": "Upload valid image", "reason": str(e)})
            return False, {}
    
    def test_serve_uploaded_file(self):
        """Test GET /api/uploads/<filename> serves the uploaded file"""
        if not hasattr(self, 'uploaded_filename'):
            self.log("Skipping - no uploaded file", "WARN")
            return False, {}
        
        url = f"{self.base_url}/uploads/{self.uploaded_filename}"
        self.tests_run += 1
        self.log(f"\n🔍 Test {self.tests_run}: GET /api/uploads/{self.uploaded_filename}")
        
        try:
            response = requests.get(url, timeout=10)
            success = response.status_code == 200 and 'image' in response.headers.get('content-type', '')
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - File served correctly", "SUCCESS")
                return True, {}
            else:
                self.log(f"❌ FAILED - Expected 200 with image content-type, got {response.status_code}", "ERROR")
                self.failed_tests.append({"test": "Serve uploaded file", "reason": f"Status {response.status_code}"})
                return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            self.failed_tests.append({"test": "Serve uploaded file", "reason": str(e)})
            return False, {}
    
    def test_upload_rejects_non_image(self):
        """Test POST /api/admin/upload rejects non-image files"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        url = f"{self.base_url}/admin/upload"
        files = {'file': ('test.txt', b'This is not an image', 'text/plain')}
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        self.tests_run += 1
        self.log(f"\n🔍 Test {self.tests_run}: POST /api/admin/upload - reject non-image")
        
        try:
            response = requests.post(url, files=files, headers=headers, timeout=10)
            success = response.status_code == 400
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - Non-image rejected with 400", "SUCCESS")
                return True, {}
            else:
                self.log(f"❌ FAILED - Expected 400, got {response.status_code}", "ERROR")
                self.failed_tests.append({"test": "Reject non-image", "reason": f"Expected 400, got {response.status_code}"})
                return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            self.failed_tests.append({"test": "Reject non-image", "reason": str(e)})
            return False, {}
    
    def test_upload_rejects_invalid_image(self):
        """Test POST /api/admin/upload rejects invalid image data"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        url = f"{self.base_url}/admin/upload"
        files = {'file': ('fake.png', b'Not a real PNG file', 'image/png')}
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        self.tests_run += 1
        self.log(f"\n🔍 Test {self.tests_run}: POST /api/admin/upload - reject invalid image")
        
        try:
            response = requests.post(url, files=files, headers=headers, timeout=10)
            success = response.status_code == 400
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - Invalid image rejected with 400", "SUCCESS")
                return True, {}
            else:
                self.log(f"❌ FAILED - Expected 400, got {response.status_code}", "ERROR")
                self.failed_tests.append({"test": "Reject invalid image", "reason": f"Expected 400, got {response.status_code}"})
                return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            self.failed_tests.append({"test": "Reject invalid image", "reason": str(e)})
            return False, {}
    
    def test_serve_nonexistent_file(self):
        """Test GET /api/uploads/<nonexistent> returns 404"""
        return self.run_test(
            "GET /api/uploads/nonexistent.jpg - 404",
            "GET", "uploads/nonexistent.jpg", 404
        )
    
    def test_path_traversal_protection(self):
        """Test GET /api/uploads with path traversal attempt"""
        return self.run_test(
            "GET /api/uploads/..%2Fetc%2Fpasswd - path traversal blocked",
            "GET", "uploads/..%2Fetc%2Fpasswd", 400
        )
    
    # ========== NOTIFICATION TESTS ==========
    
    def test_notify_signup_valid(self):
        """Test POST /api/collections/{slug}/notify with valid email"""
        test_email = f"notify_test_{int(datetime.now().timestamp())}@example.com"
        
        def check(data):
            if not data.get('ok'):
                self.log("Response ok field is not True", "ERROR")
                return False
            if 'message' not in data:
                self.log("Missing message field", "ERROR")
                return False
            return True
        
        success, response = self.run_test(
            "POST /api/collections/wood/notify - valid email signup",
            "POST", "collections/wood/notify", 200,
            data={"email": test_email},
            check_fn=check
        )
        
        if success:
            self.test_notify_email = test_email
        return success, response
    
    def test_notify_signup_duplicate(self):
        """Test POST /api/collections/{slug}/notify with duplicate email"""
        if not hasattr(self, 'test_notify_email'):
            self.log("Skipping - no test email", "WARN")
            return False, {}
        
        def check(data):
            if not data.get('ok'):
                self.log("Response ok field is not True", "ERROR")
                return False
            if not data.get('already'):
                self.log("Expected 'already' field to be True for duplicate", "ERROR")
                return False
            return True
        
        return self.run_test(
            "POST /api/collections/wood/notify - duplicate email",
            "POST", "collections/wood/notify", 200,
            data={"email": self.test_notify_email},
            check_fn=check
        )
    
    def test_notify_invalid_slug(self):
        """Test POST /api/collections/unknown-slug/notify returns 404"""
        return self.run_test(
            "POST /api/collections/unknown-slug/notify - 404",
            "POST", "collections/unknown-slug/notify", 404,
            data={"email": "test@example.com"}
        )
    
    def test_notify_invalid_email(self):
        """Test POST /api/collections/{slug}/notify with invalid email"""
        return self.run_test(
            "POST /api/collections/wood/notify - invalid email",
            "POST", "collections/wood/notify", 400,
            data={"email": "not-an-email"}
        )
    
    def test_admin_notifications_requires_auth(self):
        """Test GET /api/admin/notifications requires admin auth"""
        return self.run_test(
            "GET /api/admin/notifications - 401 without admin auth",
            "GET", "admin/notifications", 401
        )
    
    def test_admin_list_notifications(self):
        """Test GET /api/admin/notifications returns list"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "WARN")
            return False, {}
        
        def check(data):
            if not isinstance(data, list):
                self.log("Response is not a list", "ERROR")
                return False
            # Should have at least our test signup
            if len(data) == 0:
                self.log("Expected at least 1 notification", "ERROR")
                return False
            # Store first notification ID for delete test
            if len(data) > 0:
                self.test_notification_id = data[0].get('id')
            return True
        
        return self.run_test(
            "GET /api/admin/notifications - list notifications",
            "GET", "admin/notifications", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"},
            check_fn=check
        )
    
    def test_admin_delete_notification(self):
        """Test DELETE /api/admin/notifications/{nid}"""
        if not self.admin_token or not hasattr(self, 'test_notification_id'):
            self.log("Skipping - no admin token or notification ID", "WARN")
            return False, {}
        
        return self.run_test(
            f"DELETE /api/admin/notifications/{self.test_notification_id}",
            "DELETE", f"admin/notifications/{self.test_notification_id}", 200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
    
    # ========== SUMMARY ==========
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, fail in enumerate(self.failed_tests, 1):
                print(f"  {i}. {fail['test']}")
                print(f"     Reason: {fail['reason']}")
        
        print("="*60)
        return 0 if len(self.failed_tests) == 0 else 1

def main():
    print("="*60)
    print("🧪 Gullak Backend API Test Suite")
    print(f"Testing: {BASE_URL}")
    print("="*60)
    
    tester = GullakAPITester()
    
    # Run all tests in order
    print("\n🏥 HEALTH CHECK")
    print("-"*60)
    tester.test_health_endpoint()
    
    print("\n📦 PUBLIC CATALOG TESTS")
    print("-"*60)
    tester.test_home_endpoint()
    tester.test_collections_list()
    tester.test_collection_detail()
    tester.test_products_list()
    tester.test_product_detail()
    tester.test_journal_list()
    tester.test_journal_detail()
    tester.test_artisans_list()
    tester.test_newsletter_signup()
    
    print("\n🔐 ADMIN AUTH TESTS")
    print("-"*60)
    tester.test_admin_login()
    tester.test_admin_me()
    
    print("\n⚙️  ADMIN CRUD TESTS")
    print("-"*60)
    tester.test_admin_list_products()
    tester.test_admin_create_product()
    tester.test_admin_delete_product()
    tester.test_admin_list_journal()
    tester.test_admin_list_orders()
    
    print("\n🔒 CUSTOMER AUTH TESTS (without token)")
    print("-"*60)
    tester.test_auth_me_without_token()
    tester.test_auth_logout()
    tester.test_wishlist_requires_auth()
    tester.test_cart_requires_auth()
    tester.test_orders_me_requires_auth()
    
    print("\n📤 IMAGE UPLOAD TESTS")
    print("-"*60)
    tester.test_upload_requires_admin_auth()
    tester.test_upload_valid_image()
    tester.test_serve_uploaded_file()
    tester.test_upload_rejects_non_image()
    tester.test_upload_rejects_invalid_image()
    tester.test_serve_nonexistent_file()
    tester.test_path_traversal_protection()
    
    print("\n🔔 NOTIFICATION TESTS")
    print("-"*60)
    tester.test_notify_signup_valid()
    tester.test_notify_signup_duplicate()
    tester.test_notify_invalid_slug()
    tester.test_notify_invalid_email()
    tester.test_admin_notifications_requires_auth()
    tester.test_admin_list_notifications()
    tester.test_admin_delete_notification()
    
    # Print summary and exit
    return tester.print_summary()

if __name__ == "__main__":
    sys.exit(main())
