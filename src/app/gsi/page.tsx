"use client";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import GoogleLoginButton from "../components/GoogleLoginButton";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/globalContext";
import Spinner from "../components/Spinner";

export default function Gsi() {
  const { setEmail } = useGlobal();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleAuth.initialize({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`,
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });
  }, []);
  const router = useRouter();

  async function handleClick() {
    console.log("oi1");
    setLoading(true);
    const user = await GoogleAuth.signIn();
    console.log("oi2");
    setLoading(false);
    setEmail(user.email);
    localStorage.setItem("email", user?.email);
    if (user.email.includes("ae.studio")) {
      console.log("oi4");
      router.push("/");
    } else {
      console.log("oi5");
      router.push("/custom");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center w-full h-screen">
        {loading ? (
          <Spinner />
        ) : (
          <GoogleLoginButton handleClick={handleClick} />
        )}
      </div>
    </>
  );
}
