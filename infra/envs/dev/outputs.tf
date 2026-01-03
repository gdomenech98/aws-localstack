# ─────────────── IAM ───────────────
output "role_name" {
  value = module.iam_app_role.role_name
}

output "role_arn" {
  value = module.iam_app_role.role_arn
}

output "policy_arn" {
  value = module.iam_app_role.policy_arn
}

# ─────────────── S3 ───────────────
output "bucket_id" {
  value = module.s3.bucket_id
}

# ─────────────── VPC ───────────────
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}
