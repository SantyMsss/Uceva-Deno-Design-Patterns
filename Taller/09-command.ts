/**
 * ! Patrón Command
 *
 * ¿Qué hace el patrón?
 * Command es un patrón de diseño de comportamiento que convierte una solicitud
 * en un objeto independiente que contiene toda la información sobre esa
 * solicitud. Esto permite parametrizar métodos con diferentes solicitudes,
 * encolar o registrar operaciones y, sobre todo, implementar operaciones
 * reversibles (deshacer / rehacer).
 *
 * ¿Qué problema se está resolviendo?
 * Un editor de texto necesita que el usuario pueda escribir, borrar texto y
 * deshacer (Ctrl + Z) o rehacer (Ctrl + Y) cualquier acción anterior. Si la
 * lógica de deshacer se implementa directamente en los botones o atajos de
 * teclado, el editor se llena de condicionales complejos y es muy difícil
 * agregar nuevas acciones sin romper el mecanismo de historial.
 *
 * ¿Por qué el patrón Command es adecuado?
 * Cada acción del editor (Escribir, Borrar) se encapsula en su propia clase
 * de comando que implementa los métodos `ejecutar()` y `deshacer()`. Un
 * `HistorialComandos` actúa como invocador: guarda los comandos ejecutados
 * en una pila y los revierte en orden inverso cuando el usuario deshace.
 * Agregar una nueva acción (p.ej. Negrita) solo requiere crear una nueva clase
 * de comando — el historial no cambia.
 *
 * Ejemplo: Editor de texto con soporte de deshacer (Ctrl+Z) y rehacer (Ctrl+Y).
 *
 * https://refactoring.guru/es/design-patterns/command
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Receptor ─────────────────────────────────────────────────────────────────
// El objeto sobre el que recaen las operaciones reales: el documento de texto.

class Documento {
    private contenido: string = '';

    escribir(texto: string): void {
        this.contenido += texto;
    }

    borrar(cantidad: number): void {
        this.contenido = this.contenido.slice(0, -cantidad);
    }

    obtenerContenido(): string {
        return this.contenido;
    }
}

// ─── Interfaz Comando ─────────────────────────────────────────────────────────
// Todos los comandos deben poder ejecutarse y deshacerse.

interface Comando {
    ejecutar(): void;
    deshacer(): void;
}

// ─── Comandos Concretos ───────────────────────────────────────────────────────
// Cada comando encapsula una acción sobre el Documento y sabe cómo revertirla.

// Comando que agrega texto al documento
class ComandoEscribir implements Comando {
    constructor(
        private readonly documento: Documento,
        private readonly texto: string
    ) {}

    ejecutar(): void {
        this.documento.escribir(this.texto);
        console.log(`%c[Escribir] Texto agregado: "${this.texto}"`, COLORS.green);
    }

    // Deshacer equivale a eliminar la misma cantidad de caracteres que se escribió
    deshacer(): void {
        this.documento.borrar(this.texto.length);
        console.log(`%c[Deshacer] Texto eliminado: "${this.texto}"`, COLORS.yellow);
    }
}

// Comando que elimina los últimos N caracteres del documento
class ComandoBorrar implements Comando {
    private textoBorrado: string = '';

    constructor(
        private readonly documento: Documento,
        private readonly cantidad: number
    ) {}

    ejecutar(): void {
        const contenido = this.documento.obtenerContenido();
        // Guardamos el texto que se va a eliminar para poder restaurarlo al deshacer
        this.textoBorrado = contenido.slice(-this.cantidad);
        this.documento.borrar(this.cantidad);
        console.log(`%c[Borrar] Eliminados ${this.cantidad} caracteres: "${this.textoBorrado}"`, COLORS.red);
    }

    // Deshacer restaura exactamente el texto que fue borrado
    deshacer(): void {
        this.documento.escribir(this.textoBorrado);
        console.log(`%c[Deshacer] Texto restaurado: "${this.textoBorrado}"`, COLORS.yellow);
    }
}

// ─── Invocador ────────────────────────────────────────────────────────────────
// Gestiona el historial de comandos y expone las operaciones deshacer/rehacer.

class HistorialComandos {
    private pilaDeshacer: Comando[] = [];
    private pilaRehacer:  Comando[] = [];

    ejecutar(comando: Comando): void {
        comando.ejecutar();
        this.pilaDeshacer.push(comando);
        // Cualquier nueva acción invalida la pila de rehacer
        this.pilaRehacer = [];
    }

    deshacer(): void {
        const comando = this.pilaDeshacer.pop();
        if (!comando) {
            console.log(`%c[Historial] No hay acciones para deshacer`, COLORS.gray);
            return;
        }
        comando.deshacer();
        this.pilaRehacer.push(comando);
    }

    rehacer(): void {
        const comando = this.pilaRehacer.pop();
        if (!comando) {
            console.log(`%c[Historial] No hay acciones para rehacer`, COLORS.gray);
            return;
        }
        comando.ejecutar();
        this.pilaDeshacer.push(comando);
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function mostrarEstado(doc: Documento): void {
    console.log(`%c  → Documento: "${doc.obtenerContenido()}"`, COLORS.cyan);
}

function main() {
    const documento  = new Documento();
    const historial  = new HistorialComandos();

    console.log(`\n%c══ Editor de texto con deshacer/rehacer ══`, COLORS.orange);

    // El usuario escribe
    historial.ejecutar(new ComandoEscribir(documento, 'Hola, '));
    mostrarEstado(documento);

    historial.ejecutar(new ComandoEscribir(documento, 'mundo'));
    mostrarEstado(documento);

    historial.ejecutar(new ComandoEscribir(documento, '!'));
    mostrarEstado(documento);

    // El usuario borra el signo de exclamación
    console.log(`\n%c── El usuario borra 1 carácter ──`, COLORS.purple);
    historial.ejecutar(new ComandoBorrar(documento, 1));
    mostrarEstado(documento);

    // Ctrl + Z × 2 — deshace el borrado y el último "mundo"
    console.log(`\n%c── Ctrl+Z (deshacer) ──`, COLORS.purple);
    historial.deshacer();
    mostrarEstado(documento);

    historial.deshacer();
    mostrarEstado(documento);

    // Ctrl + Y — rehace "mundo"
    console.log(`\n%c── Ctrl+Y (rehacer) ──`, COLORS.purple);
    historial.rehacer();
    mostrarEstado(documento);

    // Escribe algo nuevo — invalida la pila de rehacer
    console.log(`\n%c── Nueva escritura (invalida rehacer) ──`, COLORS.purple);
    historial.ejecutar(new ComandoEscribir(documento, ' desde Colombia'));
    mostrarEstado(documento);

    // Intentar rehacer sin nada en la pila
    historial.rehacer();
}

main();
