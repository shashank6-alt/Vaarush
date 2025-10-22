# contracts/test_inheritance.py

"""
Unit tests for the inheritance smart contract.
Tests compilation and basic contract structure.
"""

import unittest
import sys
import os
from pyteal import compileTeal, Mode

# Add contracts directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Import contract from CONTRACT.py
from CONTRACT import approval_program, clear_state_program


class TestInheritanceContract(unittest.TestCase):
    """Test suite for inheritance smart contract."""
    
    def test_approval_program_compiles(self):
        """Test that approval program compiles successfully."""
        try:
            teal = compileTeal(
                approval_program(), 
                Mode.Application, 
                version=8
            )
            
            # Basic sanity checks
            self.assertIn("#pragma version 8", teal)
            self.assertIn("txn ApplicationID", teal)
            
            print("✓ Approval program compiles successfully")
            
        except Exception as e:
            self.fail(f"Approval program compilation failed: {e}")
    
    def test_clear_state_program_compiles(self):
        """Test that clear state program compiles successfully."""
        try:
            teal = compileTeal(
                clear_state_program(), 
                Mode.Application, 
                version=8
            )
            
            # Basic sanity checks
            self.assertIn("#pragma version 8", teal)
            self.assertIn("int 1", teal)  # Should return Approve (int 1)
            
            print("✓ Clear state program compiles successfully")
            
        except Exception as e:
            self.fail(f"Clear state program compilation failed: {e}")
    
    def test_approval_program_structure(self):
        """Test that approval program has expected structure."""
        teal = compileTeal(
            approval_program(), 
            Mode.Application, 
            version=8
        )
        
        # Check for key operations
        self.assertIn("txn ApplicationID", teal)  # Check for create/call logic
        self.assertIn("byte", teal)  # String/byte operations
        
        print("✓ Approval program has correct structure")
    
    def test_contract_can_be_saved(self):
        """Test that compiled contracts can be saved to files."""
        try:
            # Compile both programs
            approval_teal = compileTeal(
                approval_program(), 
                Mode.Application, 
                version=8
            )
            clear_teal = compileTeal(
                clear_state_program(), 
                Mode.Application, 
                version=8
            )
            
            # Write to test files
            with open("contracts/test_approval.teal", "w") as f:
                f.write(approval_teal)
            
            with open("contracts/test_clear.teal", "w") as f:
                f.write(clear_teal)
            
            # Verify files exist
            self.assertTrue(os.path.exists("contracts/test_approval.teal"))
            self.assertTrue(os.path.exists("contracts/test_clear.teal"))
            
            # Clean up test files
            os.remove("contracts/test_approval.teal")
            os.remove("contracts/test_clear.teal")
        except Exception as e:
            self.fail(f"Failed to save contract files: {e}")