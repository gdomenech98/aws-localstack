module "s3" {
  source      = "../../modules/s3"
  app_name = var.app_name
  environment = var.environment
  bucket_name = "${var.app_name}-${var.environment}-${var.bucket_name}"
}

module "vpc" {
  source          = "../../modules/vpc"
  app_name        = var.app_name
  environment     = var.environment
  name            = "${var.app_name}-${var.environment}-${var.vpc_name}"
  vpc_cidr        = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}