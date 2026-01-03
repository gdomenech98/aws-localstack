module "iam_app_role" {
  source      = "../../modules/iam-app-role"
  app_name    = var.app_name
  environment = var.environment
}
