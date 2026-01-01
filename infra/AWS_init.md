# Best Practice Real en AWS con Terraform

## Paso inicial: AWS Console (root)

1. Desde la cuenta root de AWS, crea el **primer usuario IAM o rol base**.
   - **Motivo:** Terraform aún no tiene permisos para existir.

## A partir de ahí: Todo con Terraform

Gestiona mediante Terraform los siguientes recursos:

- Usuarios IAM
- Roles
- Policies
- S3
- DynamoDB
- KMS

## Regla práctica

- **Bootstrap manual:** 1 vez únicamente, para crear el usuario/rol base.
- **Infraestructura como código:** Siempre después de ese bootstrap inicial.

## Flujo recomendado

1. **Root (console)** → crear `terraform-bootstrap-user`.
2. **Terraform** → gestionar todo IAM y recursos AWS a partir de este usuario.
3. **Nunca:** gestionar IAM a mano una vez que Terraform está manejando la infraestructura.
