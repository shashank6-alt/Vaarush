import React, { useState }  from "react";
import axios from "axios" ;


function App() {
  const [creatorPk, setCreatorPk] = useState("");
  const [heirAddr, setHeirAddr] = useState("");
  const [assetId, setAssetId] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [message, setMessage] = useState("");
// Removed invalid example code; API calls should be inside async functions like handleSubmit or handleAI.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await axios.post<{ detail: string }>("/plans", {
      creator_pk: creatorPk,
      heir_addr: heirAddr,
      asset_id: parseInt(assetId),
      release_time: parseInt(releaseTime),
    });
    

    setMessage(resp.data.detail);
  };

  const handleAI = async () => {
    const resp = await axios.get<{ answer: string }>("/api/ask", {
      params: { question: "What is inheritance in blockchain?" }
    });
    setMessage(resp.data.answer); 
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Vaarush Inheritance Demo</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Creator Private Key" value={creatorPk} onChange={e => setCreatorPk(e.target.value)} />
        <input placeholder="Heir Address" value={heirAddr} onChange={e => setHeirAddr(e.target.value)} />
        <input placeholder="Asset ID" value={assetId} onChange={e => setAssetId(e.target.value)} />
        <input placeholder="Release Time (unix)" value={releaseTime} onChange={e => setReleaseTime(e.target.value)} />
        <button type="submit">Create Plan</button>
      </form>
      <div>
        <button onClick={handleAI}>Ask AI</button>
      </div>
      <pre>{message}</pre>
    </div>
  );
}

export default App;
