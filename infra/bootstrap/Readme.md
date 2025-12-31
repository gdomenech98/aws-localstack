# Bootstrap terraform backend

El backend de Terraform almacena el state y el locking de los entornos. Se guarda sobre S3 y DynamoDB

## Deploy

`cd infra/bootstrap`
`terraform init`
`terraform apply`


## Regla DevOps

“El backend se bootstrappea una vez”
- El bucket S3 del state y la tabla DynamoDB se crean una sola vez.
- Se hace antes de usar Terraform “normal”.
Normalmente: A mano o con un Terraform separado (infra/bootstrap).

“y nunca se autogestiona”
- Ese Terraform NO usa ese mismo backend.
- No guardas su state dentro de sí mismo.
- No lo modificas desde los entornos (dev, prod).

## 🔒 Cómo versionarlo y protegerlo (importante)

#### 1️⃣ Repositorio separado o carpeta protegida

En `infra/bootstrap/`
Cambios muy raros. Solo gente senior toca esto.

#### 2️⃣ Protecciones del bucket S3

Versioning activado (ya lo hiciste).
Block Public Access.
Opcional: bucket policy que:
Solo permita acceso al usuario/rol Terraform.
Deny delete del bucket.

#### 3️⃣ DynamoDB

No borrar nunca la tabla.
Solo una clave: LockID.

#### 4️⃣ State backup

S3 versioning = historial automático.
Recuperación fácil si alguien rompe el state.

#### 5️⃣ Regla de oro

Bootstrap ≠ infra de aplicación

Si se rompe el backend, todo Terraform se rompe.