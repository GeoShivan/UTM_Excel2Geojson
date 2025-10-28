
import React from 'react';

interface ResultPanelProps {
    geojson: object | null;
    isLoading: boolean;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const ResultPanel: React.FC<ResultPanelProps> = ({ geojson, isLoading }) => {
    
    const handleDownload = () => {
        if (!geojson) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "converted_data.geojson");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const geojsonString = geojson ? JSON.stringify(geojson, null, 2) : '';
    const previewString = geojsonString.length > 1000 ? geojsonString.substring(0, 1000) + '...' : geojsonString;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">2. Get Result</h3>
            
            <div className="w-full h-64 md:h-full p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 dark:text-slate-400">Waiting for conversion...</p>
                    </div>
                )}
                {!isLoading && !geojson && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 dark:text-slate-400">Your GeoJSON result will appear here.</p>
                    </div>
                )}
                {geojson && (
                    <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all">
                        <code>{previewString}</code>
                    </pre>
                )}
            </div>

            <button
                onClick={handleDownload}
                disabled={!geojson || isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
            >
                <DownloadIcon />
                Download GeoJSON
            </button>
        </div>
    );
};
