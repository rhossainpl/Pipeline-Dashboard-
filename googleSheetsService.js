const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration file path
const CONFIG_FILE = path.join(__dirname, 'config', 'sheets-config.json');

// Ensure config directory exists
async function ensureConfigDirectory() {
    const configDir = path.join(__dirname, 'config');
    try {
        await fs.access(configDir);
    } catch {
        await fs.mkdir(configDir, { recursive: true });
    }
}

// Load configuration
async function loadConfig() {
    try {
        await ensureConfigDirectory();
        const configData = await fs.readFile(CONFIG_FILE, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        return null;
    }
}

// Save configuration
async function saveConfig(config) {
    await ensureConfigDirectory();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Initialize Google Sheets API
async function getSheetsClient() {
    const config = await loadConfig();
    
    if (!config || !config.spreadsheetId) {
        throw new Error('Google Sheets not configured. Please set up your spreadsheet ID.');
    }

    // For service account authentication
    if (config.serviceAccountKey) {
        const auth = new google.auth.GoogleAuth({
            credentials: config.serviceAccountKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        const sheets = google.sheets({ version: 'v4', auth });
        return { sheets, spreadsheetId: config.spreadsheetId, sheetName: config.sheetName || 'Projects' };
    }
    
    // For API key authentication (read-only, or with write permissions if configured)
    if (config.apiKey) {
        const auth = new google.auth.GoogleAuth({
            apiKey: config.apiKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        const sheets = google.sheets({ version: 'v4', auth });
        return { sheets, spreadsheetId: config.spreadsheetId, sheetName: config.sheetName || 'Projects' };
    }
    
    throw new Error('Google Sheets authentication not configured. Please set up service account or API key.');
}

// Convert project to row format
function projectToRow(project) {
    return [
        project.name || '',
        project.projectType || '',
        project.area || '',
        project.address || '',
        project.grades || '',
        project.program || '',
        project.likelihood || '',
        project.dependencies || '',
        project.details?.decisionsNeeded || '',
        project.details?.notes || '',
        JSON.stringify(project.details?.milestones || [])
    ];
}

// Convert row to project format
function rowToProject(row) {
    return {
        name: row[0] || '',
        projectType: row[1] || '',
        area: row[2] || '',
        address: row[3] || '',
        grades: row[4] || '',
        program: row[5] || '',
        likelihood: row[6] || '',
        dependencies: row[7] || '',
        details: {
            decisionsNeeded: row[8] || '',
            notes: row[9] || '',
            milestones: (() => {
                try {
                    return row[10] ? JSON.parse(row[10]) : [];
                } catch {
                    return [];
                }
            })()
        }
    };
}

// Read all projects from Google Sheets
async function readFromSheets() {
    try {
        const { sheets, spreadsheetId, sheetName } = await getSheetsClient();
        
        // First, check if sheet exists, if not create it
        try {
            await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A1:K1`,
            });
        } catch (error) {
            // Sheet might not exist, create it with headers
            await createSheetWithHeaders(sheets, spreadsheetId, sheetName);
        }
        
        // Read all data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A2:K1000`, // Read up to 1000 rows
        });
        
        const rows = response.data.values || [];
        return rows.map(row => rowToProject(row));
    } catch (error) {
        console.error('Error reading from Google Sheets:', error.message);
        throw error;
    }
}

// Write all projects to Google Sheets
async function writeToSheets(projects) {
    try {
        const { sheets, spreadsheetId, sheetName } = await getSheetsClient();
        
        // Ensure sheet exists with headers
        await createSheetWithHeaders(sheets, spreadsheetId, sheetName);
        
        // Convert projects to rows
        const rows = projects.map(projectToRow);
        
        // Clear existing data (except headers)
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `${sheetName}!A2:K1000`,
        });
        
        // Write new data
        if (rows.length > 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A2`,
                valueInputOption: 'RAW',
                resource: {
                    values: rows,
                },
            });
        }
        
        return true;
    } catch (error) {
        console.error('Error writing to Google Sheets:', error.message);
        throw error;
    }
}

// Create sheet with headers if it doesn't exist
async function createSheetWithHeaders(sheets, spreadsheetId, sheetName) {
    try {
        // Try to get sheet metadata
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId,
        });
        
        const sheetExists = spreadsheet.data.sheets.some(
            sheet => sheet.properties.title === sheetName
        );
        
        if (!sheetExists) {
            // Create new sheet
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: sheetName,
                            },
                        },
                    }],
                },
            });
        }
        
        // Set headers
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:K1`,
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    'Name',
                    'Project Type',
                    'Area',
                    'Address',
                    'Grades',
                    'Program',
                    'Likelihood',
                    'Dependencies',
                    'Decisions Needed',
                    'Notes',
                    'Milestones'
                ]],
            },
        });
        
        // Format headers (bold)
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [{
                    repeatCell: {
                        range: {
                            sheetId: spreadsheet.data.sheets.find(s => s.properties.title === sheetName).properties.sheetId,
                            startRowIndex: 0,
                            endRowIndex: 1,
                        },
                        cell: {
                            userEnteredFormat: {
                                textFormat: {
                                    bold: true,
                                },
                                backgroundColor: {
                                    red: 0.9,
                                    green: 0.9,
                                    blue: 0.9,
                                },
                            },
                        },
                        fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor',
                    },
                }],
            },
        });
    } catch (error) {
        // If sheet already exists, just set headers
        try {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A1:K1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[
                        'Name',
                        'Project Type',
                        'Area',
                        'Address',
                        'Grades',
                        'Program',
                        'Likelihood',
                        'Dependencies',
                        'Decisions Needed',
                        'Notes',
                        'Milestones'
                    ]],
                },
            });
        } catch (e) {
            console.error('Error setting headers:', e.message);
        }
    }
}

// Sync from Google Sheets to local
async function syncFromSheets() {
    try {
        const projects = await readFromSheets();
        return projects;
    } catch (error) {
        throw new Error(`Failed to sync from Google Sheets: ${error.message}`);
    }
}

// Sync from local to Google Sheets
async function syncToSheets(projects) {
    try {
        await writeToSheets(projects);
        return true;
    } catch (error) {
        throw new Error(`Failed to sync to Google Sheets: ${error.message}`);
    }
}

// Check if Google Sheets is configured
async function isConfigured() {
    const config = await loadConfig();
    return config && (config.serviceAccountKey || config.apiKey) && config.spreadsheetId;
}

module.exports = {
    loadConfig,
    saveConfig,
    syncFromSheets,
    syncToSheets,
    isConfigured,
    readFromSheets,
    writeToSheets,
};

