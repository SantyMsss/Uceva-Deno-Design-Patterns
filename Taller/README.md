# Taller — Patrones de Diseño

## Integrantes del grupo

> Completen esta sección con los nombres del grupo.

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

## Recursos de referencia

- [Refactoring Guru — Catálogo de Patrones](https://refactoring.guru/es/design-patterns/catalog)
- [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans)
- [Patterns.dev](https://www.patterns.dev/)
