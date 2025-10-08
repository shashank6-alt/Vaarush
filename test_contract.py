from contracts.inheritance import inheritance_contract
from pyteal import compileTeal, Mode

compiled = compileTeal(inheritance_contract(), Mode.Application, version=5)
print(compiled)
