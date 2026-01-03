variable "app_name" {
  type = string
  description = "Application name e.g <org>-<app>"
}

variable "environment" {
  type = string
  description = "Environment name (dev, staging, prod)"
}

variable "name" {
  type = string
  description = "VPC name"
}


variable "vpc_cidr" {
    type = string
}

variable "public_subnets" { 
    type = list(string) 
}

variable "private_subnets" { 
    type = list(string) 
}

variable "azs" { 
    type = list(string) 
}
