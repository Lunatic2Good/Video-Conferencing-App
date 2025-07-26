'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const FEEDBACK_API = 'https://42e508hyl4.execute-api.ap-south-1.amazonaws.com/feedback';
const UPLOAD_URL_API = 'https://42e508hyl4.execute-api.ap-south-1.amazonaws.com/upload-url';

const FeedbackForm = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleScreenshotChange = (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      let screenshotKey = null;

      if (screenshot) {
        const { data } = await axios.get(UPLOAD_URL_API);
        screenshotKey = data.key;

        await axios.put(data.uploadURL, screenshot, {
          headers: {
            'Content-Type': screenshot.type || 'image/png',
          },
        });
      }

      const res = await axios.post(
        FEEDBACK_API,
        { feedbackText, screenshotKey },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast({
        title: 'Feedback submitted!',
        description: `Sentiment: ${res.data.sentiment}`,
      });

      setFeedbackText('');
      setScreenshot(null);
      setScreenshotPreview(null);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      toast({
        title: 'Error submitting feedback',
        description: err.response?.data?.message || err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 rounded-lg shadow-xl bg-dark-2 border border-dark-4">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">📣 Submit Feedback</h2>

      <textarea
        placeholder="How was your video experience?"
        className="w-full bg-dark-4 border-none text-white p-4 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder:text-gray-400"
        rows={5}
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />

      <label className="block mb-2 text-sm text-white">Attach Screenshot (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleScreenshotChange}
        className="mb-4 text-white file:bg-blue-600 file:border-none file:py-2 file:px-4 file:rounded-md file:text-sm file:cursor-pointer hover:file:bg-blue-700"
      />

      {screenshotPreview && (
        <div className="mb-4">
          <img
            src={screenshotPreview}
            alt="Screenshot Preview"
            className="rounded-md border border-dark-4 max-h-60 object-contain mx-auto"
          />
        </div>
      )}

      <button
        onClick={handleFeedbackSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-medium py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
};

export default FeedbackForm;
