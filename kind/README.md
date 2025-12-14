# 1. Create a simple cluster
`kind create cluster --name <name>`
With config file: `kind create cluster --name <name> --config kind-config.yaml`
# 1. Get cluster info
`kubectl cluster-info --context kind-<name>`
`kubectl get nodes`


# Kind commands
## Get clusters
kind get clusters

## Delete a cluster
kind delete cluster --name <cluster-name>