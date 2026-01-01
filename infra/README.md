# Detalles clave

## Deploy

Execute `./deploy` script changing AWS_PROFILE

## Módulos

Reutilizables para cualquier entorno.

Ejemplo: s3 módulo define bucket con versioning, encryption, block public access y tags.

## envs/<entorno>

Contiene inputs específicos (variables) para ese entorno.

Cada entorno tiene su propio backend (state remoto y locking).

# Usuarios y Roles

Se tiene que crear un usuario IAM para terraform que tiene todos los permisos necesarios para desplegar en terraform cualquier recurso que nuestra infrasturctura necestie. En nuestro caso: `uncert-terraform-admin`.

Se tiene que crear un usuario IAM sin permisos que cambiando el rol podamos coger los permisos de cada rol asignado por entorno (dev | staging | prod). Este usuario es `uncert-devops`. Nunca dar perimisos directos a recursos (S3, DynamoDB, etc.) al usuario humano. Verifica el fichero HOW_TO_HUMAN_AWS_USER.md para crear un usuario humano.

Cada entorno (dev | staging | prod) tiene un usuario cuyo nombre es `${app_name}-${environment}-role`, ejemplo uncert-app-dev-role para el entorno de dev. Este usuario puede solo acceder a recursos por prefijo definido como `${app_name}-${environment}-*`.

# Flujo

1. Usuario humano hace login en consola
2. Switch Role → uncert-app-dev-role
3. Accede únicamente a los recursos del entorno DEV
4. Lo mismo para staging y prod