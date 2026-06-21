import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center">

        <h1 className="text-5xl font-bold text-indigo-600 mb-4">
          DevInsight AI
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          AI-Powered GitHub Developer Analytics Platform
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">
              GitHub Analysis
            </h3>

            <p className="text-sm text-gray-600">
              Analyze developer profiles and repositories
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">
              AI Recommendations
            </h3>

            <p className="text-sm text-gray-600">
              Get skills, projects and career suggestions
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">
              Analytics Dashboard
            </h3>

            <p className="text-sm text-gray-600">
              Visualize strengths and performance metrics
            </p>
          </div>

        </div>

        <div className="flex justify-center gap-4">

          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;