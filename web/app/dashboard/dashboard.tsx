import { useAuth } from "@clerk/react-router";
import { useToast } from "../components/ToastContext";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
export { loader } from "./dashboard.loader";

interface LoaderData {
  documents: Record<string, unknown> | null;
  error?: string;
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const { showToast } = useToast();
  const loaderData = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show toast only on initial load if there are documents or errors
  useEffect(() => {
    if (loaderData.documents) {
      showToast(JSON.stringify(loaderData.documents, null, 2), "success");
    } else if (loaderData.error) {
      showToast(loaderData.error || "Unknown error", "error");
    }

    // If we have an action parameter, clear it by navigating back to the base URL
    // This prevents endless reloads
    if (searchParams.get("action")) {
      // Use replace instead of navigate to avoid adding to history
      navigate(".", { replace: true });
    }
  }, [loaderData, showToast, navigate, searchParams]);

  const callDocumenso = async () => {
    showToast("Calling Documenso API...", "info");
    // Navigate with replace to avoid multiple history entries
    navigate("?action=fetch_documents", { replace: true });
  };

  const callBapi = async () => {
    showToast("Calling Backend API...", "info");

    const res = await fetch("http://localhost:8080/protected", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }).catch((e) => {
      console.error(e);
      showToast("API call failed", "error");
      return { ok: false, json: () => "failed" };
    });

    if (res.ok) {
      const data = await res.json();
      showToast(JSON.stringify(data, null, 2), "success");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold mb-2 text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 flex flex-col border border-gray-700">
          <span className="text-gray-400 text-sm">Total Projects</span>
          <span className="text-3xl font-bold mt-2 text-white">12</span>
          <div className="mt-2 text-green-400 text-sm">
            ↑ 8% from last month
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 flex flex-col border border-gray-700">
          <span className="text-gray-400 text-sm">Active Tasks</span>
          <span className="text-3xl font-bold mt-2 text-white">24</span>
          <div className="mt-2 text-blue-400 text-sm">3 due today</div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 flex flex-col border border-gray-700">
          <span className="text-gray-400 text-sm">Team Members</span>
          <span className="text-3xl font-bold mt-2 text-white">7</span>
          <div className="mt-2 text-gray-400 text-sm">2 online now</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
        <p className="text-gray-400 mb-6">
          Start a new project or task with these quick actions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              callDocumenso();
            }}
          >
            API Call To Documenso
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              callBapi();
            }}
          >
            API Call To Backend
          </button>
          <a
            href="http://localhost:3000/documents"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Documenso
          </a>
        </div>
      </div>
    </div>
  );
}
