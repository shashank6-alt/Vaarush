import unittest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime, timedelta

class TestCreateWill(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_create_will_with_past_release_time(self):
        """Test creating a will with a release time in the past fails."""
        past_timestamp = int((datetime.now() - timedelta(days=1)).timestamp())

        payload = {
            "owner_address": "RQZKSEABBV5Z34J4G7V4ED53NP54Y524S362L6Z55V34A235P67IHII",
            "asset_id": 12345,
            "release_time": past_timestamp,
            "heirs": [{"address": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "share": 100}]
        }

        response = self.client.post("/create-will", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Release time must be in the future", response.json()["detail"])
