export { meta } from "./home.meta";

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-3 text-white">
          Welcome to Our Platform
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The all-in-one solution for managing your projects and tasks
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="text-blue-400 text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Track Progress
          </h2>
          <p className="text-gray-400">
            Monitor your projects and tasks with our intuitive dashboard
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="text-green-400 text-4xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2 text-white">Collaborate</h2>
          <p className="text-gray-400">
            Work together with your team in real-time on shared projects
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-6 border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="text-purple-400 text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Boost Productivity
          </h2>
          <p className="text-gray-400">
            Streamline your workflow with automation and integrations
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-md shadow-black/30 p-8 mb-10 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Getting Started
        </h2>
        <p className="text-gray-400 mb-6">
          Sign in to access your dashboard and start managing your projects
          right away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/dashboard"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block text-center font-medium"
          >
            Go to Dashboard
          </a>
          <a
            href="/sign-in"
            className="px-5 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors inline-block text-center"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
