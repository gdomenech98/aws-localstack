# aws-localstack
# Dependencies
1. Docker -> define imagenes
2. Docker Compose -> corre imagenes de docker
3. Kubectl -> CLI para interactuar con k8s
4. Kind -> herramienta que permite crear clusters de k8s locales
5. Terraform -> Herramienta para crear infraestructura como codigo
6. AWS CLI -> CLI que permite interactuar con aws
7. AWS Local -> Permite crear servicios de aws locales
7. Eksctl -> herramienta que permite crear clusters de aws (EKS service)
8. Helm -> Gestor de paquetes para Kubernetes

-> WORKING DEPENDENCIES
- kubectl Client Version: v1.34.3
- Kustomize Version: v5.7.1
- kind kind version 0.31.0-alpha+ca7288bfd215bf
- terraform Terraform v1.14.2
- aws aws-cli/2.32.15 Python/3.13.11 Linux/6.11.0-29-generic exe/x86_64.ubuntu.24
- eksctl 0.220.0

# 1. Setup
1. Install deps using `./install-dev-tools`
2. Start localstack using `docker-compose up -d`
2. Check services: http://localhost:4566/_localstack/health 

# 2. Build 'apps' images and upload them to registry (ECR or docker local registry)

# 3. Create a cluster if already not created

# 4. Selecciona el contexto del cluster
kubectl config use-context kind-my-cluster
kubectl get nodes   # verifica que el cluster está activo

# 5. Instala/Despliega un chart
helm install <release-name> ./charts/frontend -f ./charts/frontend/values-prod.yaml
helm install <release-name> ./charts/api -f ./charts/api/values-prod.yaml

<release-name> → nombre único para el deployment en Helm.

Si ya existe el release, usa upgrade:

helm upgrade <release-name> ./charts/frontend -f ./charts/frontend/values-prod.yaml

# 6. Verifica los pods y servicios
kubectl get pods
kubectl get svc
kubectl get ingress


kubectl describe pod <pod-name> → detalles y logs.

kubectl logs <pod-name> → logs del contenedor.