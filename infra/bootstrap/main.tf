# Create the S3 bucket for Terraform state
resource "aws_s3_bucket" "tfstate" {
  bucket = var.state_bucket_name

  tags = {
    ManagedBy = "Terraform"
    Purpose   = "terraform-state"
  }
}

# Use S3 Bucket tfstate versioning
resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Use separate resource for server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# DynamoDB table for Terraform locking
resource "aws_dynamodb_table" "tf_locks" {
  name         = var.lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    ManagedBy = "Terraform"
    Purpose   = "terraform-locks"
  }
}
