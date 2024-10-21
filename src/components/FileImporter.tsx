import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface FileImporterProps {
  onImportComplete: (files: File[]) => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onImportComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleImport = () => {
    if (files.length > 0) {
      onImportComplete(files);
      setImportStatus('success');
    } else {
      setImportStatus('error');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Import Backup Files</h2>
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <Upload size={20} />
          <span>Select Files</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {files.length > 0 && (
        <div className="mb-4">
          <p>Selected files:</p>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleImport}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Import Files
      </button>
      {importStatus === 'success' && (
        <p className="mt-2 text-green-500 flex items-center">
          <CheckCircle size={16} className="mr-2" />
          Files imported successfully!
        </p>
      )}
      {importStatus === 'error' && (
        <p className="mt-2 text-red-500 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          Error importing files. Please try again.
        </p>
      )}
    </div>
  );
};

export default FileImporter;