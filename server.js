const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const sheetsService = require('./googleSheetsService');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'projects.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Initialize with default data if file doesn't exist
    try {
        await fs.access(DATA_FILE);
    } catch {
        const defaultData = [
            {
                name: "Nuestro, CA Partnership",
                projectType: "Virtual District Ptnr",
                area: "Nuestro, CA",
                address: "",
                grades: "K-8",
                program: "VPA",
                likelihood: "High",
                dependencies: "Finalize Services Agreement",
                details: {
                    decisionsNeeded: "Board approval of the final services agreement.",
                    notes: "The superintendent wants to start in fall 2026. The plan is to get everything approved by the district board in early January so student recruitment efforts could start in February/March.",
                    milestones: [
                        { name: "Finalize Services Agreement", status: "In Progress" },
                        { name: "Board Approval of Services Agreement", status: "Pending" }
                    ]
                }
            },
            {
                name: "Jefferson Classical Academy of Florida at DeSoto County",
                projectType: "Virtual District Ptnr",
                area: "DeSoto, FL",
                address: "",
                grades: "K-6 (expanding to K-8)",
                program: "Classical",
                likelihood: "Launching",
                dependencies: "Final Pre-Launch Tasks",
                details: {
                    decisionsNeeded: "Board approval for K-8 expansion for Fall 2026.",
                    notes: "Existing K-6 partnership looking to expand.",
                    milestones: [
                        { name: "Finalize Services Agreement", status: "Complete" },
                        { name: "Launch Kickoff", status: "Scheduled" }
                    ]
                }
            },
            {
                name: "Fort Dodge, IA Partnership",
                projectType: "Virtual District Ptnr",
                area: "Fort Dodge, IA",
                address: "",
                grades: "K-8",
                program: "VPA",
                likelihood: "Medium",
                dependencies: "Finalize Services Agreement",
                details: {
                    decisionsNeeded: "Board approval of the final services agreement.",
                    notes: "Evaluating potential to expand grade levels based on district needs.",
                    milestones: [
                        { name: "Finalize Services Agreement", status: "In Progress" },
                        { name: "Board Approval of Services Agreement", status: "Pending" }
                    ]
                }
            },
            {
                name: "Vallecitos, CA Partnership",
                projectType: "Virtual District Ptnr",
                area: "Vallecitos, CA",
                address: "",
                grades: "K-8",
                program: "AMP Services to K-8 (VPA)",
                likelihood: "Medium",
                dependencies: "Finalize Services Agreement",
                details: {
                    decisionsNeeded: "Board approval of the final services agreement.",
                    notes: "Stable K-8 partnership, expected to remain K-8 in future years. Potential AMP Services Agreement by Jan 26', K-8 Services Agreement in July 26'.",
                    milestones: [
                        { name: "Finalize Services Agreement", status: "In Progress" },
                        { name: "Board Approval of Services Agreement", status: "Pending" }
                    ]
                }
            },
            {
                name: "Buckeye Elite Sports Academy",
                projectType: "New B&M",
                area: "Columbus, OH",
                address: "1216 Sunbury Rd, Columbus, OH 43219",
                grades: "K-11",
                program: "Elite Sports",
                likelihood: "Medium",
                dependencies: "BondHolder Offer Approval",
                details: {
                    decisionsNeeded: "Approval of offer from BondHolders.",
                    notes: "Former Ohio Dominican University property identified. Approval timeline is December.",
                    milestones: [
                        { name: "Site Identification", status: "Complete" },
                        { name: "Offer Approval", status: "In Progress" }
                    ]
                }
            },
            {
                name: "Capital City Classical",
                projectType: "New B&M",
                area: "NW Columbus, OH",
                address: "Site Selection in Progress",
                grades: "K-8",
                program: "Classical",
                likelihood: "Low",
                dependencies: "Site Selection",
                details: {
                    decisionsNeeded: "Define search radius and approve final site.",
                    notes: "Focusing search on the Northwest Columbus area.",
                    milestones: [
                        { name: "Site Selection", status: "In Progress" },
                        { name: "Community Engagement", status: "Pending" }
                    ]
                }
            },
            {
                name: "Mount Vernon Project",
                projectType: "New B&M",
                area: "Mt Vernon, OH",
                address: "Site Selection in Progress",
                grades: "K-8",
                program: "Traditional",
                likelihood: "Low",
                dependencies: "Site Selection",
                details: {
                    decisionsNeeded: "Approve final site.",
                    notes: "Initial planning and site search underway.",
                    milestones: [
                        { name: "Site Selection", status: "In Progress" }
                    ]
                }
            },
            {
                name: "STEAM Academy of Portsmouth",
                projectType: "New B&M",
                area: "Portsmouth, OH",
                address: "5810 Harding Ave, Portsmouth, OH 45662",
                grades: "K-12",
                program: "STEAM",
                likelihood: "Medium",
                dependencies: "Property Takeover Negotiation",
                details: {
                    decisionsNeeded: "Go/No-Go on property takeover based on due diligence.",
                    notes: "Potential takeover of property from Sciotoville Elementary Academy - ES & MS/HS Facilities.",
                    milestones: [
                        { name: "Due Diligence", status: "In Progress" },
                        { name: "Negotiation", status: "Pending" }
                    ]
                }
            },
            {
                name: "Columbus Career Academy",
                projectType: "New B&M",
                area: "Columbus, OH",
                address: "Searching for Admin Hub + Flex/Warehouse",
                grades: "9-12",
                program: "Dropout Recovery",
                likelihood: "Medium",
                dependencies: "Site Selection",
                details: {
                    decisionsNeeded: "Site selection approval for Admin Hub & Flex Space.",
                    notes: "Dual space requirement (Admin + Trades) is a key search criterion.",
                    milestones: [
                        { name: "Site Selection", status: "In Progress" },
                        { name: "Lease Negotiation", status: "Pending" }
                    ]
                }
            },
            {
                name: "Cleveland Career Academy",
                projectType: "New B&M",
                area: "Cleveland, OH",
                address: "Searching for Admin Hub + Flex/Warehouse",
                grades: "9-12",
                program: "Dropout Recovery",
                likelihood: "Medium",
                dependencies: "Site Selection",
                details: {
                    decisionsNeeded: "Site selection approval for Admin Hub & Flex Space.",
                    notes: "Parallel project to the Columbus Career Academy with similar needs.",
                    milestones: [
                        { name: "Site Selection", status: "In Progress" },
                        { name: "Lease Negotiation", status: "Pending" }
                    ]
                }
            },
            {
                name: "STEAM Academy of Ravenna",
                projectType: "New B&M",
                area: "Ravenna, OH",
                address: "1071 Jones Ave, Ravenna, 44266",
                grades: "K-8",
                program: "STEAM",
                likelihood: "High",
                dependencies: "Building Sale Closing (Nov)",
                details: {
                    decisionsNeeded: "Approval for pre-launch budget after closing in November.",
                    notes: "Building secured. Capacity: 308, 15 classrooms. Pre-launch activities can begin after the building sale closes in November.",
                    milestones: [
                        { name: "Building Acquisition", status: "In Progress" },
                        { name: "Pre-Launch Kickoff", status: "Pending" }
                    ]
                }
            },
            {
                name: "Russell Primary Sports Academy",
                projectType: "New B&M",
                area: "Cleveland, OH",
                address: "3121 Euclid Ave Suite 100",
                grades: "Pre-K-5",
                program: "Sports",
                likelihood: "High",
                dependencies: "None",
                details: {
                    decisionsNeeded: "None. Ready for pre-launch.",
                    notes: "First floor of 3121 Euclid Ave confirmed. Ready to begin pre-launch phase.",
                    milestones: [
                        { name: "Facility Confirmation", status: "Complete" },
                        { name: "Pre-Launch Kickoff", status: "Pending" }
                    ]
                }
            },
            {
                name: "Mosaic Classical Academy",
                projectType: "Relocation",
                area: "Toledo, OH",
                address: "Potential: 1799 Rivard Rd, Toledo, OH 43615",
                grades: "K-2",
                program: "Classical",
                likelihood: "High",
                dependencies: "Offer Acceptance",
                details: {
                    decisionsNeeded: "Decision on next steps if offer for TSD property is not accepted.",
                    notes: "Offer extended for TSD property offered to Charter Schools. Awaiting acceptance.",
                    milestones: [
                        { name: "Offer Acceptance", status: "In Progress" },
                        { name: "Lease Negotiation", status: "Pending" }
                    ]
                }
            },
            {
                name: "University of Cleveland Prep",
                projectType: "Relocation",
                area: "Cleveland, OH",
                address: "Site selection in progress",
                grades: "K-8",
                program: "Traditional",
                likelihood: "High",
                dependencies: "New Site Approval",
                details: {
                    decisionsNeeded: "Approval of new site from shortlist.",
                    notes: "Current lease expiring at end of year, making site selection time-sensitive.",
                    milestones: [
                        { name: "New Site Search", status: "In Progress" },
                        { name: "Lease Negotiation", status: "Pending" }
                    ]
                }
            },
            {
                name: "Sagewood Preparatory Academy",
                projectType: "Rebranding",
                area: "Columbus, OH",
                address: "2255 Kimberly Pkwy E, Columbus, OH 43232",
                grades: "K-8",
                program: "STEAM",
                likelihood: "High",
                dependencies: "Board Approval of Rebrand",
                details: {
                    decisionsNeeded: "Board approval for new brand.",
                    notes: "Rebranding proposal to become 'Columbus STEAM Academy'.",
                    milestones: [
                        { name: "Brand Strategy", status: "Complete" },
                        { name: "Board Approval", status: "Pending" }
                    ]
                }
            },
            {
                name: "The Wayfinder Academy",
                projectType: "Rebranding",
                area: "Cincinnati, OH",
                address: "Building Ready",
                grades: "K-8 (YR1 K-5)",
                program: "Traditional",
                likelihood: "High",
                dependencies: "Board Approval",
                details: {
                    decisionsNeeded: "Obtain Board Approval for North Bend STEAM Academy.",
                    notes: "Building is ready and project can move to pre-launch once the name is finalized. Proposed new name: 'North Bend STEM Academy'.",
                    milestones: [
                        { name: "Name Confirmation", status: "Complete" },
                        { name: "Pre-Launch Kickoff", status: "Pending" }
                    ]
                }
            },
            {
                name: "Capital Collegiate Preparatory Academy",
                projectType: "Offboard",
                area: "Columbus, OH",
                address: "1414 Gault St, Columbus, OH 43205",
                grades: "K-8",
                program: "Traditional",
                likelihood: "High",
                dependencies: "Final Offboarding Decision",
                details: {
                    decisionsNeeded: "Final go/no-go decision on offboarding.",
                    notes: "Lease/Charter expiring EOY. Facing financial, academic, and board relationship challenges. Offboarding is expected but not yet final.",
                    milestones: [
                        { name: "Board Review", status: "In Progress" },
                        { name: "Final Decision", status: "Pending" }
                    ]
                }
            }
        ];
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// Read all projects
app.get('/api/projects', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        res.json(projects);
    } catch (error) {
        console.error('Error reading projects:', error);
        res.status(500).json({ error: 'Failed to read projects' });
    }
});

