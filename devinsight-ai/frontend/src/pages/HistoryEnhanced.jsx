import React, { useEffect, useState } from 'react'
import { getHistory } from '../services/devinsightApi'
import { Link } from 'react-router-dom'

export default function HistoryEnhanced() {
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('')
  const token = localStorage.getItem('token')

  const fetch = async () => {
    try {
      const params = {}
      if (q) params.username = q
      if (language) params.language = language
      if (sortBy) params.sort_by = sortBy
      const res = await getHistory(params, token)
      setRows(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetch() }, [])

  return (
    <div className="p-6">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <div>
            <Link to="/dashboard-v2" className="bg-white text-indigo-600 px-3 py-1 rounded">Return to Dashboard V2</Link>
          </div>
        </div>
      </header>

      <div className="mb-4 flex gap-2">
        <input placeholder="Search username" value={q} onChange={e => setQ(e.target.value)} className="p-2 border rounded w-60" />
        <input placeholder="Filter language" value={language} onChange={e => setLanguage(e.target.value)} className="p-2 border rounded w-48" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="">Sort</option>
          <option value="developer_score">Developer Score (desc)</option>
        </select>
        <button onClick={fetch} className="px-4 py-2 bg-indigo-600 text-white rounded">Apply</button>
      </div>

      <div className="grid gap-4">
        {rows.map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.github_username}</div>
              <div className="text-sm text-gray-600">Score: {r.developer_score} • Followers: {r.followers} • Stars: {r.stars}</div>
            </div>
            <div>
              <a href={r.html_url} target="_blank" rel="noreferrer" className="text-blue-500">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
