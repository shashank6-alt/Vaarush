from pyteal import *

def will_manager_approval():
    
    def __init__(self) -> None:
        # Global state
        self.executor = GlobalState(Bytes)       # executor address
        self.total_share = GlobalState(Uint64)   # track total allocated share
        
        # Local state per account (heir)
        self.heir_share = LocalState(Uint64)     # percentage share (0-100)
        self.heir_data = LocalState(Bytes)       # metadata/will instructions
        self.is_registered = LocalState(Uint64)  # 1 if registered, 0 if not

    @arc4.baremethod(create="allow")
    def create_application(self, executor_addr: Bytes) -> None:
        """Initialize contract with executor address."""
        self.executor.value = executor_addr

    @arc4.abimethod
    def register_heir(self, heir: Account) -> ABIString:
        """Register a new heir."""
        # Only executor can register heirs
        assert Txn.sender == self.executor.value, "Only executor can register heirs"
        
        # Mark heir as registered
        self.is_registered[heir] = Uint64(1)
        return ABIString("Heir registered successfully")

    @arc4.abimethod
    def set_will(self, heir: Account, share_percentage: ABIUint64, metadata: ABIString) -> ABIString:
        """Set will details for a registered heir."""
        # Only executor can set will
        assert Txn.sender == self.executor.value, "Only executor allowed"
        
        # Heir must be registered first
        assert self.is_registered[heir] == Uint64(1), "Heir not registered"
        
        # Validate share percentage (0-100)
        share = share_percentage.native
        assert share >= Uint64(0) and share <= Uint64(100), "Invalid share percentage"
        
        # Update total share
        old_share = self.heir_share[heir]
        new_total = self.total_share.value - old_share + share
        assert new_total <= Uint64(100), "Total share exceeds 100%"
        
        # Store share and metadata
        self.heir_share[heir] = share
        self.heir_data[heir] = metadata.native.bytes
        self.total_share.value = new_total
        
        return ABIString("Will updated for heir")

    @arc4.abimethod
    def get_heir_info(self, heir: Account) -> ABIString:
        """Get heir's share and metadata."""
        if self.is_registered[heir] == Uint64(1):
            share = self.heir_share[heir]
            return ABIString(f"Share: {share}%")
        return ABIString("Heir not found")

    @arc4.abimethod
    def execute_will(self) -> ABIString:
        """Execute the will (placeholder for asset distribution)."""
        # Only executor can execute
        assert Txn.sender == self.executor.value, "Only executor can execute will"
        
        # TODO: Implement actual asset distribution logic
        # This would involve:
        # 1. Getting contract's asset balance
        # 2. Iterating through registered heirs  
        # 3. Transferring proportional shares via inner transactions
        
        return ABIString("Will execution initiated")

    @arc4.abimethod
    def ping(self) -> ABIString:
        """Health check method."""
        return ABIString("pong")

    @subroutine
    def verify_executor(self) -> bool:
        """Helper: verify sender is the executor."""
        return Txn.sender == self.executor.value

# Remove the __main__ block from the contract file
# Deployment should be handled in separate scripts
