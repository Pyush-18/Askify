"use client";

import axios from "axios";
import { File, Send, Share, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const checkPrevFiles = (webName) => {
  const prevFiles = JSON.parse(localStorage.getItem("files"));
  if (prevFiles && prevFiles.length > 0) {
    const filePresent = prevFiles.some((url) => url.name === webName);
    console.log(filePresent);
    return filePresent;
  }
};

function FileUpload() {
  const inputRef = useRef();
  const [userFiles, setUserFiles] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const handleFiles = async (e) => {
    e.preventDefault();
    const files = e.target.files[0];

    if (files === undefined) {
      toast.error("Please select a file");
      return;
    }
    if (userFiles.length >= 0 && userFiles.length < 2) {
      setUserFiles((prevFiles) => [...prevFiles, files]);
    } else {
      toast.error("Only 2 files are allowed");
    }
  };
  console.log('userFiles', userFiles)

  const handleDeleteFilesFromClient = (fileName) => {
    const filteredFiles = userFiles.filter((file) => file.name !== fileName);
    setUserFiles(filteredFiles);
  };




  async function indexFiles() {
    const formData = new FormData();
    userFiles.forEach((files) => {
      formData.append("files", files);
    });
    setIsIndexing(true);
    try {
      const response = await axios.post("/api/rag-index", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setIsIndexing(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          File Upload
        </h1>
        <p className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          {userFiles.length}/2
        </p>
      </div>
      <div className="p-3 bg-[#1a1a3a]/80 max-w-[24rem] rounded-xl">
        <div className="bg-[#2a2a5a]/60 max-w-full p-10 rounded-lg border-2 border-dashed border-gray-600">
          <div
            onClick={() => inputRef.current.click()}
            className="flex flex-col justify-center gap-4 items-center cursor-pointer"
          >
            <Share className="text-white" size={24} />
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              onChange={handleFiles}
              name="upload-pdf"
              id="pdf"
              accept=".pdf"
            />
            <span className="text-center text-sm text-white">
              Drag & drop pdf to upload
              <p className="font-bold underline text-sky-300">or Browse</p>
            </span>
          </div>
        </div>

        <div className="text-white flex flex-col mt-2 ">
          {userFiles.length > 0 &&
            userFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 hover:bg-[#2a2a5a]/70 rounded-lg duration-200 transition-colors "
              >
                <div className="flex items-center gap-2">
                  <File className="text-sky-400" size={18} />
                  <p className="text-gray-100 font-semibold">{file.name}</p>
                </div>
                <div
                  className="p-1 rounded cursor-pointer"
                  onClick={() => handleDeleteFilesFromClient(file.name)}
                >
                  <Trash2
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                    size={18}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-3 flex justify-end" onClick={indexFiles}>
          {isIndexing ? (
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
            <button className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 px-3 py-1 rounded-lg flex items-center gap-2 drop-shadow-lg text-white">
              <Send size={16} />
              send
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default FileUpload;
