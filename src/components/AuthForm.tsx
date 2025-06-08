"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import countries from "@/lib/countries";

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLogin && (!acceptTerms || password !== rePassword)) {
      alert("Please check your input and accept the Terms of Service.");
      return;
    }

    try {
      await setPersistence(auth, keepLoggedIn ? browserLocalPersistence : browserSessionPersistence);

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dash");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await updateProfile(userCredential.user, {
          displayName: `${name} - ${country}`,
        });

        await setDoc(doc(db, "users", uid), {
          name,
          email,
          country,
          vip: false,
        });

        setSuccessMessage("🎉 Registration Completed!");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage("");
        }, 2500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-6 bg-black rounded-xl shadow-2xl text-white space-y-4 border border-red-700"
    >
      <h2 className="text-2xl font-bold text-orange-500 text-center mb-2">
        {isLogin ? "Login to Main RPC Turion" : "Register your account"}
      </h2>

      {successMessage && (
        <div className="bg-green-600 text-white text-center py-2 rounded-lg font-semibold animate-bounce">
          {successMessage}
        </div>
      )}

      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded bg-zinc-900 text-white border border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full px-4 py-3 rounded bg-zinc-900 text-white border border-orange-600 focus:ring-2 focus:ring-orange-500"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded bg-zinc-900 text-white border border-orange-600 focus:ring-2 focus:ring-orange-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 rounded bg-zinc-900 text-white border border-orange-600 focus:ring-2 focus:ring-orange-500"
      />

      {!isLogin && (
        <>
          <input
            type="password"
            placeholder="Repeat Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded bg-zinc-900 text-white border border-orange-600 focus:ring-2 focus:ring-orange-500"
          />

          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              className="accent-orange-600"
            />
            <span>
              I accept the{" "}
              <a href="#" className="text-orange-400 underline">
                Terms of Service
              </a>
            </span>
          </label>
        </>
      )}

      {isLogin && (
        <label className="flex items-center space-x-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="accent-orange-600"
          />
          <span>Keep me logged in</span>
        </label>
      )}

      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-red-600 transition text-white py-3 rounded-md font-bold"
      >
        {isLogin ? "Login" : "Register"}
      </button>

      <p
        onClick={() => {
          setIsLogin(!isLogin);
          setSuccessMessage("");
        }}
        className="text-center text-sm text-orange-400 hover:text-white cursor-pointer"
      >
        {isLogin ? "Create a new account" : "Already have an account? Login"}
      </p>
    </form>
  );
}
