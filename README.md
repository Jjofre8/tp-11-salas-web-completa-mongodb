# TP 11 - Edición completa de reservas desde la web

**Módulo 3 - Desarrollo Back-end con Node.js**  
**UNCA - Universidad Nacional de Catamarca**

**Proyecto:** `tp-11-salas-web-completa-mongodb`

**Alumno:** Julián Zalazar Jofre

## 1. Introducción

Este trabajo práctico continúa el desarrollo realizado en
el TP10, incorporando la edición completa de reservas de
salas de estudio mediante formularios web.

La aplicación permite consultar una reserva existente,
precargar sus datos, modificarlos y guardar el reemplazo
completo en MongoDB Atlas.

Se reutiliza el mismo servicio utilizado por el método
PUT de la API REST.

## 2. Objetivos

- Incorporar un formulario de edición con siete campos.
- Precargar los valores de una reserva existente.
- Reutilizar el servicio de reemplazo de reservas.
- Conservar el identificador original de MongoDB.
- Validar los datos antes de realizar la escritura.
- Conservar los valores ingresados ante errores.
- Permitir cancelar la edición sin guardar.
- Redirigir al detalle mediante HTTP 303.
- Mantener las funcionalidades del TP10.

No se incorporan operaciones PATCH ni DELETE desde la
interfaz web, ya que corresponden a la Unidad 12.

## 3. Tecnologías utilizadas

- Node.js.
- Express 5.
- MongoDB Atlas Free.
- Mongoose 9.
- EJS.
- express-ejs-layouts.
- Morgan.
- ESLint.
- Prettier.
- Postman.

El proyecto utiliza CommonJS.

Las versiones de las dependencias se encuentran en
package.json y package-lock.json.

## 4. Configuración de MongoDB Atlas

| Elemento | Valor |
| --- | --- |
| Base de datos | reservas_salas_u11 |
| Colección | reservas |
| Puerto local | 3000 |
| Variable de conexión | MONGODB_URI |

Se utiliza una base de datos independiente de las
entregas anteriores.

Se conserva la configuración DNS autorizada desde
la Unidad 7.

### Variables de entorno

Crear un archivo privado .env a partir de .env.example.

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u11?retryWrites=true&w=majority
```

Reemplazar los marcadores por los datos correspondientes
a MongoDB Atlas.

El archivo .env no debe publicarse en GitHub.

La dirección IP utilizada debe estar autorizada en
MongoDB Atlas.

## 5. Instalación y ejecución

Clonar el repositorio de entrega e ingresar a la carpeta:

```powershell
cd tp-11-salas-web-completa-mongodb
```

Instalar las dependencias:

```powershell
npm.cmd ci
```

Crear el archivo de configuración privado:

```powershell
Copy-Item .env.example .env
```

Completar las credenciales correspondientes.

Comprobar formato y calidad:

```powershell
npm.cmd run check
```

Comprobar la conexión:

```powershell
node --env-file=.env scripts/comprobar-conexion.js
```

Iniciar el servidor:

```powershell
node --env-file=.env src/index.js
```

También puede utilizarse:

```powershell
npm.cmd start
```

Dirección local:

http://localhost:3000

## 6. Organización del proyecto

```text
tp-11-salas-web-completa-mongodb/
├── src/
│   ├── config/
│   │   ├── base-datos.js
│   │   └── entorno.js
│   ├── controladores/
│   │   ├── reservas.js
│   │   └── reservas-api.js
│   ├── middleware/
│   │   ├── reservas.js
│   │   └── solicitudes.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── reservas-api.js
│   ├── servicios/
│   │   └── reservas.js
│   ├── app.js
│   └── index.js
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   └── listar-reservas.js
├── views/
│   ├── reservas/
│   │   ├── nueva.ejs
│   │   ├── lista.ejs
│   │   ├── detalle.ejs
│   │   └── editar.ejs
│   └── no-encontrado.ejs
├── public/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

La aplicación conserva la separación por capas.

Las rutas reciben las solicitudes HTTP, los middlewares
validan los datos, los controladores gestionan las
respuestas y los servicios realizan las operaciones
sobre MongoDB.

## 7. Modelo de reservas

| Campo | Tipo | Validación |
| --- | --- | --- |
| estudiante | String | Texto obligatorio |
| email | String | Obligatorio, contiene @ |
| sala | String | Sala permitida |
| fecha | String | Texto obligatorio |
| turno | String | Turno permitido |
| personas | Number | Entero entre 1 y 6 |
| estado | String | pendiente o confirmada |

### Salas permitidas

- Sala Norte.
- Sala Sur.
- Sala Multimedia.

### Turnos permitidos

- Mañana.
- Tarde.
- Noche.

### Estados permitidos

- pendiente.
- confirmada.

El estado inicial de las nuevas reservas es pendiente.

MongoDB genera automáticamente el identificador _id,
representado como id en las respuestas públicas.

El identificador no forma parte de los campos editables.

## 8. Rutas web

