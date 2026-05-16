import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../services/api";
import { User, Activity, AlertCircle, CheckCircle, ShieldAlert, Download, Brain, FileText } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHistory();
        setHistory(data.history || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute Statistics
  const totalReports = history.length;
  let redCount = 0;
  let yellowCount = 0;
  let greenCount = 0;
  const entityCounts = {};

  history.forEach(item => {
    const triage = (item.explanation?.triage_level || "").toUpperCase();
    if (triage === "RED") redCount++;
    if (triage === "YELLOW") yellowCount++;
    if (triage === "GREEN") greenCount++;

    const entities = item.explanation?.medical_entities || [];
    entities.forEach(ent => {
      const name = ent.entity;
      entityCounts[name] = (entityCounts[name] || 0) + 1;
    });
  });

  const topEntities = Object.entries(entityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MediExplain_Personal_Record.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between border border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || "Patient Profile"}</h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <ShieldAlert className="w-4 h-4 text-green-500" />
                Data securely encrypted & stored via MongoDB Atlas
              </p>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="mt-6 md:mt-0 flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md font-medium"
          >
            <Download className="w-4 h-4" />
            Export Health Data
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Triage Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2 flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-blue-500" />
              Longitudinal Triage Overview
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              {totalReports === 0 ? (
                <p className="text-gray-500 text-center">No reports analyzed yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-red-700">{redCount}</p>
                    <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mt-1">High Urgency</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-100">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-yellow-700">{yellowCount}</p>
                    <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide mt-1">Monitor</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-green-700">{greenCount}</p>
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mt-1">Routine</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Triage scoring is performed securely by Neuro-Symbolic AI.</p>
          </div>

          {/* Activity Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center text-center">
            <FileText className="w-12 h-12 text-blue-300 mx-auto mb-4 opacity-80" />
            <p className="text-5xl font-extrabold mb-2">{totalReports}</p>
            <p className="text-blue-200 font-medium text-lg">Total Reports Processed</p>
            <p className="text-xs text-blue-300 mt-4 opacity-80">RAG Memory Active</p>
          </div>

        </div>

        {/* NLP Entities Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="text-purple-500" />
            Recurrent Medical Entities (SciSpaCy Extracted)
          </h2>
          {topEntities.length === 0 ? (
            <p className="text-gray-500 text-sm">Upload more reports to populate your medical entity cloud.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {topEntities.map(([entity, count], idx) => (
                <div key={idx} className="flex items-center bg-purple-50 border border-purple-100 rounded-lg overflow-hidden shadow-sm">
                  <span className="px-3 py-1.5 text-sm font-semibold text-purple-800 capitalize">
                    {entity}
                  </span>
                  <span className="bg-purple-200 text-purple-900 px-2 py-1.5 text-xs font-bold border-l border-purple-100">
                    x{count}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4 italic">
            These are the most common medical terms identified across all your past reports. The AI uses these to personalize future interactions.
          </p>
        </div>

      </div>
    </div>
  );
}
