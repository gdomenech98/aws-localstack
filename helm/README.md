# Create a helm
helm create charts/<name>

# Deploy charts
kubectl config current-context
# Should output your cluster
helm install api charts/api
helm install frontend charts/frontend