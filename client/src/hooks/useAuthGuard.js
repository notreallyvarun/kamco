import { useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenExpired } from "@/utils/token";
import { toast } from "react-toastify";

export default function useAuthGuard(redirectPath = "/login") {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      toast.info("Session expired. Please log in again.");
      router.push(redirectPath);
    }
  }, [router, redirectPath]);
}
