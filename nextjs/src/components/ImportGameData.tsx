import React, { useState } from "react";

const ImportGameData: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      console.log("Accepted files:", Array.from(e.target.files));
    }
  };

  return (
    <div>
      <label
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#6366f1",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Import Folder
        <input
          type="file"
          // @ts-ignore
          webkitdirectory=""
          multiple
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </label>
      {files.length > 0 && (
        <ul>
          {files.map((file) => (
            <li key={file.webkitRelativePath || file.name}>{file.webkitRelativePath || file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImportGameData;