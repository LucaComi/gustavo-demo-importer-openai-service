# Specify the base image
FROM node

# Specify the working Directory 
WORKDIR "/app"

ENV PORT 8080

# Copy the package.json file 
COPY "package.json" .

# Run the node pack manager
RUN npm install

# Copy all the rest
COPY . .

# Start the container
CMD ["npm", "start"]