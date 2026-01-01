module "s3" {
  source      = "../../modules/s3"
  app_name = var.app_name
  environment = var.environment
  bucket_name = "${var.app_name}-${var.environment}-${var.bucket_name}"
}
