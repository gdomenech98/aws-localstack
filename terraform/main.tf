provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = var.region
  skip_credentials_validation = true // For localstack development
  skip_metadata_api_check     = true // For localstack development
  skip_requesting_account_id  = true // For localstack development
  s3_use_path_style           = true // For localstack development

  endpoints {
    s3             = "http://127.0.0.1:4566"
    s3control      = "http://127.0.0.1:4566"
    dynamodb       = "http://127.0.0.1:4566"
    ecr            = "http://127.0.0.1:4566"
    iam            = "http://127.0.0.1:4566"
    ssm            = "http://127.0.0.1:4566"
    secretsmanager = "http://127.0.0.1:4566"
  }
}

# S3 bucket
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.bucket_name // name of the bucket

  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

# DynamoDB table
resource "aws_dynamodb_table" "example" {
  name         = var.dynamodb_table_name // name of the table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id" // Main key of the table

  attribute {
    name = "id"
    type = "S"
  }
}

/*
# ECR repos
resource "aws_ecr_repository" "api" {
  name = "api-repo" // ECR Repository to upload docker images of 'api' containers
}

resource "aws_ecr_repository" "frontend" {
  name = "frontend-repo" // ECR Repository to upload docker images of 'frontend' containers
}
*/