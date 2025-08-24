"use client";

import { ArrowDownToDot, Globe, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const checkPrevUrl = (webName) => {
  const prevUrls = JSON.parse(localStorage.getItem("urls"));
  if (prevUrls) {
    const isPresent = prevUrls.some((url) =>
      url.name === webName
    );
    console.log(isPresent);
    return isPresent;
  }
};

function YoutubeTool() {
  const [urls, setUrls] = useState([]);
  const [urlData, setUrlData] = useState("");

  const addUrlOnClient = () => {
    if (!urlData && urlData.trim() === '') {
      toast.error(`Please enter a valid url`);
      return;
    }
    const url = new URL(urlData.trim());
    const parts = url.hostname.split(".");
    if (parts[0] === "www") {
      parts.shift();
    }
    // check if wheather the website is previously added or not
    const websiteName = parts[0];
    const isUrlPresent = checkPrevUrl(websiteName);
    if (isUrlPresent) {
      toast.error(`${websiteName} is already added`);
      return;
    }
    if (urls.length >= 0 && urls.length < 3) {
      setUrls((prevData) => [
        ...prevData,
        { name: parts[0], link: url.origin },
      ]);
      setUrlData("");
    } else {
      toast.error("Only 3 urls are allowed");
    }
  };

  const handleDeleteUrlFromClient = (urlName) => {
    const filteredUrls = urls.filter((url) => url.name !== urlName);
    setUrls(filteredUrls);
  };

  useEffect(() => {
    if (urls.length > 0 && urls) {
      localStorage.setItem("urls", JSON.stringify(urls));
    }
  }, [urls]);

  useEffect(() => {
    const prevUrls = JSON.parse(localStorage.getItem("urls"));
    if (prevUrls) {
      setUrls(prevUrls);
    }
  }, []);

  return (
    <div className="text-white mt-10 ">
      <div className="">
        <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          Youtube | Website url
        </h1>
        <input
          type="text"
          value={urlData}
          onChange={(e) => setUrlData(e.target.value)}
          placeholder="paste here..."
          className="bg-white/10 w-full px-3 py-2 rounded-lg"
        />
        <div className="mt-3 flex justify-end" onClick={addUrlOnClient}>
          <button className="bg-blue-600 hover:bg-blue-500/85 px-3 py-1 rounded-lg flex items-center gap-2 drop-shadow-lg">
            <ArrowDownToDot size={16} />
            Add
          </button>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold  bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Added Items
            </h1>
            <p className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              {urls.length}/3
            </p>
          </div>
          <div className="flex flex-col gap-2  max-h-[25vh] overflow-y-auto p-2">
            {urls.map((url, index) => (
              <div
                key={index}
                className="bg-white/10 w-full px-4 py-2 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <Globe size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{url.name}</h2>
                    <p className="text-sm ">{url.link}</p>
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
