import React from 'react'

export default function ProfileCard({ profile, recommendations, onDownload }) {
  if (!profile) return null

  return (
    <div id="profile-card" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full mr-4" />
        <div>
          <h2 className="text-2xl font-semibold">{profile.github_username}</h2>
          <p className="text-sm text-gray-500">{profile.bio}</p>
          <div className="mt-2 text-sm text-gray-600">
            {profile.company && <span className="mr-3">🏢 {profile.company}</span>}
            {profile.location && <span className="mr-3">📍 {profile.location}</span>}
            <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View on GitHub</a>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Developer Score</div>
          <div className="text-xl font-bold">{profile.developer_score}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Followers</div>
          <div className="text-xl font-bold">{profile.followers}</div>
        </div>
      </div>

      {recommendations && (
        <div className="mt-4 space-y-3">
          <h3 className="font-semibold">AI Recommendations</h3>

          {recommendations.strengths && (
            <div>
              <div className="text-sm font-medium">Strengths</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recommendations.strengths.map((s) => (<li key={s}>{s}</li>))}
              </ul>
            </div>
          )}

          {recommendations.weaknesses && (
            <div>
              <div className="text-sm font-medium">Weaknesses</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recommendations.weaknesses.map((s) => (<li key={s}>{s}</li>))}
              </ul>
            </div>
          )}

          {recommendations.recommended_skills && (
            <div>
              <div className="text-sm font-medium">Recommended Skills</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recommendations.recommended_skills.map((s) => (<li key={s}>{s}</li>))}
              </ul>
            </div>
          )}

          {recommendations.project_ideas && (
            <div>
              <div className="text-sm font-medium">Project Ideas</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recommendations.project_ideas.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}

          {recommendations.career_paths && (
            <div>
              <div className="text-sm font-medium">Career Paths</div>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recommendations.career_paths.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}

        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <button onClick={onDownload} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:opacity-90">Download PDF</button>
        <a href={profile.html_url} target="_blank" rel="noreferrer" className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50">Open GitHub</a>
      </div>
    </div>
  )
}
