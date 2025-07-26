"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");

  useEffect(() => {
    axios
      .get("https://42e508hyl4.execute-api.ap-south-1.amazonaws.com/admin-feedbacks")
      .then((res) => {
        setFeedbacks(res.data);
        setFilteredFeedbacks(res.data);
      })
      .catch((err) => console.error("❌ Failed to fetch:", err));
  }, []);

  useEffect(() => {
    let updated = feedbacks;

    if (searchTerm) {
      updated = updated.filter((f) =>
        f.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sentimentFilter !== "ALL") {
      updated = updated.filter((f) => f.sentiment === sentimentFilter);
    }

    setFilteredFeedbacks(updated);
  }, [searchTerm, sentimentFilter, feedbacks]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard");
  };

  const deleteFeedback = (id: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      setFeedbacks((prev) => prev.filter((f) => f.feedbackId !== id));
    }
  };

  return (
    <div className="min-h-screen bg-dark-2 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-400">
          🛠️ Admin Feedback Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-2 rounded bg-[#252a41] text-white border border-[#3a3f5c]"
          />

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="w-full sm:w-48 p-2 rounded bg-[#252a41] text-white border border-[#3a3f5c]"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEGATIVE">Negative</option>
            <option value="NEUTRAL">Neutral</option>
          </select>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <p className="text-center text-gray-400">No matching feedbacks found...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedbacks.map((f) => (
              <div
                key={f.feedbackId}
                className="bg-[#1f2333] border border-[#3a3f5c] rounded-lg p-5 shadow-xl hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="mb-4 space-y-1">
                  <p className="text-lg font-medium">📝 {f.text}</p>
                  <p className="text-sm text-gray-400">🕒 {new Date(f.timestamp).toLocaleString()}</p>
                  <p className="text-sm">
                    📊 Sentiment:{" "}
                    <span
                      className={`font-bold px-2 py-1 rounded ${
                        f.sentiment === "POSITIVE"
                          ? "bg-green-500 text-black"
                          : f.sentiment === "NEGATIVE"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {f.sentiment}
                    </span>
                  </p>
                </div>

                {f.screenshotUrl ? (
                  <img
                    src={f.screenshotUrl}
                    alt="Screenshot"
                    className="w-full h-48 object-cover rounded border border-gray-700 mb-3"
                  />
                ) : (
                  <p className="text-sm text-gray-500 italic">No screenshot</p>
                )}

                <div className="flex justify-between mt-2 text-sm text-white">
                  <button
                    onClick={() => copyToClipboard(f.text)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => deleteFeedback(f.feedbackId)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
