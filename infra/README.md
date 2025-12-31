# Detalles clave

## Deploy

Execute `./deploy` script changing AWS_PROFILE

## Módulos

Reutilizables para cualquier entorno.

Ejemplo: s3 módulo define bucket con versioning, encryption, block public access y tags.

## envs/<entorno>

Contiene inputs específicos (variables) para ese entorno.

Cada entorno tiene su propio backend (state remoto y locking).