| Método | Ruta | Funcionalidad |
| --- | --- | --- |
| GET | / | Página principal |
| GET | /reservas | Listado de reservas |
| GET | /reservas/nueva | Formulario de creación |
| POST | /reservas | Crear reserva |
| GET | /reservas/:id | Detalle individual |
| GET | /reservas/:id/editar | Formulario de edición |
| POST | /reservas/:id/editar | Reemplazo completo |
| GET | /estado | Estado del servicio |

### Formulario de edición

GET /reservas/:id/editar

Busca la reserva mediante el identificador recibido
en la URL y precarga los siete campos editables.

Los valores se convierten a texto para su presentación
en el formulario EJS.

La edición puede abrirse desde el listado o desde
el detalle individual.

### Guardar edición

POST /reservas/:id/editar

El formulario envía los siete campos editables mediante
application/x-www-form-urlencoded.

Los datos se validan antes de llamar al servicio de
reemplazo.

Si la operación es exitosa, el servidor responde:

```http
HTTP/1.1 303 See Other
Location: /reservas/ID_REAL
```

El destino elegido es el detalle individual de la
reserva modificada.

### Cancelación

El enlace Cancelar regresa al detalle de la reserva
sin enviar el formulario ni realizar escrituras.

## 9. Reemplazo completo

La edición web y el método PUT de la API utilizan
la misma operación del servicio de reservas:

```javascript
servicio.reemplazar(id, datos)
```

El servicio construye exclusivamente los siete campos
permitidos y utiliza findOneAndReplace:

```javascript
const reserva = await Reserva.findOneAndReplace(
  { _id: id },
  reemplazo,
  {
    returnDocument: "after",
    runValidators: true,
    upsert: false,
  }
).lean();
```

Esta operación:

- Conserva el identificador original.
- Reemplaza los siete campos editables.
- Ejecuta las validaciones del modelo.
- Devuelve el documento actualizado.
- No crea documentos cuando el identificador no existe.
- Espera la escritura antes de responder.

No se realizan solicitudes HTTP internas hacia la
propia API.

## 10. Validación compartida

La edición web y PUT utilizan validarDatosReserva
en modo reemplazar.

Se comprueba:

- Presencia de todos los campos obligatorios.
- Textos no vacíos.
- Correo electrónico con @.
- Sala incluida en el catálogo.
- Turno incluido en el catálogo.
- Personas no vacío y entero entre 1 y 6.
- Estado permitido.
- Ausencia de campos adicionales, identificadores
  y operadores no admitidos.

Los campos omitidos no se completan con los valores
anteriores del documento.

## 11. Conservación de valores ante errores

El middleware guarda el contexto de edición mediante:

```javascript
res.locals.edicion
```

Este contexto contiene:

- Identificador de la reserva.
- Valores recibidos.
- Catálogo de salas.
- Catálogo de turnos.
- Catálogo de estados.

Cuando la validación falla, se devuelve el formulario
de edición con HTTP 400 y los mensajes correspondientes.

Si Mongoose rechaza el reemplazo, el manejador general
recupera el contexto y vuelve a mostrar el formulario.

Las solicitudes API conservan respuestas JSON y los
errores inesperados utilizan mensajes seguros.

## 12. Códigos HTTP

| Situación | Código |
| --- | --- |
| Formulario de edición disponible | 200 |
| Reemplazo web correcto | 303 |
| Reemplazo mediante API correcto | 200 |
| Identificador inválido | 400 |
| Formulario inválido | 400 |
| Reemplazo incompleto | 400 |
| Reserva inexistente | 404 |
| Error interno del servidor | 500 |

La vista compartida de errores informa el código
correspondiente a cada situación.

## 13. API REST

Se conservan las operaciones del TP10.

| Método | Ruta | Funcionalidad |
| --- | --- | --- |
| GET | /api/reservas | Listado paginado |
| GET | /api/reservas/:id | Consulta individual |
| POST | /api/reservas | Creación |
| PUT | /api/reservas/:id | Reemplazo completo |
| PATCH | /api/reservas/:id | Actualización parcial |
| DELETE | /api/reservas/:id | Eliminación física |

PATCH y DELETE se mantienen exclusivamente como
funcionalidades heredadas de la API.

## 14. Consultas heredadas del TP10

Se mantienen las consultas avanzadas:

- Filtrado opcional por sala.
- Ordenamiento por estudiante.
- Ordenamiento ascendente por personas.
- Ordenamiento descendente por personas.
- Paginación.
- Selección interna de campos.

| Parámetro | Valores |
| --- | --- |
| sala | Nombre de la sala |
| orden | estudiante, personas-asc, personas-desc |
| pagina | Entero entre 1 y 1000 |
| limite | Entero entre 1 y 20 |

Valores predeterminados:

```text
pagina = 1
limite = 2
orden = estudiante
```

Ejemplo:

```http
GET /api/reservas?sala=Sala%20Norte&orden=personas-asc&pagina=1&limite=2
```

El listado devuelve:

```json
{
  "datos": [],
  "pagina": 1,
  "limite": 2,
  "total": 0,
  "paginas": 0
}
```

No se agregan filtros, ordenamiento ni paginación
a las vistas HTML.

## 15. Pruebas reproducibles

