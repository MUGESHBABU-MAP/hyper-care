#!/bin/bash

echo "SAP NW RFC SDK Global Installation Script"
echo "=========================================="
echo ""

# Check if SDK file exists
if [ ! -f "$1" ]; then
    echo "Usage: ./install-sap-sdk.sh <path-to-sdk-archive>"
    echo "Example: ./install-sap-sdk.sh ~/Downloads/nwrfc750P_8-70002752.zip"
    exit 1
fi

SDK_FILE="$1"

# Create directory
echo "Creating /usr/local/sap/nwrfcsdk..."
sudo mkdir -p /usr/local/sap

# Extract based on file type
if [[ "$SDK_FILE" == *.zip ]]; then
    echo "Extracting ZIP file..."
    sudo unzip -o "$SDK_FILE" -d /usr/local/sap/
elif [[ "$SDK_FILE" == *.tar.gz ]] || [[ "$SDK_FILE" == *.tgz ]]; then
    echo "Extracting TAR.GZ file..."
    sudo tar -xzf "$SDK_FILE" -C /usr/local/sap/
else
    echo "Unsupported file format. Please use .zip or .tar.gz"
    exit 1
fi

# Set permissions
echo "Setting permissions..."
sudo chmod -R 755 /usr/local/sap/nwrfcsdk

# Add to shell profile
echo "Adding environment variables to ~/.zshrc..."
grep -q "SAPNWRFC_HOME" ~/.zshrc || echo 'export SAPNWRFC_HOME=/usr/local/sap/nwrfcsdk' >> ~/.zshrc
grep -q "DYLD_LIBRARY_PATH.*nwrfcsdk" ~/.zshrc || echo 'export DYLD_LIBRARY_PATH=/usr/local/sap/nwrfcsdk/lib:$DYLD_LIBRARY_PATH' >> ~/.zshrc
grep -q "PATH.*nwrfcsdk" ~/.zshrc || echo 'export PATH=/usr/local/sap/nwrfcsdk/bin:$PATH' >> ~/.zshrc

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Run: source ~/.zshrc"
echo "2. Verify: echo \$SAPNWRFC_HOME"
echo "3. Install node-rfc: cd server && npm install"
echo ""
