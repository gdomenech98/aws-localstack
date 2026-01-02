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

## 🚀How to use infra?
### Step 0 - Setup Users and Roles
First you have to create 
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

Execute `./deploy` script changing AWS_PROFILE


# Usuarios y Roles

Se tiene que crear un usuario IAM para terraform que tiene todos los permisos necesarios para desplegar en terraform cualquier recurso que nuestra infrasturctura necestie. En nuestro caso: `uncert-terraform-admin`.

Se tiene que crear un usuario IAM sin permisos que cambiando el rol podamos coger los permisos de cada rol asignado por entorno (dev | staging | prod). Este usuario es `uncert-devops`. Nunca dar perimisos directos a recursos (S3, DynamoDB, etc.) al usuario humano. Verifica el fichero HOW_TO_HUMAN_AWS_USER.md para crear un usuario humano.

Cada entorno (dev | staging | prod) tiene un usuario cuyo nombre es `${app_name}-${environment}-role`, ejemplo uncert-app-dev-role para el entorno de dev. Este usuario puede solo acceder a recursos por prefijo definido como `${app_name}-${environment}-*`.

# Flujo

1. Usuario humano hace login en consola
2. Switch Role → uncert-app-dev-role
3. Accede únicamente a los recursos del entorno DEV
4. Lo mismo para staging y prod