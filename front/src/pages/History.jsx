import React, { useEffect, useState } from "react";
import { getHistory, deleteHistory } from "../services/api";
import { Trash2, Clock, Activity, AlertCircle } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data.history || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report? This will remove it from your personal RAG history.")) return;
    try {
      await deleteHistory(id);
      setHistory(history.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete report: " + err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24 text-gray-500">Loading history...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Clock className="text-blue-600" />
          Your Medical History
        </h1>
        <p className="text-gray-600 mb-8">
          Past reports are securely saved here. The AI uses these reports to provide highly personalized, longitudinal context when answering future questions.
        </p>

        {error && <div className="text-red-600 mb-4 bg-red-50 p-4 rounded-xl border border-red-200">{error}</div>}

        {history.length === 0 && !error ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-200">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't processed any reports yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const explanation = item.explanation || {};
              const triage = explanation.triage_level || "UNKNOWN";
              const sentences = explanation.sentences || [];
              const firstSentence = sentences.length > 0 ? sentences[0].text : "No explanation details available.";
              
              return (
                <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-start hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(item.date.endsWith('Z') ? item.date : item.date + 'Z').toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                      </span>
                      {triage !== "UNKNOWN" && (
                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                          triage.toUpperCase() === 'RED' ? 'bg-red-50 border-red-200 text-red-700' :
                          triage.toUpperCase() === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                          'bg-green-50 border-green-200 text-green-700'
                        }`}>
                          {triage}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium mb-1">AI Summary:</p>
                    <p className="text-gray-600 text-sm italic mb-4">"{firstSentence}"</p>
                    
                    <details className="text-sm text-gray-500">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium select-none">View Original Extracted Text</summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-xs">
                        {item.report_text}
                      </div>
                    </details>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
