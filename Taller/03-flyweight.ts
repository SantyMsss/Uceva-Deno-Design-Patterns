/**
 * ! Patrón Flyweight
 *
 * ¿Qué hace el patrón?
 * Flyweight es un patrón de diseño estructural que permite reducir el
 * consumo de memoria compartiendo la mayor cantidad de datos posible entre
 * objetos similares. En lugar de almacenar todos los datos en cada objeto,
 * el patrón divide el estado en dos partes:
 *   - Estado intrínseco: compartido, no cambia (el tipo de árbol, textura, color).
 *   - Estado extrínseco: único por objeto, se pasa desde afuera (posición x, y).
 *
 * ¿Qué problema se está resolviendo?
 * En un videojuego de simulación forestal se necesita renderizar miles de
 * árboles en pantalla. Si cada árbol almacenara su propia copia del tipo,
 * color y textura, la memoria del programa se agotaría rápidamente.
 * Con 10.000 árboles y cada objeto pesando varios KB, el juego sería inviable.
 *
 * ¿Por qué el patrón Flyweight es adecuado?
 * Dado que la mayor parte de los datos de un árbol (especie, color, textura)
 * son iguales para muchos árboles, podemos compartir esa información en un
 * único objeto Flyweight (TipoArbol). Cada árbol individual solo guarda su
 * posición, que es lo único que lo hace único. Así pasamos de N copias de
 * datos pesados a una sola instancia compartida por especie, reduciendo
 * drásticamente el uso de memoria.
 *
 * Ejemplo: Renderizado de bosque en un videojuego 2D.
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Flyweight ────────────────────────────────────────────────────────────────
// Almacena el estado INTRÍNSECO: datos pesados compartidos entre muchos árboles.
// Una sola instancia por especie de árbol.

class TipoArbol {
    // Estos datos son los "costosos" que queremos compartir
    readonly especie: string;
    readonly color: string;
    readonly textura: string; // Simula una imagen pesada

    constructor(especie: string, color: string, textura: string) {
        this.especie = especie;
        this.color = color;
        this.textura = textura;
        console.log(`%c[TipoArbol] Nueva instancia creada para: ${especie}`, COLORS.red);
    }

    // Recibe el estado extrínseco (posición) como parámetro en tiempo de ejecución
    renderizar(x: number, y: number): void {
        console.log(
            `%c[${this.especie}] %cColor: ${this.color} | Textura: ${this.textura} | Pos: (${x}, ${y})`,
            COLORS.green,
            COLORS.white
        );
    }
}

// ─── Flyweight Factory ────────────────────────────────────────────────────────
// Administra y reutiliza las instancias de TipoArbol.
// Si ya existe un TipoArbol para esa especie, lo devuelve en vez de crear uno nuevo.

class FabricaTipoArbol {
    // Caché: mapa de especie -> instancia compartida
    private tipos: Map<string, TipoArbol> = new Map();

    obtenerTipo(especie: string, color: string, textura: string): TipoArbol {
        // Usamos la especie como clave para identificar tipos ya existentes
        if (!this.tipos.has(especie)) {
            this.tipos.set(especie, new TipoArbol(especie, color, textura));
        }
        return this.tipos.get(especie)!;
    }

    // Útil para ver cuántas instancias reales existen en memoria
    contarTipos(): number {
        return this.tipos.size;
    }
}

// ─── Contexto (objeto ligero) ─────────────────────────────────────────────────
// Almacena el estado EXTRÍNSECO: solo la posición de cada árbol.
// Delega el renderizado al Flyweight (TipoArbol) que contiene los datos pesados.

class Arbol {
    // Solo guardamos la posición — el resto lo tiene el TipoArbol compartido
    private x: number;
    private y: number;
    private tipo: TipoArbol; // referencia al flyweight compartido

    constructor(x: number, y: number, tipo: TipoArbol) {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
    }

    // El renderizado real se delega al flyweight pasándole el estado extrínseco
    dibujar(): void {
        this.tipo.renderizar(this.x, this.y);
    }
}

// ─── Bosque (Cliente) ─────────────────────────────────────────────────────────
// El cliente crea muchos árboles usando la fábrica para reutilizar tipos.

class Bosque {
    private arboles: Arbol[] = [];
    private fabrica: FabricaTipoArbol = new FabricaTipoArbol();

    // Planta un árbol en las coordenadas dadas con la especie indicada
    plantarArbol(x: number, y: number, especie: string, color: string, textura: string): void {
        const tipo = this.fabrica.obtenerTipo(especie, color, textura);
        this.arboles.push(new Arbol(x, y, tipo));
    }

    // Renderiza todos los árboles del bosque
    dibujar(): void {
        console.log(`\n%cRenderizando ${this.arboles.length} árboles...`, COLORS.blue);
        this.arboles.forEach(arbol => arbol.dibujar());
    }

    // Muestra la eficiencia del patrón
    estadisticas(): void {
        console.log(`\n%c═══ Estadísticas de memoria ═══`, COLORS.cyan);
        console.log(`%cÁrboles totales en el bosque : ${this.arboles.length}`, COLORS.white);
        console.log(`%cInstancias TipoArbol en RAM  : ${this.fabrica.contarTipos()}`, COLORS.yellow);
        console.log(
            `%cAhorro: ${this.arboles.length - this.fabrica.contarTipos()} objetos pesados evitados`,
            COLORS.green
        );
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {

    const bosque = new Bosque();

    // Plantamos muchos árboles — solo se crean 3 instancias de TipoArbol
    bosque.plantarArbol(10, 20, 'Roble',    'Verde oscuro',  'textura_roble.png');
    bosque.plantarArbol(30, 50, 'Roble',    'Verde oscuro',  'textura_roble.png');
    bosque.plantarArbol(55, 15, 'Roble',    'Verde oscuro',  'textura_roble.png');
    bosque.plantarArbol(80, 90, 'Pino',     'Verde claro',   'textura_pino.png');
    bosque.plantarArbol(20, 70, 'Pino',     'Verde claro',   'textura_pino.png');
    bosque.plantarArbol(45, 35, 'Pino',     'Verde claro',   'textura_pino.png');
    bosque.plantarArbol(60, 80, 'Cerezo',   'Rosa brillante','textura_cerezo.png');
    bosque.plantarArbol(75, 25, 'Cerezo',   'Rosa brillante','textura_cerezo.png');
    bosque.plantarArbol(90, 60, 'Cerezo',   'Rosa brillante','textura_cerezo.png');

    bosque.dibujar();
    bosque.estadisticas();
}

main();
