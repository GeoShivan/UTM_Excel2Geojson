
import React, { useState, useCallback } from 'react';
import type { SheetData } from '../types';
import { createGeoJSON } from '../services/conversionService';
import { Loader } from './Loader';

interface ConfigPanelProps {
    sheetData: SheetData;
    onConversionResult: (geojson: object | null) => void;
    onError: (error: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    isLoading: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ sheetData, onConversionResult, onError, setIsLoading, isLoading }) => {
    const [utmZone, setUtmZone] = useState<string>('10');
    const [isNorth, setIsNorth] = useState<boolean>(true);
    const [eastingCol, setEastingCol] = useState<string>(sheetData.headers[0] || '');
    const [northingCol, setNorthingCol] = useState<string>(sheetData.headers[1] || '');

    const handleConvert = useCallback(async () => {
        setIsLoading(true);
        onError(null);
        onConversionResult(null);
        
        const zone = parseInt(utmZone, 10);
        if (isNaN(zone) || zone < 1 || zone > 60) {
            onError("UTM Zone must be a number between 1 and 60.");
            setIsLoading(false);
            return;
        }

        if (!eastingCol || !northingCol) {
            onError("Please select columns for both Easting and Northing.");
            setIsLoading(false);
            return;
        }

        if (eastingCol === northingCol) {
            onError("Easting and Northing columns cannot be the same.");
            setIsLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 50)); // Short delay for UI update
            const result = createGeoJSON(sheetData, eastingCol, northingCol, zone, isNorth);
            onConversionResult(result);
        } catch (err) {
            onError(err instanceof Error ? err.message : "An unknown conversion error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [sheetData, utmZone, isNorth, eastingCol, northingCol, setIsLoading, onError, onConversionResult]);
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">1. Configure Conversion</h3>
            
            {/* UTM Zone and Hemisphere */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="utm-zone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">UTM Zone</label>
                    <input 
                        type="number"
                        id="utm-zone"
                        value={utmZone}
                        onChange={(e) => setUtmZone(e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="1-60"
                        min="1"
                        max="60"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Hemisphere</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                         <button 
                            type="button"
                            onClick={() => setIsNorth(true)}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-l-md w-full transition-colors ${isNorth ? 'bg-indigo-600 text-white z-10 ring-1 ring-indigo-600' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            North
                         </button>
                         <button 
                            type="button"
                            onClick={() => setIsNorth(false)}
                            disabled={isLoading}
                            className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-md w-full transition-colors ${!isNorth ? 'bg-indigo-600 text-white z-10 ring-1 ring-indigo-600' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            South
                         </button>
                    </div>
                </div>
            </div>

            {/* Column Mapping */}
            <div>
                <label htmlFor="easting-col" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Easting Column</label>
                <select 
                    id="easting-col" 
                    value={eastingCol} 
                    onChange={e => setEastingCol(e.target.value)} 
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {sheetData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="northing-col" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Northing Column</label>
                <select 
                    id="northing-col" 
                    value={northingCol} 
                    onChange={e => setNorthingCol(e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {sheetData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
            </div>
            
            {/* Convert Button */}
            <div className="pt-2">
                <button
                    onClick={handleConvert}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <><Loader /> Converting...</> : 'Convert to GeoJSON'}
                </button>
            </div>
        </div>
    );
};
