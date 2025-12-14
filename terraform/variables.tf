variable "region" {
  description = "Name of the region provider AWS"
  type        = string
  default     = "eu-south-2"
}

variable "bucket_name" {
  description = "Name of the S3 bucket for frontend assets"
  type        = string
  default     = "project1-default-assets"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "project1-default-users"
}

