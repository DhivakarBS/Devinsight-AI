def generate_insights(profile):

    strengths = []

    if profile["top_language"] == "Python":
        strengths.append("Backend Development")

    elif profile["top_language"] == "JavaScript":
        strengths.append("Frontend Development")

    elif profile["top_language"] == "C":
        strengths.append("Systems Programming")

    elif profile["top_language"] == "Java":
        strengths.append("Enterprise Development")

    if profile["followers"] > 1000:
        strengths.append("Open Source Influence")

    if profile["public_repos"] > 10:
        strengths.append("Consistent Project Building")

    summary = (
        f"{profile['username']} primarily works with "
        f"{profile['top_language']} and has "
        f"{profile['public_repos']} repositories. "
        f"The profile shows strong experience in "
        f"{', '.join(strengths)}."
    )

    return {
        "strengths": strengths,
        "summary": summary
    }