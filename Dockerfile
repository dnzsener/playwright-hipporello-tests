# Playwright Test Runner Docker Image
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install-deps

# Copy test files
COPY . .

# Create screenshots directory
RUN mkdir -p screenshots

# Set environment variables
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_ENV=production

# Expose port for Jenkins
EXPOSE 8080

# Default command
CMD ["npx", "playwright", "test", "--reporter=html"] 