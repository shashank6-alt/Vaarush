 # tests/test_main.py

"""
Main application tests for Vaarush backend API.
Tests core functionality including API health, contract creation, and retrieval.
"""

import unittest
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app  # Import your FastAPI app


class TestMainAPI(unittest.TestCase):
    """Test suite for main API endpoints."""

    def setUp(self):
        """Set up test client before each test."""
        self.client = app.test_client()
        self.client.testing = True

    def test_health_check(self):
        """Test that health check endpoint returns 200 OK."""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('status', data)
        self.assertEqual(data['status'], 'healthy')

    def test_api_root(self):
        """Test that API root returns welcome message."""
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('message', data)

    def test_create_will_endpoint_exists(self):
        """Test that create will endpoint exists."""
        response = self.client.post('/api/wills/create', json={})
        # Endpoint should exist (not 404), even if request is invalid
        self.assertNotEqual(response.status_code, 404)

    def test_get_contract_status_endpoint(self):
        """Test that contract status endpoint exists."""
        response = self.client.get('/api/wills/12345/status')
        # Endpoint should exist (not 404)
        self.assertNotEqual(response.status_code, 404)

    def test_invalid_endpoint_returns_404(self):
        """Test that invalid endpoints return 404."""
        response = self.client.get('/api/invalid/endpoint')
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
