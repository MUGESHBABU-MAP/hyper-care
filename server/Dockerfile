FROM node:18-bullseye

# Install dependencies for node-rfc
RUN apt-get update && apt-get install -y \
    libaio1 \
    libicu-dev \
    build-essential \
    cmake \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy SAP NW RFC SDK
COPY docker/nwrfcsdk /usr/local/nwrfcsdk

# Set environment variables for node-rfc
ENV SAPNWRFC_HOME=/usr/local/nwrfcsdk
ENV LD_LIBRARY_PATH=/usr/local/nwrfcsdk/lib:$LD_LIBRARY_PATH
ENV PATH=/usr/local/nwrfcsdk/bin:$PATH

# Set proper permissions
RUN chmod -R 755 /usr/local/nwrfcsdk

WORKDIR /app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

EXPOSE 4000
CMD ["npm", "start"]
