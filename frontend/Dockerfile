FROM node:24.3.0-alpine3.22

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod) pour le développement
RUN npm install

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Commande par défaut
CMD ["npm", "run", "dev"]