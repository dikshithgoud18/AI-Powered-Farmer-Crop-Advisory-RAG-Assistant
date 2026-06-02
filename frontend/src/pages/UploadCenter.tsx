import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';

const UploadCenter = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setFiles([]);
        alert("Documents uploaded and vectorized successfully!");
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Document Upload Center</h1>
        <p className="text-gray-400">Add agricultural guidelines, pest control manuals, or soil health reports to the RAG knowledge base.</p>
      </motion.div>

      <GlassCard className="relative overflow-hidden">
        <form 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
            dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#10b981]/30 bg-[#10b981]/5'
          }`}
        >
          <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => {
            if(e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
          }} />
          <UploadCloud size={48} className={`mb-4 ${dragActive ? 'text-emerald-400' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-white mb-2">Drag and drop your documents here</p>
          <p className="text-sm text-gray-400 mb-4">Support for PDF, DOCX, and TXT files</p>
          <label htmlFor="file-upload" className="cursor-pointer px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
            Browse Files
          </label>
        </form>
      </GlassCard>

      {files.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Files to Upload ({files.length})</h3>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>Processing...</>
              ) : (
                <>Start Ingestion <CheckCircle2 size={18} /></>
              )}
            </button>
          </div>
          <div className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <File size={20} className="text-emerald-400" />
                  <span className="font-medium text-sm">{file.name}</span>
                </div>
                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-400">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UploadCenter;
