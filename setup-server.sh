#!/bin/bash
set -e

# Script de déploiement initial sur le serveur DigitalOcean
# A exécuter UNE SEULE FOIS après avoir cloné les repos

echo "=== Vérification Docker ==="
if ! command -v docker &> /dev/null; then
    echo "Installation de Docker..."
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker $USER
    echo "Docker installé. Reconnecte-toi (newgrp docker) puis relance ce script."
    exit 0
fi
docker --version

echo ""
echo "=== Génération des clés JWT Symfony ==="
mkdir -p esc-voting-service/config/jwt

# Génère la clé privée avec la passphrase du .env.prod
JWT_PASSPHRASE=$(grep JWT_PASSPHRASE .env.prod | cut -d'=' -f2)
openssl genpkey -algorithm RSA \
    -out esc-voting-service/config/jwt/private.pem \
    -pkeyopt rsa_keygen_bits:4096 \
    -pass pass:"$JWT_PASSPHRASE"

openssl pkey \
    -in esc-voting-service/config/jwt/private.pem \
    -out esc-voting-service/config/jwt/public.pem \
    -pubout \
    -passin pass:"$JWT_PASSPHRASE"

echo "Clés JWT générées."

echo ""
echo "=== Build et démarrage des containers ==="
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

echo ""
echo "=== Migrations base de données ==="
echo "Attente que PostgreSQL soit prêt..."
sleep 10
docker compose -f docker-compose.prod.yml exec php php bin/console doctrine:migrations:migrate --no-interaction

echo ""
echo "=== Terminé ! ==="
echo "L'application est accessible sur http://$(curl -s ifconfig.me)"
