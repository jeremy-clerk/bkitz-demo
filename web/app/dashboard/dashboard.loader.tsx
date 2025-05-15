import { redirect } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/dashboard";

export async function loader(args: Route.LoaderArgs) {
  const { userId, getToken } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  // Check if this is a document fetch request
  const url = new URL(args.request.url);
  if (url.searchParams.get("action") === "fetch_documents") {
    try {
      // Get the Clerk token
      const token = await getToken();

      // Call Documenso API from the server
      const response = await fetch("http://localhost:3000/api/v1/documents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the documents data
      const data = await response.json();
      return { documents: data };
    } catch (error) {
      console.error("Error fetching documents:", error);
      return { error: "Failed to fetch documents", documents: null };
    }
  }

  // Default return for normal page load
  return { documents: null };
}
