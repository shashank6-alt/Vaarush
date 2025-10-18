# tests/test_sanity.py
import unittest

class TestSanity(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(2 + 2, 4)

if __name__ == '__main__':
    unittest.main()
