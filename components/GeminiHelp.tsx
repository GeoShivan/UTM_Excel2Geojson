
import React, { useState } from 'react';
import { Loader } from './Loader';

interface GeminiHelpProps {
    onAsk: (prompt: string) => void;
    response: string;
    isLoading: boolean;
}

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.6-2.6L11.25 18l1.938-.648a3.375 3.375 0 002.6-2.6L16.25 13l.648 1.938a3.375 3.375 0 002.6 2.6l1.938.648-1.938.648a3.375 3.375 0 00-2.6 2.6z" />
    </svg>
);

export const GeminiHelp: React.FC<GeminiHelpProps> = ({ onAsk, response, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleAsk = () => {
        if (prompt.trim()) {
            onAsk(prompt);
        }
    };
    
    const quickAsk = (question: string) => {
        setPrompt(question);
        onAsk(question);
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                 <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-indigo-500" />
                    AI Assistant
                 </h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ask anything about UTM, GeoJSON, or coordinate systems.</p>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="e.g., What is GeoJSON?"
                    className="flex-grow block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={isLoading}
                />
                <button
                    onClick={handleAsk}
                    disabled={isLoading || !prompt.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader /> : 'Ask'}
                </button>
            </div>
             <div className="flex flex-wrap gap-2 text-xs justify-center">
                <button onClick={() => quickAsk("What is UTM?")} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">What is UTM?</button>
                <button onClick={() => quickAsk("Explain GeoJSON Point features.")} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Explain GeoJSON Points</button>
                <button onClick={() => quickAsk("UTM vs Lat/Lon?")} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">UTM vs Lat/Lon?</button>
            </div>

            {response && (
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 mt-4 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
                    {response}
                </div>
            )}
        </div>
    );
};
