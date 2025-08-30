// utils/geminiAPI.ts
export const generateSummaryAPI = async (_id: string): Promise<string> => {
  try {
    const response = await fetch(`https://voice-notes-backend.vercel.app/api/notes/summary/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    return data.summary; // backend should return { summary: "..." }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
