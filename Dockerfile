# -------------------------------------------------
# Stage 1 — Build Angular 20 App
# -------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build Angular for production (Angular 20)
RUN npm run build --omit=dev
# OR:
# RUN npx ng build --configuration production


# -------------------------------------------------
# Stage 2 — Run with Nginx
# -------------------------------------------------
FROM nginx:stable-alpine AS runtime

# Clean default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build (Angular 20 outputs to: dist/<project>/browser)
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
