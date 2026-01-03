# ////////////////// ENVIRONMENT //////////////////

app_name = "uncert-app"
environment   = "dev"

# ////////////////// S3 //////////////////

bucket_name = "bucket"

# ////////////////// VPC //////////////////

vpc_name = "vpc"
vpc_cidr = "10.0.0.0/16"
azs = [
    "eu-west-1a", 
    "eu-west-1b", 
    "eu-west-1c"    
]

public_subnets = [
    "10.0.1.0/24", 
    "10.0.2.0/24", 
    "10.0.3.0/24"
]

private_subnets = [
    "10.0.11.0/24", 
    "10.0.12.0/24", 
    "10.0.13.0/24"
]
