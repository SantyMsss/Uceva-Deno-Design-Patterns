# Taller — Patrones de Diseño

## Integrantes del grupo


- Santiago Martinez Serna - 230222014
- Laura Sofia Toro Garcia - 230222021

---

## Lista de patrones implementados

| # | Patrón | Categoría | Archivo |
|---|--------|-----------|---------|
| 1 | Builder | Creacional | `01-builder.ts` |
| 2 | Adapter | Estructural | `02-adapter.ts` |
| 3 | Flyweight | Estructural | `03-flyweight.ts` |
| 4 | Observer | Comportamiento | `04-observer.ts` |
| 5 | Singleton | Creacional | `05-singleton.ts` |
| 6 | Factory Function | Creacional | `06-factory-function.ts` |
| 7 | Facade | Estructural | `07-facade.ts` |
| 8 | Strategy | Comportamiento | `08-strategy.ts` |
| 9 | Command | Comportamiento | `09-command.ts` |
| 10 | State | Comportamiento | `10-state.ts` |

---

## Descripción de cada ejercicio

### 1. Builder — Pedido de Pizza Personalizada

**Archivo:** `01-builder.ts`

**Problema:** Un pedido de pizza tiene muchos atributos opcionales (tamaño, tipo de masa, salsa, queso, ingredientes extra). Usar un constructor tradicional con todos los parámetros genera código ilegible y obliga a pasar valores nulos para los campos que no se usan.

**Solución con Builder:** La clase `PizzaBuilder` construye la pizza paso a paso mediante métodos encadenados. El cliente configura únicamente los atributos que necesita y llama a `build()` al final para obtener el objeto listo. El código resultante es fluido, claro y fácil de extender.

**Cómo ejecutar:**
```bash
deno Taller/01-builder.ts
```

---

### 2. Adapter — Pasarela de Pago Externa

**Archivo:** `02-adapter.ts`

**Problema:** La aplicación de e-commerce espera que cualquier pasarela de pago exponga el método `procesarPago(monto)`, pero la librería de terceros que se quiere integrar solo tiene el método `realizarTransaccion(cantidad, moneda)`. No es posible modificar ninguna de las dos partes.

**Solución con Adapter:** La clase `AdaptadorPasarela` implementa la interfaz `PasarelaDePago` que conoce la tienda y, internamente, traduce cada llamada hacia la `PasarelaExterna`. La tienda trabaja siempre con la misma interfaz sin saber que hay una librería externa detrás.

**Cómo ejecutar:**
```bash
deno Taller/02-adapter.ts
```

---

### 3. Flyweight — Renderizado de Bosque en Videojuego

**Archivo:** `03-flyweight.ts`

**Problema:** Un juego de simulación necesita renderizar miles de árboles. Si cada árbol almacenara su propia copia de especie, color y textura, la memoria del programa se agotaría rápidamente.

**Solución con Flyweight:** Los datos pesados (especie, color, textura) se centralizan en objetos `TipoArbol` compartidos (Flyweights). Cada árbol individual solo guarda su posición (estado extrínseco) y una referencia al `TipoArbol` correspondiente. Aunque el bosque tenga cientos de árboles de la misma especie, solo existe **una** instancia de esos datos en memoria.

**Cómo ejecutar:**
```bash
deno Taller/03-flyweight.ts
```

---

### 4. Observer — Estación Meteorológica

**Archivo:** `04-observer.ts`

**Problema:** Múltiples dispositivos (panel LCD, app móvil, sistema de registro) necesitan actualizarse en tiempo real cuando la estación meteorológica recibe nuevas mediciones. Hacer que cada dispositivo consulte la estación constantemente (polling) desperdicia recursos y no es reactivo.

**Solución con Observer:** La `EstacionMeteorologica` actúa como Sujeto y mantiene una lista de observadores suscritos. Cuando llegan nuevos datos, notifica automáticamente a todos. Cada dispositivo implementa su propia lógica de respuesta. Se pueden agregar o quitar dispositivos sin modificar la estación.

**Cómo ejecutar:**
```bash
deno Taller/04-observer.ts
```

---

### 5. Singleton — Gestor de Sesión de Usuario

**Archivo:** `05-singleton.ts`

**Problema:** Múltiples módulos de una aplicación (carrito, administración, historial) necesitan acceder al estado de la sesión del usuario activo. Si cada módulo creara su propia instancia de sesión, los datos serían inconsistentes entre módulos.

