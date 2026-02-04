# infrastructure/main.tf

provider "aws" {
  region = var.region
}

# Example: Staging Application
module "staging" {
  source = "./modules/app"
  environment = "staging"
}

# Example: Production Application (Canary)
module "production" {
  source = "./modules/app"
  environment = "production"
  enable_canary = true
}
