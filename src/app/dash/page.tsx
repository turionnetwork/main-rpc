"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserSummary from "@/components/dash/UserSummary";
import DashboardActions from "@/components/dash/DashboardActions";

interface UserData {
  uid: string;
  name: string;
  email: string;
  country: string;
  vip: boolean;
}

export default function DashPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/");
      } else {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ ...userSnap.data(), uid: firebaseUser.uid } as UserData);
        } else {
          setUserData({
            name: firebaseUser.displayName || "Unknown",
            email: firebaseUser.email || "",
            country: "N/A",
            vip: false,
            uid: firebaseUser.uid,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!userData) return null;

  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-6">
      <UserSummary user={userData} />
      <DashboardActions />
    </main>
  );
}
