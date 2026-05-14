/**
 * ! Patrón Builder
 *
 * ¿Qué hace el patrón?
 * Builder es un patrón de diseño creacional que permite construir objetos
 * complejos paso a paso. Separa la construcción de un objeto de su
 * representación, de modo que el mismo proceso puede crear representaciones
 * diferentes.
 *
 * ¿Qué problema se está resolviendo?
 * Cuando un objeto tiene muchos atributos opcionales (por ejemplo una pizza
 * con múltiples ingredientes, tamaños y tipos de masa), el constructor
 * tradicional se vuelve inmanejable: tendríamos que pasar todos los
 * parámetros aunque no todos sean obligatorios, o crear multitud de
 * constructores sobrecargados. Esto genera código difícil de leer y mantener.
 *
 * ¿Por qué el patrón Builder es adecuado?
 * Builder resuelve este problema permitiendo configurar el objeto
 * llamando solo los métodos que necesitamos, en el orden que queramos,
 * y al final llamar a build() para obtener el objeto completamente
 * configurado. El código resultante es legible, fluido (fluent interface)
 * y fácil de extender con nuevas opciones sin romper el código existente.
 *
 * Ejemplo: Pedido de Pizza personalizada en un restaurante.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Producto ───────────────────────────────────────────────────────────────
// Representa el objeto complejo que queremos construir.
// Tiene muchos atributos opcionales que hacen complicado un constructor normal.

class Pizza {
    public tamano: string = 'Mediana';
    public masa: string = 'Tradicional';
    public salsa: string = 'Tomate';
    public queso: string = 'Mozzarella';
    public ingredientes: string[] = [];

    // Muestra el resumen del pedido
    mostrarPedido(): void {
        console.log(`
  ╔══════════════════════════════╗
  ║       PEDIDO DE PIZZA        ║
  ╠══════════════════════════════╣
  ║ Tamaño    : ${this.tamano.padEnd(17)}║
  ║ Masa      : ${this.masa.padEnd(17)}║
  ║ Salsa     : ${this.salsa.padEnd(17)}║
  ║ Queso     : ${this.queso.padEnd(17)}║
  ║ Extras    : ${this.ingredientes.join(', ').padEnd(17)}║
  ╚══════════════════════════════╝`);
    }
}

// ─── Builder ─────────────────────────────────────────────────────────────────
// Clase que construye la pizza paso a paso.
// Cada método retorna `this` para permitir el encadenamiento fluido.

class PizzaBuilder {
    // Cada nueva construcción parte de una pizza con valores predeterminados
    private pizza: Pizza;

    constructor() {
        this.pizza = new Pizza();
    }

    setTamano(tamano: string): PizzaBuilder {
        this.pizza.tamano = tamano;
        return this; // retornamos this para encadenar llamadas
    }

    setMasa(masa: string): PizzaBuilder {
        this.pizza.masa = masa;
        return this;
    }

    setSalsa(salsa: string): PizzaBuilder {
        this.pizza.salsa = salsa;
        return this;
    }

    setQueso(queso: string): PizzaBuilder {
        this.pizza.queso = queso;
        return this;
    }

    agregarIngrediente(ingrediente: string): PizzaBuilder {
        this.pizza.ingredientes.push(ingrediente);
        return this;
    }

    // build() es el paso final: devuelve el objeto completamente configurado
    build(): Pizza {
        return this.pizza;
    }
}

// ─── Cliente ─────────────────────────────────────────────────────────────────
// El cliente usa el builder para crear las pizzas que necesita,
// configurando solo los atributos que le interesan.

function main() {

    // Pizza sencilla: solo cambiamos el tamaño
    const pizzaSencilla = new PizzaBuilder()
        .setTamano('Personal')
        .build();

    console.log('%cPizza Sencilla:', COLORS.blue);
    pizzaSencilla.mostrarPedido();

    // Pizza especial: configuración completa
    const pizzaEspecial = new PizzaBuilder()
        .setTamano('Familiar')
        .setMasa('Masa Delgada')
        .setSalsa('BBQ')
        .setQueso('Doble Mozzarella')
        .agregarIngrediente('Pepperoni')
        .agregarIngrediente('Champiñones')
        .agregarIngrediente('Pimentón')
        .build();

    console.log('%cPizza Especial:', COLORS.red);
    pizzaEspecial.mostrarPedido();

    // Pizza vegetariana
    const pizzaVegetariana = new PizzaBuilder()
        .setTamano('Grande')
        .setMasa('Integral')
        .setSalsa('Pesto')
        .agregarIngrediente('Tomate Cherry')
        .agregarIngrediente('Espinaca')
        .agregarIngrediente('Aceitunas')
        .build();

    console.log('%cPizza Vegetariana:', COLORS.green);
    pizzaVegetariana.mostrarPedido();
}

main();
