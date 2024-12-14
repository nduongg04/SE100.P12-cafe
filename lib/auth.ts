"use server";

import { cookies } from "next/headers";

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    // If no access token, attempt to refresh
    const newTokens = await refreshTokens();
    if (!newTokens) {
      throw new Error("Authentication failed");
    }
    accessToken = newTokens;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token might be expired, attempt to refresh
    const newTokens = (await refreshTokens())?.accessToken;
    if (newTokens) {
      // Retry the request with the new access token
      headers["Authorization"] = `Bearer ${newTokens}`;
      const newResponse = await fetch(url, { ...options, headers });
      return newResponse;
    } else {
      throw new Error("Authentication failed");
    }
  }

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response;
}

async function refreshTokens() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/auth/refresh-token`, {
      method: "GET",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
	
    const accessToken = await response.json();

    // Update cookies with new tokens
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600,
    });

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
