# define who can assume role
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Account identity, used to build dynamically the ARN
data "aws_caller_identity" "current" {}

# IAM Role Creation
resource "aws_iam_role" "this" {
  name               = "${var.app_name}-${var.environment}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# ///////////////// POLICIES /////////////////

# S3 Policies
data "aws_iam_policy_document" "s3" {
  statement {
    actions = ["s3:ListAllMyBuckets"]
    resources = ["*"]
  }

  statement {
    actions = [
      "s3:ListBucket",
      "s3:GetObject",
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${var.app_name}-${var.environment}-*",
      "arn:aws:s3:::${var.app_name}-${var.environment}-*/*"
    ]
  }
}

# Create IAM policy
resource "aws_iam_policy" "this" {
  name   = "${var.app_name}-${var.environment}-policy"
  policy = data.aws_iam_policy_document.s3.json
}

# Attach Policy to role
resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.this.arn
}