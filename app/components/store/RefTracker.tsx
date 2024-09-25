"use client";
import React, { useEffect } from "react";
import useRefTracker from "@/app/lib/hooks/useRefTracker";
import { useSearchParams } from "next/navigation";

const RefTracker = () => {
  const { addRef } = useRefTracker();
  const searchParams = useSearchParams();
  //如果携带ref，就将ref推荐人推荐码保存在localstore中
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      addRef(ref);
    }
  }, [ref]);
  return null;
};

export default RefTracker;
