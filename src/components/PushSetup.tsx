import { useState } from "react";
import { ensurePushSubscription } from "../push/subscribe";

export default function PushSetup() {
  const [subJson, setSubJson] = useState("");
  const subscribe = async () => {
    const key = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
    if (!key) return alert("Falta VITE_VAPID_PUBLIC_KEY");
    const sub = await ensurePushSubscription(key);
    setSubJson(JSON.stringify(sub, null, 2));
  };
  return (
    <div style={{display:'grid',gap:8}}>
      <button onClick={subscribe}>Suscribirme a Web Push</button>
      <textarea rows={10} value={subJson} readOnly style={{fontFamily:'monospace'}} />
      <button onClick={async()=>{await navigator.clipboard.writeText(subJson); alert('Copiado')}} disabled={!subJson}>
        Copiar
      </button>
      <small>Pegá este JSON en Netlify → env var <code>SUSCRIPTIONS_JSON</code> como array.</small>
    </div>
  );
}