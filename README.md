# Proyecto gRPC

Este proyecto implementa una arquitectura de microservicios con NestJS para gestionar usuarios y notificaciones. Los servicios se comunican entre sí mediante **gRPC**, **HTTP REST** y **RabbitMQ**, y los datos se almacenan de forma eficiente en **Redis**.

---

## Estructura del Proyecto

```bash
.
├── service-a         # Microservicio de usuarios
├── service-b         # Microservicio de notificaciones
├── docker-compose.yml
└── README.md
```

## Microservicios
### service-a – User Service

- Permite crear, obtener y actualizar usuarios.
- Al crear un usuario, se notifica a service-b vía gRPC.
- Al actualizar un usuario, se emite un evento a RabbitMQ.
- Los usuario son guardados en Redis.

### service-b – Notification Service

- Recibe notificaciones por HTTP, gRPC y RabbitMQ.
- Valida con service-a si el usuario existe antes de notificar.
- Registra todas las notificaciones en Redis como logs.
- Expone un endpoint para consultar todas las notificaciones recibidas.

## Tecnologías y Herramientas Utilizadas

- **NestJS**: Framework backend modular y escalable para ambos servicios
- **gRPC**: Comunicación entre microservicios al crear usuarios
- **HTTP REST**: Endpoints públicos para crear, actualizar y notificar usuarios
- **Rabbit MQ**: Mensajería asíncrona entre servicios al actualizar un usuario
- **Redis**: Base de datos en memoria para almacenar usuarios y logs
- **Docker & Compose**: Contenerización y orquestación local de los servicios
- **Swagger**: Documentación interactiva de APIs HTTP
- **UUID**: Identificación única para usuarios y notificaciones

## Cómo correr el proyecto localmente

### Requisitos
- Docker
- Docker Compose

### Clonar el repositorio
```bash
git clone https://github.com/domer36/grpc-project.git
cd grpc-project
```

### Levantar todos los servicios
```bash
docker-compose up --build
```

***Esto levantará***:

- ***service-a***: http://localhost:3000
- ***service-b***: http://localhost:3001
- ***Swagger User***: http://localhost:3000/api
- ***Swagger Notificaciones***: http://localhost:3001/api
- ***RabbitMQ Admin***: http://localhost:15672 (user: guest, pass: guest)
- ***Redis***: en puerto 6379 (sin contraseña)
