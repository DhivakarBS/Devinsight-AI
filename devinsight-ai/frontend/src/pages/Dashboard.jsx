import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import AnalyticsChart from "../components/AnalyticsChart";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);

  const analyzeGithub = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/analyze-github",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    }
  };

  const getLevel = (score) => {
    if (score >= 90) {
      return {
        text: "Expert 🚀",
        color: "bg-green-500",
      };
    }

    if (score >= 70) {
      return {
        text: "Advanced ⭐",
        color: "bg-blue-500",
      };
    }

    if (score >= 50) {
      return {
        text: "Intermediate 🔥",
        color: "bg-yellow-500",
      };
    }

    return {
      text: "Beginner 🌱",
      color: "bg-red-500",
    };
  };

  const chartData = result
    ? [
        {
          name: "Followers",
          value: result.followers,
        },
        {
          name: "Repos",
          value: result.public_repos,
        },
        {
          name: "Stars",
          value: result.total_stars,
        },
        {
          name: "Score",
          value: result.developer_score,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        DevInsight AI
      </h1>

      <div className="flex justify-center gap-2 mb-8">
        <input
          type="text"
          placeholder="GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded-lg w-80"
        />

        <button
          onClick={analyzeGithub}
          className="bg-blue-600 text-white px-5 rounded-lg"
        >
          Analyze
        </button>
        <Link to="/dashboard-v2" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg ml-2">Open Dashboard V2</Link>
      </div>

      {result && (
        <div className="max-w-6xl mx-auto">

          {/* Stats Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                Developer Score
              </h3>

              <p className="text-3xl font-bold">
                {result.developer_score}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                Followers
              </h3>

              <p className="text-3xl font-bold">
                {result.followers}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                Repositories
              </h3>

              <p className="text-3xl font-bold">
                {result.public_repos}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                Stars
              </h3>

              <p className="text-3xl font-bold">
                {result.total_stars}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-3">
                Developer Level
              </h3>

              <span
                className={`text-white px-4 py-2 rounded-full ${getLevel(
                  result.developer_score
                ).color}`}
              >
                {getLevel(result.developer_score).text}
              </span>
            </div>

          </div>

          {/* Profile Info */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="text-2xl font-bold mb-2">
              {result.name}
            </h2>

            <p>
              Top Language:
              <span className="font-semibold">
                {" "}
                {result.top_language}
              </span>
            </p>

          </div>

          {/* Strengths */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="text-xl font-bold mb-4">
              Strengths
            </h2>

            <ul className="list-disc ml-5">
              {result.strengths.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>

          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="text-xl font-bold mb-4">
              Summary
            </h2>

            <p>
              {result.summary}
            </p>

          </div>

          {/* Analytics Chart */}
          <div className="mt-6">
            <AnalyticsChart
              data={chartData}
            />
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;