Utilizar una reserva existente y reemplazar ID_REAL
por su identificador.

Si la base está vacía, pueden utilizarse los datos
ficticios de la consigna:

| Estudiante | Email | Sala | Turno | Personas |
| --- | --- | --- | --- | --- |
| Ana Ejemplo | ana@example.com | Sala Norte | Mañana | 2 |
| Bruno Ejemplo | bruno@example.com | Sala Sur | Tarde | 3 |

Fecha ilustrativa: 2026-11-04.

No duplicar reservas existentes.

### Prueba 1: abrir edición

```http
GET /reservas/ID_REAL/editar
```

Resultado esperado: formulario con siete campos
precargados.

### Prueba 2: guardar desde la web

Cambiar personas a 4 y estado a confirmada.

Guardar y comprobar la redirección 303 al detalle.

Consultar:

```http
GET /api/reservas/ID_REAL
```

Resultado esperado: mismo ID y datos actualizados.

### Prueba 3: reemplazo desde Postman

Método PUT:

```text
http://localhost:3000/api/reservas/ID_REAL
```

Body: raw - JSON.

Content-Type: application/json.

```json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-04",
  "turno": "Mañana",
  "personas": 3,
  "estado": "pendiente"
}
```

Resultado esperado: HTTP 200, mismo identificador
y formulario web actualizado.

### Prueba 4: PUT incompleto

Repetir la solicitud anterior eliminando estado.

Resultado esperado: HTTP 400 y documento intacto.

### Prueba 5: formulario inválido

Método POST:

```text
http://localhost:3000/reservas/ID_REAL/editar
```

Body: x-www-form-urlencoded.

Enviar los siete campos utilizando personas=0.

Resultado esperado: HTML 400, mensajes de error y
valores recibidos conservados.

Consultar por API para verificar que el documento
no fue modificado.

Corregir personas y reenviar los siete campos.

Desactivar Automatically follow redirects en Postman
para observar la respuesta HTTP 303.

### Prueba 6: cancelación

Abrir el formulario, modificar los campos y utilizar
el enlace Cancelar sin enviar los datos.

Resultado esperado: documento intacto.

### Prueba 7: identificadores

```http
GET /reservas/abc/editar
```

Resultado esperado: HTML 400.

```http
GET /reservas/000000000000000000000000/editar
```

Resultado esperado: HTML 404, siempre que ese ID
no exista en la colección.

### Prueba 8: persistencia

Guardar un reemplazo válido y registrar el ID
y los siete campos.

Detener el servidor con Ctrl+C.

Volver a iniciar:

```powershell
npm.cmd start
```

Consultar el mismo identificador:

```http
GET /api/reservas/ID_REAL
```

Resultado esperado: mismos datos almacenados,
sin crear nuevas reservas.

## 16. Resultados verificados

Fecha: 24/11/2026.

Durante el desarrollo se verificó:

| Comprobación | Resultado |
| --- | --- |
| Inicio del servidor | Correcto |
| Conexión a MongoDB Atlas | Correcto |
| Creación de reserva | Correcto |
| Edición desde navegador | Correcto |
| Actualización de siete campos | Correcto |
| Conservación del identificador | Correcto |
| Lectura posterior por API | Correcto |
| Conteo después de la primera edición | 1 reserva |
| Respuesta HTTP 303 | Correcto |
| Cabecera Location | Correcto |
| Prettier | Sin errores |
| ESLint | Sin errores |

Identificador utilizado:

```text
6b0596d1a270646739d261d1
```

Respuesta HTTP obtenida durante el reemplazo web:

```http
HTTP/1.1 303 See Other
Location: /reservas/6b0596d1a270646739d261d1
```

La respuesta confirma que el destino de la
redirección corresponde al identificador original.

Las pruebas restantes descritas en la sección anterior
se incluyen como procedimientos reproducibles, sin
afirmar que hayan sido ejecutadas.

## 17. Calidad del código

Aplicar formato:

```powershell
npm.cmd run format
```

Verificar formato y ESLint:

```powershell
npm.cmd run check
```

Las comprobaciones realizadas finalizaron sin errores.

## 18. Seguridad

No se deben publicar:

- Archivos .env privados.
- Credenciales.
- Cadenas privadas de conexión a MongoDB.
- Carpeta node_modules.
- Datos personales reales.

Las capturas y solicitudes de prueba deben utilizar
datos ficticios.

El proyecto está destinado a fines académicos y
ejecución local.

No incorpora autenticación ni autorización, ya que
no forman parte de la consigna.

## 19. Entrega

Repositorio individual:

tp-11-salas-web-completa-mongodb

La entrega debe incluir:

- Código fuente.
- Vistas EJS y estilos.
- Scripts.
- Archivos de configuración.
- package.json.
- package-lock.json.
- .env.example.
- .gitignore.
- README.md.
- Evidencias solicitadas por la consigna.

## 20. Conclusión

El TP11 incorpora la edición completa de reservas
desde la interfaz web, reutilizando el servicio
de reemplazo de la API REST.

La solución conserva el identificador original,
centraliza las validaciones y mantiene las
funcionalidades desarrolladas en las unidades
anteriores.