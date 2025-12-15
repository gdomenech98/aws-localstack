# Create a helm
helm create charts/<name>

# Deploy charts
kubectl config current-context
# Should output your cluster
helm install api charts/api
helm install frontend charts/frontend

# Install the deployment to cluster
`helm install <app_release_name> -f <path_to_helm__values_chart_directory>`

eg; `helm install api charts/api`

# Other commands
`helm upgrade api charts/api`   # update the app
`helm rollback api 1`             # roll back to version X (eg. x=1)
`helm uninstall api`            # remove the app

# Overides
Set default variables in values.yaml and overides of specific variables at values-dev.yaml or values-prod.yaml (for example).