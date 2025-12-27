Write-Host "Checking Node.js installation..."
$nodeVersion = node -v
if ($?) {
    Write-Host "Node.js found: $nodeVersion"
    Write-Host "Installing dependencies..."
    npm install
    
    if ($?) {
        Write-Host "Starting development server..."
        npm run dev
    } else {
        Write-Host "Error: Failed to install dependencies."
    }
} else {
    Write-Host "Error: Node.js is not installed. Please install Node.js (LTS) from https://nodejs.org/"
    Write-Host "After installing, please restart your terminal and run this script again."
}
