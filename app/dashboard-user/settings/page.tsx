import Settings from "@/components/dashboard-user/settings/Settings";
import { cookies } from "next/headers";
import React from "react";
const fetchingUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/users/me`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
};
const page = async () => {
  const user = await fetchingUser();
  return (
    <div className=" h-full  ">
      <Settings userFetcher={user} />
    </div>
  );
};

export default page;
