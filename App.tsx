
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultPanel } from './components/ResultPanel';
import { GeminiHelp } from './components/GeminiHelp';
import { parseExcel } from './services/conversionService';
import { getExplanation } from './services/geminiService';
import type { SheetData } from './types';

// Declare XLSX and proj4 to be available on the window object
declare global {
    interface Window {
        XLSX: any;
        proj4: any;
    }
}

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [sheetData, setSheetData] = useState<SheetData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [geojson, setGeojson] = useState<object | null>(null);
    const [aiHelpResponse, setAiHelpResponse] = useState<string>('');

    const handleFileSelect = useCallback(async (selectedFile: File) => {
        setIsLoading(true);
        setError(null);
        setSheetData(null);
        setGeojson(null);
        setFile(selectedFile);
        try {
            const data = await parseExcel(selectedFile);
            if(data.headers.length < 2) {
                throw new Error("The Excel file must contain at least two columns for Easting and Northing.");
            }
            setSheetData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while parsing the file.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleAskGemini = useCallback(async (prompt: string) => {
        setIsAiLoading(true);
        setAiHelpResponse('');
        try {
            const response = await getExplanation(prompt);
            setAiHelpResponse(response);
        } catch (err) {
            setAiHelpResponse(err instanceof Error ? `Error: ${err.message}`: "An unknown error occurred.");
        } finally {
            setIsAiLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                    
                    {!file && <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />}
                    
                    {error && (
                        <div className="my-4 p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {file && !error && (
                         <div className="mb-4 text-center">
                            <p className="font-semibold text-indigo-600 dark:text-indigo-400">File Loaded:</p>
                            <p className="text-sm">{file.name}</p>
                        </div>
                    )}
                    
                    {sheetData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <ConfigPanel 
                                sheetData={sheetData} 
                                onConversionResult={setGeojson} 
                                onError={setError}
                                setIsLoading={setIsLoading}
                                isLoading={isLoading}
                            />
                            <ResultPanel geojson={geojson} isLoading={isLoading} />
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                      <GeminiHelp 
                        onAsk={handleAskGemini}
                        response={aiHelpResponse}
                        isLoading={isAiLoading}
                      />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