// Get single project by index
app.get('/api/projects/:index', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        const index = parseInt(req.params.index);
        
        if (index >= 0 && index < projects.length) {
            res.json(projects[index]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error reading project:', error);
        res.status(500).json({ error: 'Failed to read project' });
    }
});

// Create new project
app.post('/api/projects', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        
        const newProject = {
            name: req.body.name || "New Project",
            projectType: req.body.projectType || "New B&M",
            area: req.body.area || "",
            address: req.body.address || "",
            grades: req.body.grades || "",
            program: req.body.program || "",
            likelihood: req.body.likelihood || "Medium",
            dependencies: req.body.dependencies || "",
            details: {
                decisionsNeeded: req.body.details?.decisionsNeeded || "",
                notes: req.body.details?.notes || "",
                milestones: req.body.details?.milestones || []
            }
        };
        
        projects.push(newProject);
        await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
        
        // Sync to Google Sheets if configured
        await syncToSheetsIfConfigured(projects);
        
        res.json({ success: true, project: newProject, index: projects.length - 1 });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
app.put('/api/projects/:index', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        const index = parseInt(req.params.index);
        
        if (index >= 0 && index < projects.length) {
            projects[index] = {
                ...projects[index],
                ...req.body,
                details: {
                    ...projects[index].details,
                    ...req.body.details
                }
            };
            
            await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
            
            // Sync to Google Sheets if configured
            await syncToSheetsIfConfigured(projects);
            
            res.json({ success: true, project: projects[index] });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
app.delete('/api/projects/:index', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        const index = parseInt(req.params.index);
        
        if (index >= 0 && index < projects.length) {
            projects.splice(index, 1);
            await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
            
            // Sync to Google Sheets if configured
            try {
                if (await sheetsService.isConfigured()) {
                    await sheetsService.syncToSheets(projects);
                }
            } catch (syncError) {
                console.error('Google Sheets sync error (non-critical):', syncError.message);
            }
            
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Helper function to sync to Google Sheets
async function syncToSheetsIfConfigured(projects) {
    try {
        if (await sheetsService.isConfigured()) {
            await sheetsService.syncToSheets(projects);
        }
    } catch (error) {
        console.error('Google Sheets sync error (non-critical):', error.message);
    }
}

// Google Sheets Configuration Endpoints
app.get('/api/sheets/config', async (req, res) => {
    try {
        const config = await sheetsService.loadConfig();
        const isConfigured = await sheetsService.isConfigured();
        res.json({ 
            configured: isConfigured,
            hasSpreadsheetId: !!(config && config.spreadsheetId),
            hasAuth: !!(config && (config.serviceAccountKey || config.apiKey)),
            sheetName: config?.sheetName || 'Projects'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load config' });
    }
});

app.post('/api/sheets/config', async (req, res) => {
    try {
        const { spreadsheetId, sheetName, serviceAccountKey, apiKey } = req.body;
        
        if (!spreadsheetId) {
            return res.status(400).json({ error: 'Spreadsheet ID is required' });
        }
        
        const config = {
            spreadsheetId,
            sheetName: sheetName || 'Projects',
        };
        
        if (serviceAccountKey) {
            config.serviceAccountKey = serviceAccountKey;
        } else if (apiKey) {
            config.apiKey = apiKey;
        } else {
            return res.status(400).json({ error: 'Either service account key or API key is required' });
        }
        
        await sheetsService.saveConfig(config);
        res.json({ success: true, message: 'Google Sheets configuration saved' });
    } catch (error) {
        console.error('Error saving config:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
});

// Sync from Google Sheets
app.post('/api/sheets/sync-from', async (req, res) => {
    try {
        if (!(await sheetsService.isConfigured())) {
            return res.status(400).json({ error: 'Google Sheets not configured' });
        }
        
        const projects = await sheetsService.syncFromSheets();
        await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
        res.json({ success: true, projects, message: `Synced ${projects.length} projects from Google Sheets` });
    } catch (error) {
        console.error('Error syncing from Google Sheets:', error);
        res.status(500).json({ error: error.message || 'Failed to sync from Google Sheets' });
    }
});

// Sync to Google Sheets
app.post('/api/sheets/sync-to', async (req, res) => {
    try {
        if (!(await sheetsService.isConfigured())) {
            return res.status(400).json({ error: 'Google Sheets not configured' });
        }
        
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const projects = JSON.parse(data);
        await sheetsService.syncToSheets(projects);
        res.json({ success: true, message: `Synced ${projects.length} projects to Google Sheets` });
    } catch (error) {
        console.error('Error syncing to Google Sheets:', error);
        res.status(500).json({ error: error.message || 'Failed to sync to Google Sheets' });
    }
});

// Start server
async function startServer() {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
        console.log(`\n🚀 School Launch Dashboard Server running!`);
        console.log(`📊 Dashboard available at: http://localhost:${PORT}`);
        console.log(`📡 API available at: http://localhost:${PORT}/api/projects\n`);
    });
}

startServer();


