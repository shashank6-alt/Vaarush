import React, { useState }  from "react";
import axios from "axios" ;
import { getAiResponse } from "./ai/assistant"; // adjust path as needed

function App() {
  const [creatorPk, setCreatorPk] = useState("");
  const [heirAddr, setHeirAddr] = useState("");
  const [assetId, setAssetId] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [message, setMessage] = useState("");
  const resp = await axios.post<{ reply: string }>("/api/ai", { ... });
const data = resp.data; // now data.reply is recognized

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await axios.post("/plans", {
      creator_pk: creatorPk,
      heir_addr: heirAddr,
      asset_id: parseInt(assetId),
      release_time: parseInt(releaseTime),
    });
    

    setMessage(resp.data.detail);
  };

  const handleAI = () => {
    const aiResp = getAiResponse(message || "");
    setMessage(aiResp);
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
