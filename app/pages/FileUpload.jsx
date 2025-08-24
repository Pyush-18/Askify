"use client";

import { File, Send, Share, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const handleFiles = (e) => {
    e.preventDefault();
    const files = e.target.files[0];
    console.log(files);
    if(files === undefined) {
      toast.error("Please select a file");
      return
    }
    if (userFiles.length >= 0 && userFiles.length < 2) {
      setUserFiles((prevFiles) => [...prevFiles, files]);
    } else {
      toast.error("Only 2 files are allowed");
    }
  };

  const handleDeleteFilesFromClient = (fileName) => {
    const filteredFiles = userFiles.filter((file) => file.name !== fileName);
    setUserFiles(filteredFiles);
  };

  useEffect(() => {
    console.log(userFiles);
  }, [userFiles]);

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
      <div className="p-3 bg-neutral-100 max-w-[24rem] rounded-xl">
        <div className="bg-zinc-200  max-w-full p-10 rounded-lg border border-dashed border-black">
          <div
            onClick={() => inputRef.current.click()}
            className="flex flex-col justify-center gap-4 items-center cursor-pointer"
          >
            <Share className="text-neutral-700" size={24} />
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              onChange={handleFiles}
              name="upload-pdf"
              id="pdf"
              accept=".pdf"
            />
            <span className="text-center text-sm text-neutral-700">
              Drag & drop pdf to upload
              <p className="font-bold underline">or Browse</p>
            </span>
          </div>
        </div>

        <div className="text-black flex flex-col mt-2 ">
          {userFiles.length > 0 &&
            userFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 hover:bg-zinc-300 rounded-lg duration-200 transition-colors "
              >
                <div className="flex items-center gap-2">
                  <File className="text-zinc-600" size={18} />
                  <p className="text-zinc-950 font-semibold">{file.name}</p>
                </div>
                <div
                  className=" p-1 rounded cursor-pointer"
                  onClick={() => handleDeleteFilesFromClient(file.name)}
                >
                  <Trash2 className="text-zinc-600 hover:text-red-600 transition-colors duration-200" size={18} />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-3 flex justify-end">
          <button className="bg-black hover:bg-black/85 px-3 py-1 rounded-lg flex items-center gap-2 drop-shadow-lg">
            <Send size={16} />
            send
          </button>
        </div>
      </div>
    </>
  );
}

export default FileUpload;
