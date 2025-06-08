import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Assinatura correta: Request + { params: Promise<{ apiId: string }> }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ apiId: string }> }
) {
  const { apiId } = await params;  // ⚠️ Aguardar a Promise

  const cleanUid = apiId.replace(/^main/, "").replace(/turion$/, "");
  const apiRef = doc(db, "apis", cleanUid);
  const apiSnap = await getDoc(apiRef);

  if (!apiSnap.exists()) {
    return new Response(JSON.stringify({ error: "API key not found or unauthorized." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const response = await fetch("http://main1.turion.network:23999", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from("rpc_turion:dR2oBQ3K1zYMZQtJFZeAerhWxaJ5Lqeq9J2").toString("base64"),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    await updateDoc(apiRef, {
      requests: increment(1),
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
