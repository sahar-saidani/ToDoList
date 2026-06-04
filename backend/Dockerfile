FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /usr/src/app

# Copier uniquement les fichiers de dépendances d'abord (cache)
COPY package*.json ./

# Installer les dépendances (prod uniquement)
RUN npm install --only=production

# Copier le reste du code backend
COPY . .


# Exposer le port du backend
EXPOSE 8000

# Lancer l'app
CMD ["npm", "start"]