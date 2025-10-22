# tests/test_ping.py

"""
Network and connectivity tests for Vaarush backend.
Tests basic connectivity, latency, and external service availability.
"""

import unittest
import requests
import time


class TestNetworkConnectivity(unittest.TestCase):
    """Test suite for network and connectivity checks."""

    def test_localhost_ping(self):
        """Test that localhost is reachable."""
        try:
            response = requests.get('http://localhost:8000/api/health', timeout=5)
            self.assertEqual(response.status_code, 200)
        except requests.exceptions.ConnectionError:
            self.skipTest("Backend server not running on localhost:8000")

    def test_algorand_testnet_connectivity(self):
        """Test connectivity to Algorand TestNet API."""
        try:
            response = requests.get(
                'https://testnet-api.algonode.cloud/v2/status',
                timeout=10
            )
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn('last-round', data)
        except requests.exceptions.RequestException as e:
            self.fail(f"Failed to connect to Algorand TestNet: {e}")

    def test_response_time(self):
        """Test that API responds within acceptable time."""
        start_time = time.time()
        try:
            response = requests.get('http://localhost:8000/api/health', timeout=5)
            elapsed = time.time() - start_time
            self.assertLess(elapsed, 2.0, "API response time exceeds 2 seconds")
            self.assertEqual(response.status_code, 200)
        except requests.exceptions.ConnectionError:
            self.skipTest("Backend server not running")

    def test_cors_headers(self):
        """Test that CORS headers are properly configured."""
        try:
            response = requests.options('http://localhost:8000/api/health')
            self.assertIn('Access-Control-Allow-Origin', response.headers)
        except requests.exceptions.ConnectionError:
            self.skipTest("Backend server not running")


if __name__ == '__main__':
    unittest.main()
