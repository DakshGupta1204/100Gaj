"use client";
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Download, Eye } from 'lucide-react';
export default function DocumentManager() {
    const [docs, setDocs] = useState([]);
    const fileInputRef = useRef(null);
    const maxDocs = 5;
    const handleUpload = (e) => {
        const files = e.target.files;
        if (!files)
            return;
        const newDocs = [];
        for (let i = 0; i < files.length && docs.length + newDocs.length < maxDocs; i++) {
            const file = files[i];
            if (file.type === 'application/pdf') {
                newDocs.push({ name: file.name, file, url: URL.createObjectURL(file) });
            }
        }
        setDocs(prev => [...prev, ...newDocs].slice(0, maxDocs));
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const handleDelete = (name) => {
        setDocs(prev => prev.filter(doc => doc.name !== name));
    };
    const handleDownload = (doc) => {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        link.click();
    };
    const handlePreview = (doc) => {
        window.open(doc.url, '_blank');
    };
    return (<div className="bg-[#23232a] rounded-xl p-6 mt-8 shadow-lg">
      <h2 className="text-lg font-bold text-white mb-4">Document Manager</h2>
      <div className="mb-4">
        <input ref={fileInputRef} type="file" accept="application/pdf" multiple onChange={handleUpload} disabled={docs.length >= maxDocs} className="hidden" id="pdf-upload"/>
        <label htmlFor="pdf-upload">
          <Button className="bg-gradient-to-r from-orange-600 to-red-500 text-white" disabled={docs.length >= maxDocs}>
            Upload PDF{docs.length >= maxDocs ? ' (Limit reached)' : ''}
          </Button>
        </label>
      </div>
      <ul className="space-y-3">
        {docs.map(doc => (<li key={doc.name} className="flex items-center justify-between bg-[#181c24] rounded-lg px-4 py-2">
            <span className="text-white text-sm truncate max-w-xs">{doc.name}</span>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => handlePreview(doc)} title="Preview">
                <Eye className="w-4 h-4 text-orange-400"/>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} title="Download">
                <Download className="w-4 h-4 text-orange-400"/>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(doc.name)} title="Delete">
                <Trash className="w-4 h-4 text-red-500"/>
              </Button>
            </div>
          </li>))}
        {docs.length === 0 && <li className="text-gray-400 text-sm">No documents uploaded yet.</li>}
      </ul>
      <p className="text-xs text-gray-500 mt-2">Max {maxDocs} PDFs allowed. (Secure access for verified tenants coming soon.)</p>
    </div>);
}
