import unittest
from pyteal import compileTeal, Mode
from contracts.inheritance import inheritance_contract

class TestInheritanceContract(unittest.TestCase):
    def test_compile(self):
        teal = compileTeal(inheritance_contract(), Mode.Application, version=5)
        # Basic sanity checks
        self.assertIn("#pragma version 5", teal)
        self.assertIn("app_global_put", teal)
        self.assertIn("txn ApplicationID", teal)

if __name__ == "__main__":
    unittest.main()
from pyteal import *