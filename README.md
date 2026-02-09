# Proyecto de Gestión de Productos Financieros

Este proyecto es una aplicación web desarrollada con **Angular 18** para la gestión de productos financieros. Permite listar, agregar, editar y eliminar productos, cumpliendo con los estándares de calidad y una arquitectura modular.

## 🚀 Tecnologías Utilizadas

- **Angular 18**: Framework principal para el desarrollo de la SPA.
- **Jest**: Framework de pruebas unitarias (migrado para mayor rendimiento y cobertura).
- **SCSS**: Preprocesador CSS para estilos modulares y mantenibles.
- **Clean Architecture Layers**: Organización del código dividida en capas de responsabilidad (Domain, Application, Infrastructure, Presentation).
- **RxJS**: Gestión de flujos de datos asíncronos.
- **Signals**: Nueva API de reactividad de Angular para una gestión de estado eficiente.

## 📁 Estructura del Proyecto

El proyecto sigue una organización por características (features) y capas:

- `src/app/core`: Servicios globales, interceptores y configuración base.
- `src/app/shared`: Componentes de interfaz (UI) genéricos y validadores personalizados.
- `src/app/features/financial-products`:
    - `domain`: Modelos e interfaces que definen las reglas de negocio.
    - `application`: Facades que orquestan el flujo de datos.
    - `infrastructure`: Gestión de estado y persistencia.
    - `presentation`: Componentes de página y elementos visuales específicos.

## ⚙️ Configuración del Proxy (CORS)

Para el desarrollo local, se implementó un archivo `proxy.conf.json` para evitar problemas de CORS con el servidor de servicios:

```json
{
    "/bp": {
        "target": "http://localhost:3002",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug"
    }
}
```

### ¿Por qué es importante?
1. **Evita Bloqueos**: El navegador trata las peticiones como si fueran al mismo dominio de desarrollo (`localhost:4200`), eliminando restricciones de seguridad de origen cruzado.
2. **Abstracción**: Permite usar rutas relativas (`/bp`) en los entornos, lo que facilita la configuración sin cambiar el código fuente.

## 🛠️ Instalación y Ejecución

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Joguisa/financial-products-app.git
   cd bp-financial-products
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   ng serve -o
   ```
   Esto compilará la aplicación y abrirá automáticamente el navegador en `http://localhost:4200`.

## 🧪 Pruebas Unitarias

Se utiliza **Jest** para asegurar la calidad del código.

- **Ejecutar todas las pruebas**:
  ```bash
  npm test
  ```
- **Ver cobertura de código**:
  ```bash
  npm run test:coverage
  ```
  Actualmente, el proyecto mantiene una cobertura superior al **70%**.

## 📄 Especificaciones Implementadas

- **Listado de Productos**: Tabla con búsqueda dinámica y control de paginación (5, 10, 20 registros).
- **Validaciones de Negocio**: 
    - Validación asíncrona de ID de producto.
    - Cálculo automático de fecha de revisión (Registro + 1 año).
    - Feedback visual inmediato en formularios.
- **Diseño Responsivo**: Interfaz adaptada a diferentes resoluciones de pantalla.
- **Manejo de Errores**: Interceptor global para capturar fallos de red.

---
Proyecto desarrollado como parte de una evaluación técnica de servicios financieros.
