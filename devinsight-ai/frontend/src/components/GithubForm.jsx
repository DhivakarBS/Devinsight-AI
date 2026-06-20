function GithubForm({
  username,
  setUsername,
  analyzeGithub
}) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      <input
        type="text"
        placeholder="GitHub Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        className="border p-3 rounded-lg w-80"
      />

      <button
        onClick={analyzeGithub}
        className="bg-blue-600 text-white px-5 rounded-lg"
      >
        Analyze
      </button>
    </div>
  );
}

export default GithubForm;