
import type { SheetData } from '../types';

export const parseExcel = (file: File): Promise<SheetData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = window.XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[][] = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                if (jsonData.length < 2) {
                    return reject(new Error("Excel file is empty or has only a header row."));
                }
                
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                
                resolve({ headers, rows });
            } catch (error) {
                reject(new Error("Failed to parse the Excel file. Please ensure it's a valid format."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

export const createGeoJSON = (sheetData: SheetData, eastingCol: string, northingCol: string, zone: number, isNorth: boolean) => {
    const { headers, rows } = sheetData;
    const eastingIndex = headers.indexOf(eastingCol);
    const northingIndex = headers.indexOf(northingCol);

    if (eastingIndex === -1 || northingIndex === -1) {
        throw new Error("Selected Easting or Northing column not found.");
    }

    const projString = `+proj=utm +zone=${zone} ${!isNorth ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
    const wgs84String = '+proj=longlat +datum=WGS84 +no_defs';
    
    const features = rows.map((row, index) => {
        const easting = parseFloat(row[eastingIndex]);
        const northing = parseFloat(row[northingIndex]);

        if (isNaN(easting) || isNaN(northing)) {
            console.warn(`Skipping row ${index + 2} due to invalid coordinates.`);
            return null;
        }

        try {
            const [longitude, latitude] = window.proj4(projString, wgs84String, [easting, northing]);

            const properties = headers.reduce((obj: Record<string, any>, header, i) => {
                obj[header] = row[i];
                return obj;
            }, {});

            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                properties
            };
        } catch(e) {
            console.error(`Error converting row ${index + 2}:`, e);
            return null;
        }
    }).filter(Boolean); // Filter out null values from failed conversions

    if (features.length === 0 && rows.length > 0) {
        throw new Error("Conversion failed for all rows. Please check if the UTM zone and hemisphere are correct and the coordinate columns contain valid numbers.");
    }
    
    return {
        type: 'FeatureCollection',
        features
    };
};
