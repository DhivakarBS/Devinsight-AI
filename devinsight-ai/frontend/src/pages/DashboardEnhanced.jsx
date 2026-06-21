import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GithubForm from '../components/GithubForm'
import ProfileCard from '../components/ProfileCard'
import api from '../api/api'
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A78BFA']

export default function DashboardEnhanced() {
  const [profile, setProfile] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const analyzeGithub = async () => {
    if (!username) return alert('Please enter a GitHub username')
    setLoading(true)
    try {
      const response = await api.post(
        '/api/github/analyze',
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log(response.data)
      setProfile(response.data)

      const recRes = await api.post(
        '/api/github/career-recommendations',
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log(recRes.data)
      setRecommendations(recRes.data)
    } catch (e) {
      console.error(e)
      console.log(e.response?.data)
      alert('Analysis failed')
    }
    setLoading(false)
  }

  const downloadPDF = async () => {
    if (!profile) return
    try {
      const { default: generateProfilePDF } = await import('../utils/pdfHelper')
      await generateProfilePDF(profile, recommendations)
    } catch (e) {
      console.error('PDF generation failed', e)
      alert('Failed to generate PDF')
    }
  }

  const pieData = profile ? Object.entries(profile.language_distribution || {}).map(([k, v]) => ({ name: k, value: v })) : []
  const radarData = profile ? (profile.skills || []).map(s => ({ subject: s.skill_name, A: s.score * 100 })) : []
  const barData = profile ? (profile.repositories || []).slice(0, 8).map(r => ({ name: r.name, stars: r.stars })) : []

  return (
    <div className="p-6">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">DevInsight AI Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/dashboard" className="bg-white text-indigo-600 px-3 py-1 rounded">Return to Dashboard</Link>
            <Link to="/history-v2" className="bg-white text-indigo-600 px-3 py-1 rounded">Open History V2</Link>
          </div>
        </div>
      </header>

      <div id="devinsight-report">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GithubForm username={username} setUsername={setUsername} analyzeGithub={analyzeGithub} />
          {profile && <ProfileCard profile={profile} recommendations={recommendations} onDownload={downloadPDF} />}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Language Distribution</h2>
            <div style={{ width: '100%', height: 240 }}>
              {pieData && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={pieData} outerRadius={80} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No language distribution data available.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Skill Radar</h3>
              <div style={{ width: '100%', height: 300 }}>
                {radarData && radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500">No skill data available.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Top Repositories (Stars)</h3>
              <div style={{ width: '100%', height: 300 }}>
                {barData && barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stars" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500">No repository data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
    </div>
  )
}
