# ─────────────── WHO CAN ASSUME ROLE ───────────────
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

data "aws_caller_identity" "current" {}

# ─────────────── IAM ROLE ───────────────
resource "aws_iam_role" "this" {
  name               = "${var.app_name}-${var.environment}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# ─────────────── POLICIES ───────────────

data "aws_iam_policy_document" "combined" {
  # ───────────── S3 ─────────────
  statement {
    effect    = "Allow"
    actions   = ["s3:ListAllMyBuckets"]
    resources = ["*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket", "s3:GetObject", "s3:PutObject"]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "s3:ResourceTag/Environment"
      values   = ["${var.app_name}-${var.environment}"]
    }
  }

  # ───────────── VPC / EC2 ─────────────
  statement {
    effect    = "Allow"
    actions = [
      "ec2:DescribeVpcs",
      "ec2:ModifyVpcAttribute",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeRouteTables",
      "ec2:CreateTags",
      "ec2:DeleteTags"
    ]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "aws:ResourceTag/Environment"
      values   = ["${var.app_name}-${var.environment}"]
    }
  }
  # Add here more policies needed
}

# ─────────────── CREATE POLICY ───────────────
resource "aws_iam_policy" "this" {
  name   = "${var.app_name}-${var.environment}-policy"
  policy = data.aws_iam_policy_document.combined.json
}

# ─────────────── ATTACH POLICY ───────────────
resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.this.arn
}