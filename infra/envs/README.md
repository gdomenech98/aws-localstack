# Terraform files
`backend.tf`: Define dónde se guarda el state remoto de Terraform. El state es el archivo que recuerda qué recursos existen y cómo se llaman. Ejemplo con S3 + DynamoDB:
`main.tf`: Contiene los recursos principales o la llamada a los módulos. Es donde defines qué crear realmente en AWS.
`variables.tf`: Define los inputs que el módulo o entorno necesita. Permite parametrizar tu infraestructura.
`outputs.tf`: Define valores que Terraform devuelve al final de un apply o que otros módulos/entornos pueden usar.
`provider.tf`: Define que proveedor y cuenta se usarà para ejecutar el terraform.

# AWS Names 
Formato:
<org>-<app>-<env>-<name>
Eg: uncert-app-dev-<name>
* NOTA: Son cambiables, es solo un standar