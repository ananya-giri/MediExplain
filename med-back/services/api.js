// // src/services/api.js
// export const explainText = async (text) => {
//   const response = await fetch("http://127.0.0.1:8000/api/explain/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text }),
//   });
//   return await response.json();
// };

// export const chatAboutReport = async (reportText, question) => {
//   const response = await fetch("http://127.0.0.1:8000/api/chat/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ report_text: reportText, question }),
//   });
//   return await response.json();
// };
