# ////////////////// ENVIRONMENT //////////////////

variable "app_name" {
  type = string
  description = "Application name eg. <org>-<app>"
}

variable "environment" {
  type = string
  description = "Environment name"
}

# ////////////////// S3 //////////////////

variable "bucket_name" { 
  type = string
  description = "Sufix Name of the S3 Bucket"
}

# ////////////////// VPC //////////////////

variable "vpc_name" { 
  type = string
  description = "Sufix Name of the VPC"
}

variable "vpc_cidr" {
  type = string
  description = "CIDR block for the VPC"
}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"
}

variable "public_subnets" {
  type        = list(string)
  description = "CIDR blocks for public subnets"
}

variable "private_subnets" {
  type        = list(string)
  description = "CIDR blocks for private subnets"
}
