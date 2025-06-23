const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const resumeData = require("../data/resume.json");
const pdf = require("html-pdf-node");
const ejs = require("ejs");

async function generateResumePro(job_description) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        type: "text",
        text: `You are a resume optimization assistant.

I will provide you with:
1. A Job Description (JD)
2. My existing resume data in JSON format.

👉 Your task is to read the JD and my resume, and then:
- Use My exsiting Resume Json To create
- Generate a revised "summary" that matches the tone and keywords of the JD and my resume should match the JD 100% .
- Summary must contain all the required keywords from the JD to perfectly match for job profile
-Keep My old Skills As It is , Add new skills from the JD respective to the skill category , create new Category if required 

- Try To add All the required Skills In Exsisting skils Array
- keep required skills at the top
- Output **only the updated "summary" and "skills" fields**, in the **same JSON structure**.

🔒 Format Guidelines:
- Summary must be grether than 400 characters and less than 500 charadters
- Keep in mind that categories must be minimum 5 and maximum 7
- Do not include any fields other than "summary" and "skills".

Let’s begin.

---

🔹 Job Description:
"""
${job_description}
"""

🔹 My Existing Resume Data (JSON):
${JSON.stringify(resumeData)}

expected format is :
Skills : ${JSON.stringify(resumeData.skills)}
give me response in same format , I repeat same format for summary and skills array`,
      },
    ],
  });

  let rawResponse = response.text;

  // Remove ```json and ``` if present
  rawResponse = rawResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(rawResponse);
}

const generateResume = async (req, res, next) => {
  try {
    const { job_description } = req.body;
    console.log("the job description is", job_description);
    const response = await generateResumePro(job_description);
    console.log("the response is", response);
    const html = await ejs.renderFile("views/resume.ejs", {
      resume: { ...resumeData, ...response },
    });

    const file = { content: html };
    const options = { format: "A4" };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = { generateResume };
