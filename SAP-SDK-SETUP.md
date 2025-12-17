# SAP NW RFC SDK Global Setup Guide

## Prerequisites

Download from SAP Support Portal (https://support.sap.com/swdc):
1. **SAP NW RFC SDK 7.50 - DARWIN X86_64** (for macOS)
2. **SAP NW RFC SDK 7.50 - LINUX ON X86_64 64BIT** (for Docker)

## macOS Setup (Global Installation)

```bash
# Run the installation script with your downloaded macOS SDK
./install-sap-sdk.sh ~/Downloads/nwrfc750P_8-70002752.zip

# Reload your shell
source ~/.zshrc

# Verify installation
echo $SAPNWRFC_HOME
# Should output: /usr/local/sap/nwrfcsdk

# Install node-rfc in your project
cd server
npm install
```

## Docker Setup (Linux SDK)

```bash
# Setup Linux SDK for Docker
cd server
./setup-docker-sdk.sh ~/Downloads/nwrfc750P_8-70002752-linux.zip

# Verify .so files (not .dll)
ls -la docker/nwrfcsdk/lib/

# Build and run Docker
docker build --platform=linux/amd64 -t kallagent-server .
docker run --platform=linux/amd64 -p 4000:4000 kallagent-server
```

## Run Locally (macOS)

```bash
cd server
npm start
```

## Troubleshooting

### "Cannot find module 'node-rfc'"
- Ensure SAPNWRFC_HOME is set: `echo $SAPNWRFC_HOME`
- Reinstall: `cd server && npm install`

### "invalid ELF header" in Docker
- You're using Windows SDK instead of Linux SDK
- Run: `./setup-docker-sdk.sh` with Linux SDK

### Library not loaded on macOS
- Check: `ls /usr/local/sap/nwrfcsdk/lib/`
- Should see .dylib files (not .dll)
- Reload shell: `source ~/.zshrc`
