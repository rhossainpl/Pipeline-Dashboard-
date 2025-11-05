# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your School Launch Dashboard.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Give it a name (e.g., "School Dashboard")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create Service Account (Recommended for Full Access)

### Option A: Service Account (Recommended)

This allows full read/write access to your Google Sheets.

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `school-dashboard-service`
   - **Service account ID**: (auto-filled)
   - Click **Create and Continue**
4. Skip the optional steps and click **Done**
5. Click on the newly created service account
6. Go to the **Keys** tab
7. Click **Add Key** → **Create New Key**
8. Choose **JSON** format
9. Download the JSON file - **save it securely!**

### Step 4: Share Your Google Sheet

1. Create a new Google Sheet or open an existing one
2. Click the **Share** button (top right)
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it **Editor** permissions
5. Click **Share**

### Step 5: Get Your Spreadsheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

Copy the `SPREADSHEET_ID_HERE` part - this is your Spreadsheet ID.

### Step 6: Configure the Dashboard

1. Open the dashboard in your browser
2. Click the **Google Sheets** button in the header
3. In the configuration modal:
   - **Spreadsheet ID**: Paste your Spreadsheet ID
   - **Sheet Name**: (optional, defaults to "Projects")
   - **Service Account Key**: Open the downloaded JSON file, copy ALL its contents, and paste it here
4. Click **Save Configuration**
5. Test the connection by clicking **Sync to Google Sheets**

## Alternative: Using API Key (Read-Only or Limited Access)

If you prefer API key authentication:

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key
4. (Optional) Restrict the API key to Google Sheets API for security
5. In the dashboard configuration:
   - Enter your Spreadsheet ID
   - Enter the API Key (instead of Service Account Key)
   - Note: API keys may have limited write access depending on your sheet sharing settings

## How It Works

- **Automatic Sync**: When you add, edit, or delete projects in the dashboard, they automatically sync to Google Sheets
- **Manual Sync**: Use the sync buttons to:
  - **Sync to Google Sheets**: Upload your dashboard data to Google Sheets
  - **Sync from Google Sheets**: Download data from Google Sheets to your dashboard

## Troubleshooting

### "Spreadsheet not found" error
- Make sure you've shared the sheet with the service account email
- Verify the Spreadsheet ID is correct

### "Permission denied" error
- Ensure the service account has Editor permissions
- Check that the Google Sheets API is enabled

### "Invalid credentials" error
- Verify the JSON key is complete and correct
- Make sure you copied the entire JSON file content

## Security Notes

- **Never commit your service account JSON file to version control**
- The configuration is stored locally in `config/sheets-config.json`
- Keep your service account credentials secure
- If compromised, delete the service account and create a new one

## Next Steps

Once configured, your dashboard will automatically sync with Google Sheets whenever you:
- Add a new project
- Edit an existing project
- Delete a project

You can also manually sync using the sync buttons in the dashboard header.

