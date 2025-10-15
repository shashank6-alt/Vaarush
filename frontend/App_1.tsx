import React, { useState } from "react";
import { WillManagerClient } from "./contracts/WillManagerClient";
import { useWallet } from "@txnlab/use-wallet";

function App() {
  const { activeAddress } = useWallet();
  const [response, setResponse] = useState("");

  const handlePing = async () => {
    const client = new WillManagerClient({ sender: activeAddress!, appId: 0 }, algodClient);
    const res = await client.ping();
    setResponse(res);
  };

  return (
    <div className="p-4">
      <button onClick={handlePing} className="btn btn-primary">
        Ping Contract
      </button>
      {response && <p className="mt-2">Response: {response}</p>}
    </div>
  );
}

export default App;
