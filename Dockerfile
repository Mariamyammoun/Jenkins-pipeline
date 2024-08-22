# Utilise une image de base Node.js
FROM node:14

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste du code dans le répertoire de travail
COPY . .

# Expose le port 3000 pour l'application
EXPOSE 3000

# Définit la commande par défaut pour démarrer l'application
CMD ["node", "app.js"]

