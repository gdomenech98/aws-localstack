terraform {
  backend "s3" {
    bucket         = "uncert-tf-state"
    key            = "app/dev/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "uncert-tf-locks"
  }
}
