"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function CreateApiModal() {
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyCreated, setAlreadyCreated] = useState(false);

  const uid = auth.currentUser?.uid;
  const apiId = uid ? `main${uid}turion` : null;
  const apiEndpoint = `https://main.turion.network/rpc/${apiId}`;

  useEffect(() => {
    const checkExisting = async () => {
      if (uid) {
        const apiRef = doc(db, "apis", uid);
        const snap = await getDoc(apiRef);
        if (snap.exists()) {
          setAlreadyCreated(true);
          setApiUrl(snap.data().url);
        }
      }
    };
    checkExisting();
  }, [uid]);

  const handleCreate = async () => {
    if (!uid || !agreed) return;

    setLoading(true);
    try {
      const apiRef = doc(db, "apis", uid);
      await setDoc(apiRef, {
        uid,
        url: apiEndpoint,
        createdAt: Date.now(),
        requests: 0,
        active: true,
      });
      setApiUrl(apiEndpoint);
      setAlreadyCreated(true);
    } catch (err) {
      alert("Failed to create API. Try again later.");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-orange-600 hover:bg-orange-700 transition p-4 rounded-lg font-bold text-white shadow-md"
      >
        {alreadyCreated ? "View My API" : "Create API"}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-orange-600 rounded-xl p-6 w-full max-w-lg shadow-lg text-white space-y-4 relative">
            <h2 className="text-xl font-bold text-orange-500">RPC API Terms of Use</h2>
            <ul className="text-sm text-gray-300 list-disc ml-5 space-y-1">
              <li>This RPC is part of a public node, not guaranteed for uptime.</li>
              <li>Do not use it for scams, phishing, or bots.</li>
              <li>We are not responsible for data loss or service unavailability.</li>
              <li>One unique API per user only.</li>
              <li>This is a development tool, not for production-scale apps.</li>
            </ul>

            {!alreadyCreated && (
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="accent-orange-500"
                />
                <span>I accept the terms above.</span>
              </label>
            )}

            {alreadyCreated && (
              <div className="bg-black border border-green-600 text-green-400 p-3 rounded-md text-sm">
                <strong>Your API Endpoint:</strong>
                <input
                  readOnly
                  value={apiUrl}
                  onClick={(e) => e.currentTarget.select()}
                  className="mt-2 w-full bg-zinc-800 p-2 rounded text-white"
                />
              </div>
            )}

            {!alreadyCreated && (
              <button
                onClick={handleCreate}
                disabled={!agreed || loading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 transition py-2 rounded text-white font-bold disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create My API"}
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
