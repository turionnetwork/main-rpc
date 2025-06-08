import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl shadow-2xl border border-red-800 bg-zinc-950/80 p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 drop-shadow-sm">
            Main RPC Turion
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Connect securely to the Turion RPC network
          </p>
        </div>
        <AuthForm />
        <footer className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Turion Network. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
