import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/analysis-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Analysis History</h1>
        <div className="flex gap-2">
          <Link to="/history-v2" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded">Open History V2</Link>
          <Link to="/dashboard-v2" className="bg-white text-indigo-600 px-4 py-2 rounded">Open Dashboard V2</Link>
        </div>
      </div>

      <div className="grid gap-4">

        {history.map((item) => (

          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow"
          >

            <h2 className="text-xl font-bold">
              {item.username}
            </h2>

            <p>Score: {item.developer_score}</p>
            <p>Language: {item.top_language}</p>
            <p>Followers: {item.followers}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default History;