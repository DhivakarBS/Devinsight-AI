import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GithubForm from '../components/GithubForm'
import ProfileCard from '../components/ProfileCard'
import { analyzeProfile, getCareerRecommendations } from '../services/devinsightApi'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A78BFA']

export default function DashboardEnhanced() {
  const [profile, setProfile] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const onAnalyze = async (username) => {
    setLoading(true)
    try {
      const res = await analyzeProfile(username, token)
      setProfile(res.data)
      const rec = await getCareerRecommendations(username, token)
      setRecommendations(rec.data)
    } catch (e) {
      console.error(e)
      alert('Analysis failed')
    }
    setLoading(false)
  }

  const downloadPDF = async () => {
    if (!profile) return
    const ele = document.getElementById('devinsight-report') || document.getElementById('profile-card')
    const canvas = await html2canvas(ele, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pdfWidth
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width
    let heightLeft = imgHeight
    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
    while (heightLeft > 0) {
      position -= pdfHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }
    pdf.save(`${profile.github_username}-devinsight.pdf`)
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
          <GithubForm onAnalyze={onAnalyze} loading={loading} />
          {profile && <ProfileCard profile={profile} recommendations={recommendations} onDownload={downloadPDF} />}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Language Distribution</h2>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Skill Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Top Repositories (Stars)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stars" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div>
        </div>
    </div>
  )
}
