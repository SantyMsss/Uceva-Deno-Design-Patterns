/**
 * ! Patrón State
 *
 * ¿Qué hace el patrón?
 * State es un patrón de diseño de comportamiento que permite que un objeto
 * altere su comportamiento cuando su estado interno cambia. El objeto parecerá
 * cambiar de clase porque delega su comportamiento en objetos de estado
 * intercambiables, en lugar de usar bloques if/else o switch.
 *
 * ¿Qué problema se está resolviendo?
 * Un semáforo de tráfico tiene tres estados bien definidos: Rojo, Amarillo y
 * Verde. En cada estado el semáforo se comporta diferente (qué color muestra,
 * cuánto dura, cuál es el siguiente estado). Implementar esto con una sola
 * clase llena de condicionales hace el código difícil de mantener: agregar un
 * nuevo estado (por ejemplo, Verde intermitente peatonal) obliga a modificar
 * varios bloques if en la clase principal.
 *
 * ¿Por qué el patrón State es adecuado?
 * Cada estado del semáforo (Rojo, Amarillo, Verde) se encapsula en su propia
 * clase que implementa la interfaz `EstadoSemaforo`. La clase `Semaforo`
 * (contexto) solo mantiene una referencia al estado actual y delega en él.
 * Cuando el estado decide que es hora de avanzar, llama a
 * `semaforo.cambiarEstado(nuevoEstado)`. Agregar un nuevo estado es tan
 * simple como crear una nueva clase — el contexto no cambia.
 *
 * Ejemplo: Semáforo de tráfico que cicla entre Rojo, Verde y Amarillo.
 *
 * https://refactoring.guru/es/design-patterns/state
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Estado ──────────────────────────────────────────────────────────
// Contrato que todos los estados concretos deben implementar.

interface EstadoSemaforo {
    manejarCambio(semaforo: Semaforo): void;
    obtenerDescripcion(): string;
    obtenerColor(): string;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
// Mantiene el estado actual y expone un método para cambiarlo.

class Semaforo {
    private estado: EstadoSemaforo;
    private ciclo: number = 0;

    constructor(estadoInicial: EstadoSemaforo) {
        this.estado = estadoInicial;
        console.log(`%c[Semáforo] Iniciado en estado: ${this.estado.obtenerDescripcion()}`, COLORS.gray);
    }

    // Permite que los estados se reemplacen entre sí
    cambiarEstado(nuevoEstado: EstadoSemaforo): void {
        this.estado = nuevoEstado;
    }

    // Avanza al siguiente estado delegando en el estado actual
    avanzar(): void {
        this.ciclo++;
        console.log(`\n%c── Ciclo ${this.ciclo} ──`, COLORS.gray);
        this.estado.manejarCambio(this);
    }

    mostrarEstado(): void {
        console.log(
            `%c[${this.estado.obtenerColor()}] ${this.estado.obtenerDescripcion()}`,
            this.estado.obtenerColor() === '🔴 ROJO'
                ? COLORS.red
                : this.estado.obtenerColor() === '🟡 AMARILLO'
                ? COLORS.yellow
                : COLORS.green
        );
    }
}

// ─── Estados Concretos ────────────────────────────────────────────────────────
// Cada clase encapsula el comportamiento de un estado y determina la transición.

class EstadoRojo implements EstadoSemaforo {
    manejarCambio(semaforo: Semaforo): void {
        console.log(`%c[Rojo] Vehículos detenidos. Peatones pueden cruzar.`, COLORS.red);
        // Después de Rojo viene Verde
        semaforo.cambiarEstado(new EstadoVerde());
        semaforo.mostrarEstado();
    }

    obtenerDescripcion(): string {
        return 'ALTO — Vehículos detenidos';
    }

    obtenerColor(): string {
        return '🔴 ROJO';
    }
}

class EstadoVerde implements EstadoSemaforo {
    manejarCambio(semaforo: Semaforo): void {
        console.log(`%c[Verde] Vehículos circulando. Peatones deben esperar.`, COLORS.green);
        // Después de Verde viene Amarillo
        semaforo.cambiarEstado(new EstadoAmarillo());
        semaforo.mostrarEstado();
    }

    obtenerDescripcion(): string {
        return 'AVANCE — Vehículos circulando';
    }

    obtenerColor(): string {
        return '🟢 VERDE';
    }
}

class EstadoAmarillo implements EstadoSemaforo {
    manejarCambio(semaforo: Semaforo): void {
        console.log(`%c[Amarillo] Precaución. Vehículos preparándose para detenerse.`, COLORS.yellow);
        // Después de Amarillo vuelve Rojo — ciclo completo
        semaforo.cambiarEstado(new EstadoRojo());
        semaforo.mostrarEstado();
    }

    obtenerDescripcion(): string {
        return 'PRECAUCIÓN — Prepararse para detenerse';
    }

    obtenerColor(): string {
        return '🟡 AMARILLO';
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {
    console.log(`\n%c══ Simulación de semáforo de tráfico ══`, COLORS.orange);

    // El semáforo arranca en Rojo
    const semaforo = new Semaforo(new EstadoRojo());
    semaforo.mostrarEstado();

    // Simulamos 6 cambios de estado (2 ciclos completos: Rojo→Verde→Amarillo→Rojo→...)
    for (let i = 0; i < 6; i++) {
        semaforo.avanzar();
    }
}

main();
