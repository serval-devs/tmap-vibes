import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app   # noqa: E402


class FlaskAppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "healthy"})

    def test_missing_json(self):
        response = self.app.post('/api/v1/articles', data="Not JSON")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["error"], "Request must be JSON")
        self.assertEqual(response.headers.get("Error-Type"), "InvalidFormat")

    def test_missing_content_field(self):
        response = self.app.post('/api/v1/articles',
                                 json={"title": "Fake News"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing content", response.json["error"])
        self.assertEqual(response.headers.get("Error-Type"), "MissingField")

    def test_content_too_short(self):
        response = self.app.post('/api/v1/articles',
                                 json={"content": "Too short"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.headers.get("Error-Type"), "InvalidType")

    def test_valid_request(self):
        valid_content = "This is a sufficiently long content."
        response = self.app.post('/api/v1/articles',
                                 json={"content": valid_content})
        self.assertEqual(response.status_code, 200)
        self.assertIn("isReal", response.json)
        self.assertIn("confidence", response.json)
        self.assertTrue(0 <= response.json["confidence"] <= 50)


if __name__ == '__main__':
    unittest.main()
