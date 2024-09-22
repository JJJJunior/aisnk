"use client";
import useRefTracker from "@/app/lib/hooks/useRefTracker";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const RefTracker = () => {
  const { addRef } = useRefTracker();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      addRef(ref);
    }
  }, []);
  return null;
};

export default RefTracker;
