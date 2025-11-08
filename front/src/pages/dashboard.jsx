// import React, { useState } from "react";
// import ChatBox from "../components/ChatBox";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [reportText, setReportText] = useState("");

//   const handleClearHistory = async () => {
//     await fetch(`http://127.0.0.1:8000/api/clear_history/${user.email}/`, {
//       method: "DELETE",
//     });
//     alert("Chat history cleared!");
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
//         <div className="flex gap-3">
//           <button
//             onClick={handleClearHistory}
//             className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//           >
//             Clear History
//           </button>
//           <button
//             onClick={logout}
//             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       <ChatBox reportText={reportText} />
//     </div>
//   );
// };

// export default Dashboard;