**Solución con Singleton:** La clase `SesionUsuario` tiene el constructor privado y expone un único método estático `getInstance()` que siempre devuelve la misma instancia. Así todos los módulos comparten exactamente el mismo estado de sesión. Se demuestra que incluso pidiendo la instancia desde distintos puntos del código, siempre es el mismo objeto (`ref1 === ref2`).

**Cómo ejecutar:**
```bash
deno Taller/05-singleton.ts
```

---

### 6. Factory Function — Sistema de Notificaciones Multi-canal

**Archivo:** `06-factory-function.ts`

**Problema:** Una aplicación necesita enviar notificaciones por distintos canales (Email, SMS, Push). Crear instancias de clases específicas por todo el código acopla la lógica de negocio a los canales concretos y dificulta agregar nuevos canales.

**Solución con Factory Function:** La función `crearNotificador(canal)` recibe el canal como parámetro y retorna un objeto notificador listo para usar, con su método `enviar` configurado internamente. El código que consume el notificador siempre llama a `enviar(destinatario, mensaje)` sin importarle el canal. Agregar un canal nuevo solo requiere añadir un caso en la fábrica.

**Cómo ejecutar:**
```bash
deno Taller/06-factory-function.ts
```

---

### 7. Facade — Sistema de Pedidos en Línea

**Archivo:** `07-facade.ts`

**Problema:** Completar un pedido en línea requiere coordinar múltiples subsistemas: inventario, pagos, facturación y envío. Si el cliente orquesta todos estos pasos directamente, el código queda acoplado a cada subsistema y es difícil de mantener.

**Solución con Facade:** La clase `TiendaOnlineFacade` encapsula toda la orquestación en un único método `realizarPedido`. El cliente solo llama ese método y la fachada coordina internamente los 5 pasos en el orden correcto. Cualquier cambio en los subsistemas se aísla dentro de la fachada sin afectar al cliente.

**Cómo ejecutar:**
```bash
deno Taller/07-facade.ts
```

---

### 8. Strategy — Cálculo de Costo de Envío

**Archivo:** `08-strategy.ts`

**Problema:** Una tienda en línea necesita calcular el costo de envío usando distintas empresas de mensajería, cada una con su propia fórmula de precio. Poner todos los cálculos en la clase `Pedido` con condicionales la vuelve difícil de mantener y viola el principio Abierto/Cerrado.

**Solución con Strategy:** Cada algoritmo de cálculo se encapsula en su propia clase (`EnvioEstandar`, `EnvioEconomico`, `EnvioPremium`) que implementa la interfaz `EstrategiaEnvio`. La clase `Pedido` solo conoce esa interfaz y delega el cálculo en la estrategia asignada. Cambiar de mensajería en tiempo de ejecución es tan simple como asignar una estrategia diferente.

**Cómo ejecutar:**
```bash
deno Taller/08-strategy.ts
```

---

### 9. Command — Editor de Texto con Deshacer/Rehacer

**Archivo:** `09-command.ts`

**Problema:** Un editor de texto necesita que el usuario pueda deshacer (Ctrl+Z) y rehacer (Ctrl+Y) cualquier acción. Implementar esto directamente en los botones o atajos de teclado llena el editor de condicionales complejos y dificulta agregar nuevas acciones sin romper el historial.

**Solución con Command:** Cada acción del editor (`ComandoEscribir`, `ComandoBorrar`) se encapsula en su propia clase con métodos `ejecutar()` y `deshacer()`. El `HistorialComandos` actúa como invocador: guarda los comandos en una pila y los revierte en orden inverso. Agregar una nueva acción solo requiere crear una nueva clase de comando.

**Cómo ejecutar:**
```bash
deno Taller/09-command.ts
```

---

### 10. State — Semáforo de Tráfico

**Archivo:** `10-state.ts`

**Problema:** Un semáforo tiene tres estados (Rojo, Amarillo, Verde) con comportamientos distintos en cada uno. Manejar esto con condicionales dentro de una sola clase hace el código frágil: agregar un nuevo estado obliga a modificar múltiples bloques if en la clase principal.

**Solución con State:** Cada estado (`EstadoRojo`, `EstadoVerde`, `EstadoAmarillo`) se encapsula en su propia clase que implementa la interfaz `EstadoSemaforo`. El contexto `Semaforo` solo mantiene una referencia al estado actual y delega en él. Cada estado decide cuál es el siguiente estado y realiza la transición llamando a `semaforo.cambiarEstado()`.

**Cómo ejecutar:**
```bash
deno Taller/10-state.ts
```

---

## Recursos de referencia

- [Refactoring Guru — Catálogo de Patrones](https://refactoring.guru/es/design-patterns/catalog)
- [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans)
- [Patterns.dev](https://www.patterns.dev/)
