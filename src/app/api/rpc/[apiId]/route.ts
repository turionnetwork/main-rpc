import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req: NextRequest, { params }: { params: { apiId: string } }) {
  const { apiId } = params;

  // Verifica se a API existe no Firestore
  const apiRef = doc(db, "apis", apiId.replace(/^api/, "").replace(/turion$/, ""));
  const apiSnap = await getDoc(apiRef);

  if (!apiSnap.exists()) {
    return new Response(JSON.stringify({ error: "API key not found or unauthorized." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
