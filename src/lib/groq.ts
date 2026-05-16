const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGroq(prompt: string): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function analyzeJobDescription(jobDescription: string) {
  const prompt = `
    Analyze this job description and return a JSON object with exactly this structure:
    {
      "requiredSkills": ["skill1", "skill2"],
      "responsibilities": ["responsibility1", "responsibility2"],
      "atsKeywords": ["keyword1", "keyword2"],
      "gaps": ["potential gap1", "potential gap2"],
      "summary": "2-3 sentence summary of the role"
    }

    Return only valid JSON, no markdown, no explanation.

    Job Description:
    ${jobDescription}
  `

  const result = await callGroq(prompt)
  const cleaned = result.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function tailorResume(resumeContent: string, jobDescription: string) {
  const prompt = `
    You are a resume optimization expert. Given a resume and a job description, return a JSON object with exactly this structure:
    {
      "improvedBullets": [
        { "original": "original bullet point", "improved": "improved version" }
      ],
      "missingKeywords": ["keyword1", "keyword2"],
      "recommendations": ["recommendation1", "recommendation2"]
    }

    Return only valid JSON, no markdown, no explanation.

    Resume Content:
    ${resumeContent}

    Job Description:
    ${jobDescription}
  `

  const result = await callGroq(prompt)
  const cleaned = result.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}