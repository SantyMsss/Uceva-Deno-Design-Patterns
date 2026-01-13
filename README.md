## Patrones de diseño

El código está escrito en TypeScript y usamos Deno para ejecutarlo, puedes usar Bun o Node si lo prefieres.

Si usas Node, deberás configurar TypeScript, por lo que te recomiendo Deno o Bun.

## Ejecución de Archivos

### Ejecutar Archivo Una Vez
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno builder.ts
```
```
deno builder.task.ts
```

### Ejecutar Archivo de Forma Automatica
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno --watch builder.ts
```
```
deno --watch builder.task.ts
```

# Recursos adicionales

* [Refactoring Guru](https://refactoring.guru/es/design-patterns/catalog)

* [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans?tab=readme-ov-file)

* [Patterns.dev](https://www.patterns.dev/)

* [Java Design Patterns](https://github.com/iluwatar/java-design-patterns)

* [Design Patterns TypeScript](https://github.com/torokmark/design_patterns_in_typescript?tab=readme-ov-file)

# Listado de Patrones Recomendados para el Curso

## Creacionales
- Builder
- Abstract Factory
- Factory Function
- Singleton

## Estructurales
- Adapter
- Composite
- Facade
- Flyweight

## Comportamiento
- Chain Responsability
- Observer
- Strategy
- Template Method