import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
        ${disabled
          ? 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed'
          : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 cursor-pointer group'
        }
      `}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv"
        className="hidden"
        id="file-upload"
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
        disabled={disabled}
      />
      <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-800 rounded-full group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Only .csv files are supported
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}
