#!/bin/bash

echo "SAP NW RFC SDK Docker Setup Script"
echo "===================================="
echo ""

if [ ! -f "$1" ]; then
    echo "Usage: ./setup-docker-sdk.sh <path-to-linux-sdk-archive>"
    echo "Example: ./setup-docker-sdk.sh ~/Downloads/nwrfc750P_8-70002752-linux.zip"
    exit 1
fi

SDK_FILE="$1"

# Remove old SDK
rm -rf docker/nwrfcsdk

# Create temp directory
mkdir -p docker/temp

# Extract based on file type
if [[ "$SDK_FILE" == *.zip ]]; then
    unzip -o "$SDK_FILE" -d docker/temp/
elif [[ "$SDK_FILE" == *.tar.gz ]] || [[ "$SDK_FILE" == *.tgz ]]; then
    tar -xzf "$SDK_FILE" -C docker/temp/
else
    echo "Unsupported file format. Please use .zip or .tar.gz"
    exit 1
fi

# Move to correct location
mv docker/temp/nwrfcsdk docker/
rm -rf docker/temp

echo ""
echo "✅ Linux SDK installed for Docker!"
echo ""
echo "Verify the SDK has .so files (not .dll):"
ls -la docker/nwrfcsdk/lib/
echo ""
echo "Next: docker build --platform=linux/amd64 -t kallagent-server ."
echo ""
