"use client";

import { useEffect, useState } from "react";

interface UserInfoType {
  adminEmail: string;
  adminName: string;
  gradeName: string;
  adminGradeName: string;
  teamName: string;
  hqName: string;
}

export default function useStorageInfo() {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  return { userInfo };
}
