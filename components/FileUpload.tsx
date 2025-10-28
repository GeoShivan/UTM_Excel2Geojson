
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

const UploadIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Upload Your Excel File</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Convert UTM coordinates to Latitude/Longitude and generate a GeoJSON file.</p>
            <label
                htmlFor="file-upload"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-300
                    ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
            >
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .xls, .csv" onChange={handleChange} disabled={isLoading} />
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Drag and drop a file or <span className="text-indigo-600 dark:text-indigo-400">click to upload</span>
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">XLSX, XLS, or CSV</span>
                {isLoading && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center rounded-lg"><p>Processing...</p></div>}
            </label>
        </div>
    );
};
