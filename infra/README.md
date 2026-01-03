# How to deploy Infra using Terraform

## 🪐System overview

The folder structure:
```
infra
   |_ bootstrap
   |_ envs
      |_ dev
      |_ prod
      |_ staging
   |_ modules
      |_ s3
      ...
```
- `bootstrap`: This folder contains the bootstrap to setup Terraform backend (s3 and dynamodb) services that will store terrafrom state.
- `envs`: This folder contains each environment (`dev` | `prod` | `staging`) infrastucture terraformed with specific inputs. Each environment has its own backend (remote state and locking).
- `modules`: Reusable pieces for each environment. Eg: s3 module define bucket with versioning, encryption, block public access and tags.

### Terraform files
- `backend.tf`: Defines where is stored the terraform remote state. Terraform state is a file that remembers which resources exist and how are they called. Example of current terraform backend S3 (state) + DynamoDB (locks).
- `main.tf`: Contains the main resources or the calls to modules. This file allow to define the AWS structure.
- `variables.tf`: Define the inputs that the module or environment need. Allow to template the infrastucture.
- `outputs.tf`: Define the output values that Terraform returns at the end of an apply or that other modules/environments can use.
- `provider.tf`: Define what provider and what account is used to execute terraform.

### AWS Resources Naming
```
<org>-<app>-<env>-<name>
eg:  uncert-app-dev-<name>
````


## 🚀How to use infra?
### Step 0 - Setup Users and Roles

You will need at least 2 users (a part from the root one). One to manage terraform and other acting as "human" user to login into aws console. 

- **Terraform User**: From root AWS account create the **first user IAM**. This user will be in charge to manage terraform. This user will grant all permissions/policies that are needed to deploy infrastucture: IAM Users, Roles, Policies, S3, DynamoDB, etc. This user is manually bootstraped.
- **Human User**: From Terraform AWS user account create a human user with minimum permissions to assume roles. This user will be used to assume role from it, the roles created using terraform (each environment has a role).

#### ⚒️ Setup of Terraform User
1. Go to IAM and create user named eg. `uncert-terraform-admin`. Enable AWS Console Access.
2. Create a group eg. `uncert-terraform-admins`. Attach permissions/policy for that group with the following e.g policy `uncert-terraform-iam-management`:
``` json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"iam:CreateRole",
				"iam:DeleteRole",
				"iam:AttachRolePolicy",
				"iam:DetachRolePolicy",
				"iam:CreatePolicy",
				"iam:DeletePolicy",
				"iam:GetPolicy",
				"iam:GetPolicyVersion",
				"iam:ListRoles",
				"iam:ListPolicies"
			],
			"Resource": "*"
		}
	]
}
```
💡NOTE: Atach all permissions needed by terraform to allow service deployment. eg:
```
AmazonDynamoDBFullAccess
AmazonS3FullAccess
AWSKeyManagementServicePowerUser
...
```
3. Add the user to that group.

#### ⚒️ Setup of Human User 
1. Go to IAM and create user named eg. `uncert-devops`. Enable AWS Console Access.
2. Create a group eg. `uncert-humans`. Attach permissions/policy for that group with the following e.g policy `uncert-humans`:
``` json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"aws-portal:ViewAccount"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": "sts:AssumeRole",
			"Resource": [
				"arn:aws:iam::590184034894:role/uncert-app-dev-role",
				"arn:aws:iam::590184034894:role/uncert-app-staging-role",
				"arn:aws:iam::590184034894:role/uncert-app-prod-role"
			]
		}
	]
}
```
💡NOTE: The human profile only chave permissions to assume role. The roles are defined at `infra/envs/<env>/iam.tf` using module located at `infra/modules/iam-app-role/main.tf`. 
3. Add the user to that group.

### Step 1 - Bootstrap Terraform Backend
Then once created roles execute this commands:
``` bash
# Asume you are inside infra/ folder
cd bootstrap
terraform init
terraform apply
```

🗒️DevOps Tips followed:
 - The backend it is bootstrapped just one time. The terraform bootstrap it is never automanaged.
 - The S3 bucket that stores the state has to have versioning enabled and. `S3 versioning enabled = automatic history`, easy recover if anyone breaks the state.
 - The S3 bucket that stores the state has to have blocked the public access.
 - The S3 bucket can be only accessed by user/role `uncert-terraform-admin`.
 - Deny deletion of the state S3 bucket and DynamoDB table.
 - DynamoDB that stores the lock should have just one key like `LockID`.
 - Bootstrap infra  ≠ Aplication infra
 - Deploy bootstrap to a separate repository. Changes to that repository are rare (not often done). Only seniors have write privileges to the Terraform state code.

### Step 2 - Deploy

Execute `./deploy` script changing AWS_PROFILE.
```bash 
# ./deploy

export AWS_PROFILE=uncert-terraform-admin
...
``` 

### Step 3 - Access AWS environment ( dev | staging | prod)

Do login to AWS Console with `uncert-devops`, remember that this user does not have direct permissions to manage AWS resources (eg. S3, DynamoDB, etc.), it just have permissions to assume role. The permissions to access services are located at each environment role `{app_name}-${environment}-role` that `uncert-devops` can assume (switching role from its account). Once assumed the environment role the user can only access the resources defined by prefix `${app_name}-${environment}-*`.

Steps to use:
1. Login AWS Console as `uncert-devops` user.
2. Switch Role to any of the roles of environment eg. `uncert-app-dev-role`
3. Now can access only to resources that belong to DEV environment.
