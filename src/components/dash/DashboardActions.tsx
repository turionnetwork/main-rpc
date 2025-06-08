"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import CreateApiModal from "./CreateApiModal"; // ✅ Importa o modal

export default function DashboardActions() {
  const router = useRouter();

  const logout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleAction = (action: string) => {
    alert(`TODO: Implement ${action}`);
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* ✅ Substitui o botão antigo pelo modal */}
      <CreateApiModal />

      <button
        onClick={() => handleAction("Delete API")}
        className="w-full bg-red-600 hover:bg-red-700 transition p-4 rounded-lg font-bold text-white shadow-md"
      >
        Delete API
      </button>
      <button
        onClick={() => handleAction("Settings")}
        className="w-full bg-zinc-800 border border-orange-600 hover:bg-zinc-700 transition p-4 rounded-lg font-bold text-white shadow-md"
      >
        Settings (Account)
      </button>
      <button
        onClick={() => handleAction("Plans")}
        className="w-full bg-zinc-800 border border-red-600 hover:bg-zinc-700 transition p-4 rounded-lg font-bold text-white shadow-md"
      >
        Plans
      </button>
      <button
        onClick={logout}
        className="w-full bg-zinc-900 hover:bg-red-800 transition p-4 rounded-lg font-bold text-white shadow-md col-span-full sm:col-span-2 lg:col-span-3"
      >
        Logout
      </button>
    </section>
  );
}
