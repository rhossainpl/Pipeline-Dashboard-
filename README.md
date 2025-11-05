# School Launch & Project Portfolio Dashboard

A standalone web application for managing school launch projects with a backend data storage system. All data is persisted locally in a JSON file and automatically updates the dashboard KPIs in real-time.

## Features

- 📊 **Dynamic Dashboard** - Real-time KPI tracking with filtering
- 💾 **Persistent Storage** - All data saved to backend automatically
- ✏️ **Edit Projects** - Click any project to view and edit details
- ➕ **Add Projects** - Create new projects from the dashboard
- 📥 **Import/Export** - CSV import/export functionality
- 🖨️ **Print View** - Print-friendly dashboard layout
- 📊 **Google Sheets Integration** - Sync data with Google Sheets automatically

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd school-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - The dashboard will automatically open at: `http://localhost:3000`
   - Or manually navigate to: `http://localhost:3000`

## Usage

### Viewing Projects

- Click on any project row in the table to view full details
- Use the filter tiles at the top to filter by likelihood status
- Use the project type buttons to filter by project type
- KPIs automatically update based on your data

### Editing Projects

1. Click on any project row to open the details modal
2. Click the "Edit" button
3. Make your changes
4. Click "Save Changes" - your data is automatically saved to the backend

### Adding New Projects

1. Click the "Add Project" button in the top right
2. Fill in the project details
3. Click "Save Changes" - the project is added and saved automatically

### Deleting Projects

1. Open a project in edit mode
2. Click the "Delete Project" button (red button)
3. Confirm the deletion

### Import/Export Data

- **Export**: Click "Export Data" to download a CSV file with all your projects
- **Import**: Click "Import Data", paste your CSV content, and click "Update Dashboard"

## Data Storage

All project data is stored in:
- `data/projects.json` - JSON file containing all projects

The data is automatically saved whenever you:
- Create a new project
- Edit an existing project
- Delete a project

## Google Sheets Integration

The dashboard can sync with Google Sheets for backup and collaboration:

1. **Setup**: Click the "Google Sheets" button in the header
2. **Configure**: Follow the setup guide (`GOOGLE_SHEETS_SETUP.md`) to:
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create a service account
   - Share your Google Sheet with the service account
3. **Sync**: Once configured, data automatically syncs to Google Sheets when you make changes

**Features:**
- **Automatic Sync**: Changes sync to Google Sheets automatically
- **Manual Sync**: Use "Sync To" and "Sync From" buttons for manual control
- **Two-way Sync**: Pull data from Google Sheets or push to it

See `GOOGLE_SHEETS_SETUP.md` for detailed setup instructions.

## Development

For development with auto-reload:

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes.

## Project Structure

```
school-dashboard/
├── server.js          # Backend Express server
├── package.json        # Dependencies and scripts
├── data/              # Data storage directory (created automatically)
│   └── projects.json  # Project data file
└── public/            # Frontend files
    └── index.html     # Dashboard HTML/CSS/JS
```

## API Endpoints

The backend provides the following REST API:

- `GET /api/projects` - Get all projects
- `GET /api/projects/:index` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:index` - Update a project
- `DELETE /api/projects/:index` - Delete a project

## Troubleshooting

### Port already in use

If port 3000 is already in use, you can change it in `server.js`:
```javascript
const PORT = 3000; // Change this to any available port
```

### Data not persisting

- Make sure the `data` directory exists and is writable
- Check the server console for any error messages
- Verify the `data/projects.json` file is being created

### CORS errors

The server includes CORS middleware, so this shouldn't be an issue. If you see CORS errors, make sure you're accessing the app through `http://localhost:3000`.

## License

ISC


