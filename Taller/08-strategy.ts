/**
 * ! Patrón Strategy
 *
 * ¿Qué hace el patrón?
 * Strategy es un patrón de diseño de comportamiento que define una familia de
 * algoritmos, encapsula cada uno en su propia clase y los hace intercambiables
 * en tiempo de ejecución. El objeto que usa el algoritmo (contexto) no sabe
 * cómo está implementado; solo llama a una interfaz común.
 *
 * ¿Qué problema se está resolviendo?
 * Una tienda en línea necesita calcular el costo del envío de un pedido.
 * Existen varias empresas de mensajería disponibles (Nacional Exprés, Envía
 * Rápido, Courier Premium) y cada una usa su propia fórmula de precio. Si
 * ponemos todos los cálculos dentro de la clase `Pedido` con condicionales
 * if/else, agregar o cambiar una empresa de mensajería obliga a modificar esa
 * clase central, violando el principio Abierto/Cerrado.
 *
 * ¿Por qué el patrón Strategy es adecuado?
 * Cada algoritmo de cálculo se encapsula en su propia clase que implementa la
 * interfaz `EstrategiaEnvio`. El `Pedido` solo conoce esa interfaz y delega
 * el cálculo a la estrategia asignada. Cambiar de mensajería es tan simple como
 * asignar una estrategia diferente, sin tocar la clase `Pedido`. Agregar un
 * nuevo proveedor equivale a crear una nueva clase de estrategia.
 *
 * Ejemplo: Cálculo de costo de envío con múltiples proveedores de mensajería.
 *
 * https://refactoring.guru/es/design-patterns/strategy
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Estrategia ──────────────────────────────────────────────────────
// Contrato común que todas las estrategias de envío deben cumplir.

interface EstrategiaEnvio {
    readonly nombre: string;
    calcularCosto(pesoKg: number, distanciaKm: number): number;
}

// ─── Estrategias Concretas ────────────────────────────────────────────────────
// Cada clase encapsula un algoritmo de cálculo diferente.

// Envío estándar: tarifa base + peso + pequeño recargo por distancia
class EnvioEstandar implements EstrategiaEnvio {
    readonly nombre = 'Nacional Exprés (Estándar)';

    calcularCosto(pesoKg: number, distanciaKm: number): number {
        return 5_000 + (pesoKg * 1_200) + (distanciaKm * 10);
    }
}

// Envío económico: solo cobra por peso, ideal para distancias largas
class EnvioEconomico implements EstrategiaEnvio {
    readonly nombre = 'Envía Rápido (Económico)';

    calcularCosto(pesoKg: number, _distanciaKm: number): number {
        return 3_000 + (pesoKg * 900);
    }
}

// Envío premium: tarifa plana alta pero garantiza entrega en 24 h
class EnvioPremium implements EstrategiaEnvio {
    readonly nombre = 'Courier Premium (24 h)';

    calcularCosto(pesoKg: number, distanciaKm: number): number {
        return 15_000 + (pesoKg * 2_000) + (distanciaKm * 25);
    }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
// Mantiene una referencia a la estrategia activa y delega el cálculo en ella.
// No contiene ningún algoritmo de envío dentro de sí mismo.

class Pedido {
    private estrategia: EstrategiaEnvio;

    constructor(
        private readonly cliente: string,
        private readonly pesoKg: number,
        private readonly distanciaKm: number,
        estrategiaInicial: EstrategiaEnvio
    ) {
        this.estrategia = estrategiaInicial;
    }

    // Permite cambiar la mensajería en tiempo de ejecución sin recrear el pedido
    cambiarMensajeria(nuevaEstrategia: EstrategiaEnvio): void {
        console.log(
            `%c[Pedido] Cambiando mensajería a: ${nuevaEstrategia.nombre}`,
            COLORS.yellow
        );
        this.estrategia = nuevaEstrategia;
    }

    // Calcula y muestra el costo delegando completamente en la estrategia activa
    mostrarCotizacion(): void {
        const costo = this.estrategia.calcularCosto(this.pesoKg, this.distanciaKm);
        console.log(
            `%c[${this.cliente}] Proveedor: ${this.estrategia.nombre} | ` +
            `Peso: ${this.pesoKg} kg | Distancia: ${this.distanciaKm} km | ` +
            `Costo envío: $${costo.toLocaleString('es-CO')}`,
            COLORS.cyan
        );
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {
    const estandar  = new EnvioEstandar();
    const economico = new EnvioEconomico();
    const premium   = new EnvioPremium();

    // Pedido 1: cliente busca la opción más económica para un paquete grande
    console.log(`\n%c══ Cotizaciones para pedido de Santiago ══`, COLORS.orange);
    const pedido1 = new Pedido('Santiago Martinez', 8, 200, estandar);
    pedido1.mostrarCotizacion();

    pedido1.cambiarMensajeria(economico);
    pedido1.mostrarCotizacion();

    pedido1.cambiarMensajeria(premium);
    pedido1.mostrarCotizacion();

    // Pedido 2: paquete pequeño y el cliente elige envío premium directamente
    console.log(`\n%c══ Cotización para pedido de Laura ══`, COLORS.orange);
    const pedido2 = new Pedido('Laura Toro', 1.5, 50, premium);
    pedido2.mostrarCotizacion();

    // Cambia a estándar porque el precio premium es muy alto para ese peso
    pedido2.cambiarMensajeria(estandar);
    pedido2.mostrarCotizacion();
}

main();
