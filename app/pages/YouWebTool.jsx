"use client";

import axios from "axios";
import { ArrowDownToDot, Globe, Trash2, Youtube } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const checkPrevUrl = (webName, urls) => {
  return urls.some((url) => url.name === webName);
};

function YoutubeTool() {
  const [urls, setUrls] = useState([]);
  const [urlData, setUrlData] = useState("");
  const [urlType, setUrlType] = useState("website"); 
  const [isLoading, setIsLoading] = useState(false);

  const addUrlOnClient = async () => {
    if (!urlData || urlData.trim() === "") {
      toast.error("Please enter a valid URL");
      return;
    }

    let url;
    try {
      url = new URL(urlData.trim());
    } catch {
      toast.error("Invalid URL format");
      return;
    }

    if (urlType === "youtube" && !url.hostname.includes("youtube.com")) {
      toast.error("Please enter a valid YouTube URL (e.g., youtube.com/watch?v=...)");
      return;
    }

    const parts = url.hostname.split(".");
    if (parts[0] === "www") {
      parts.shift();
    }
    const websiteName = parts[0];

    if (checkPrevUrl(websiteName, urls)) {
      toast.error(`${websiteName} is already added`);
      return;
    }

    if (urls.length >= 3) {
      toast.error("Only 3 URLs are allowed");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("url", urlData.trim());
      formData.append("type", urlType);

      const response = await axios.post("/api/rag-index", formData);

      if (!response.data.success) {
        toast.error(response.data.error || "Failed to index URL");
        return;
      }

      const newUrl = { name: websiteName, link: urlData.trim(), type: urlType };
      setUrls((prevData) => [...prevData, newUrl]);
      setUrlData("");
      toast.success(`${urlType === "youtube" ? "YouTube video" : "Website"} added successfully`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }finally{
      setIsLoading(false);
    }
  };

  const handleDeleteUrlFromClient = (urlName) => {
    const filteredUrls = urls.filter((url) => url.name !== urlName);
    setUrls(filteredUrls);
    toast.success("URL removed successfully");
  };

  useEffect(() => {
    try {
      const prevUrls = JSON.parse(localStorage.getItem("urls") || "[]");
      setUrls(prevUrls);
    } catch {
      localStorage.removeItem("urls");
      setUrls([]);
    }
  }, []);

  useEffect(() => {
    if (urls.length === 0) {
      localStorage.removeItem("urls");
    } else {
      try {
        localStorage.setItem("urls", JSON.stringify(urls));
      } catch {
        toast.error("Failed to save URLs to localStorage");
      }
    }
  }, [urls]);

  return (
    <div className="text-white mt-10">
      <div>
        <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          Add Website or YouTube URL
        </h1>
        <div className="flex gap-3">
          <select
            value={urlType}
            onChange={(e) => setUrlType(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded-lg text-white"
          >
            <option value="website"
            className="bg-white/10 px-3 py-2 rounded-lg text-white">Website</option>
            <option
            className="bg-white/10 px-3 py-2 rounded-lg text-white" value="youtube">YouTube</option>
          </select>
          <input
            type="text"
            value={urlData}
            onChange={(e) => setUrlData(e.target.value)}
            placeholder={urlType === "youtube" ? "Paste YouTube URL..." : "Paste website URL..."}
            className="bg-white/10 w-full px-3 py-2 rounded-lg"
          />
        </div>
        <div className="mt-3 flex justify-end">
      {isLoading ? (
        <div className="bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-2 drop-shadow-lg">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Indexing...
        </div>
      ) : (
        <button
          onClick={addUrlOnClient}
          className="bg-blue-600 hover:bg-blue-500/85 px-3 py-1 rounded-lg flex items-center gap-2 drop-shadow-lg"
        >
          <ArrowDownToDot size={16} />
          Add
        </button>
      )}
    </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Added Items
            </h1>
            <p className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              {urls.length}/3
            </p>
          </div>
          <div className="flex flex-col gap-2 max-h-[25vh] overflow-y-auto p-2">
            {urls.map((url, index) => (
              <div
                key={index}
                className="bg-white/10 w-full px-4 py-2 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div>
                    {url.type === "youtube" ? <Youtube size={24} /> : <Globe size={24} />}
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {url.name} ({url.type === "youtube" ? "YouTube" : "Website"})
                    </h2>
                    <p className="text-sm">{url.link}</p>
                  </div>
                </div>
                <div
                  className="hover:bg-neutral-600 transition-colors duration-200 p-1 rounded cursor-pointer"
                  onClick={() => handleDeleteUrlFromClient(url.name)}
                >
                  <Trash2 size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeTool;