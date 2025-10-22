# tests/test_sanity.py

"""
Sanity checks and smoke tests for Vaarush project.
Basic tests to ensure environment and dependencies are properly configured.
"""

import unittest
import sys
import os
import importlib


class TestEnvironmentSanity(unittest.TestCase):
    """Sanity tests for environment setup and dependencies."""

    def test_python_version(self):
        """Test that Python version is 3.8 or higher."""
        version = sys.version_info
        self.assertGreaterEqual(version.major, 3)
        self.assertGreaterEqual(version.minor, 8)

    def test_required_packages_importable(self):
        """Test that all required packages can be imported."""
        required_packages = [
            'fastapi',
            'uvicorn',
            'pydantic',
            'algosdk',
            'pytest',
        ]
        
        for package in required_packages:
            with self.subTest(package=package):
                try:
                    importlib.import_module(package)
                except ImportError:
                    self.fail(f"Required package '{package}' is not installed")

    def test_environment_variables(self):
        """Test that critical environment variables are set."""
        # These are optional but good to check
        env_vars = ['ALGORAND_ALGOD_TOKEN', 'ALGORAND_ALGOD_ADDRESS']
        
        for var in env_vars:
            with self.subTest(var=var):
                value = os.getenv(var)
                # Just check if they exist, don't fail if missing
                if value:
                    self.assertIsInstance(value, str)

    def test_project_structure(self):
        """Test that key project directories exist."""
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        
        expected_dirs = ['app', 'tests', 'contracts']
        
        for directory in expected_dirs:
            with self.subTest(directory=directory):
                dir_path = os.path.join(base_dir, directory)
                self.assertTrue(
                    os.path.exists(dir_path),
                    f"Expected directory '{directory}' not found"
                )

    def test_basic_math(self):
        """Sanity test: basic arithmetic works."""
        self.assertEqual(2 + 2, 4)
        self.assertEqual(10 * 5, 50)
        self.assertTrue(True)

    def test_string_operations(self):
        """Sanity test: string operations work."""
        test_str = "Vaarush"
        self.assertEqual(test_str.lower(), "vaarush")
        self.assertEqual(len(test_str), 7)
        self.assertTrue(test_str.startswith("V"))


if __name__ == '__main__':
    unittest.main()

