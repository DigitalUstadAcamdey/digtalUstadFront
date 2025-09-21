import { cookies } from "next/headers";

export async function fetchUserServer() {
  const cookieSoter = await cookies();
  const token = cookieSoter.get("token")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/me`,
      {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }
    const data = await res.json();

    return data.user;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
