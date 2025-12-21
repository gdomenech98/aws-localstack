# Environment Setup & Deployment Guide

This guide details how to set up the local development environment, including the Kubernetes cluster (Kind), Docker Registry, Traefik Ingress, and the Applications (API & Frontend).

## Prerequisites
Ensure you have the following tools installed:
- Docker & Docker Compose
- Kind (Kubernetes in Docker)
- Helm
- Kubectl

## 1. Infrastructure Setup

### Start Support Services (Registry & Localstack)
Start the local Docker registry (port 5000) and Localstack via Docker Compose.
```bash
docker-compose up -d
```

### Create Kubernetes Cluster
Create the Kind cluster using the custom configuration to expose ports 80/443 to your host.

> [!WARNING]
> If a cluster named `my-cluster` already exists, delete it first: `kind delete cluster --name my-cluster`

```bash
kind create cluster --name my-cluster --config kind/kind-config.yaml
```

## 2. Build & Push Images
Build the application images and push them to the local registry so the cluster can pull them.

> **Note**: These commands run from the `apps/` directory or you can run the scripts provided there.

```bash
cd apps

# Build and Push API
./build_api_image
# OR manually:
# docker build -t localhost:5000/api:v1.0.0 -f api/docker/Dockerfile .
# docker push localhost:5000/api:v1.0.0

# Build and Push Frontend
./build_frontend_image
# OR manually:
# docker build -t localhost:5000/frontend:v1.0.0 -f frontend/docker/Dockerfile .
# docker push localhost:5000/frontend:v1.0.0

cd ..
```

## 3. Ingress Controller (Traefik) configuration
Install Traefik v3 using Helm. This handles incoming traffic on ports 80/443.

### Add Traefik Repo
Check have installed traefik repo
```bash
helm repo list | grep traefik
```

if not
```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update
```

### Install Traefik
We use a custom values file (`helm/traefik-values.yaml`) to map the ports correctly.

```bash
helm install gateway traefik/traefik \
  --create-namespace --namespace traefik \
  -f helm/charts/gateway/traefik-values.yaml
```

## 4. Application Deployment
Deploy the applications using Helm. We point them to the images in our local registry (IP: 51.38.38.197 is the VPS IP accessible from Kind, acting as the registry host).

### Deploy API
```bash
helm install api ./helm/charts/api
```

### Deploy Frontend
```bash
helm install frontend ./helm/charts/frontend
```

## 5. Routing Configuration
Apply the `IngressRoute` resources to define how Traefik routes traffic to the services.

```bash
kubectl apply -f k8s/ingress-route.yaml
```

## 6. Verification
Your applications should now be accessible on your host machine (or VPS IP).

- **API Health Check**:
  ```bash
  curl http://localhost/api/v1/health
  # Expected: {"status":"ok"}
  ```

- **Frontend**:
  ```bash
  curl -I http://localhost/
  # Expected: HTTP/1.1 200 OK
  ```