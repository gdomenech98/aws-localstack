# Init Terraform project if already have no project
`terraform init`

# See changes without applying (like preview)
`terraform plan`

# Apply changes
`terraform apply` 
Auto approve: `terraform apply -auto-approve`
With variables inline: `terraform apply -var="bucket_name=new-bucket" -var="region=us-east-1"`
With variables file: `terraform apply -var-file="dev.tfvars"`
# Verify terraform state
`terraform state list`