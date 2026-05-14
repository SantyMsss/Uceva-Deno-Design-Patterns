/**
 * ! Patrón Adapter
 *
 * ¿Qué hace el patrón?
 * Adapter es un patrón de diseño estructural que permite que dos interfaces
 * incompatibles trabajen juntas. Actúa como un "traductor" entre la interfaz
 * que espera el cliente y la interfaz que ofrece el componente externo.
 *
 * ¿Qué problema se está resolviendo?
 * Nuestra aplicación de e-commerce espera que cualquier pasarela de pago
 * tenga el método `procesarPago(monto: number)`.
 * Sin embargo, la librería externa de pago que queremos integrar
 * (p. ej. `PasarelaExterna`) solo expone el método
 * `realizarTransaccion(cantidad: number, moneda: string)`.
 * No podemos modificar la librería externa, y tampoco queremos
 * cambiar todo el código de nuestra aplicación.
 *
 * ¿Por qué el patrón Adapter es adecuado?
 * En lugar de reescribir la librería externa o acoplar nuestra aplicación a
 * su interfaz particular, creamos un Adaptador que implementa la interfaz
 * que espera nuestra app (`PasarelaDePago`) y, por dentro, delega las
 * llamadas a la librería externa traduciendo los parámetros necesarios.
 * Así integramos código incompatible sin modificar ninguna de las dos partes.
 *
 * Ejemplo: Integración de una pasarela de pago externa en una tienda en línea.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz esperada por el cliente ────────────────────────────────────────
// Esta es la interfaz que nuestra aplicación conoce y usa.
// Todos los procesadores de pago deben cumplirla.

interface PasarelaDePago {
    procesarPago(monto: number): void;
}

// ─── Clase existente (Adaptada) ───────────────────────────────────────────────
// Simula una librería de terceros que NO podemos modificar.
// Su interfaz es incompatible con lo que necesita nuestra app.

class PasarelaExterna {
    // La librería externa usa un nombre de método y firma diferentes
    realizarTransaccion(cantidad: number, moneda: string): void {
        console.log(
            `%c[PasarelaExterna] Transacción realizada: ${cantidad} ${moneda}`,
            COLORS.purple
        );
    }
}

// ─── Adaptador ────────────────────────────────────────────────────────────────
// Implementa la interfaz que espera nuestra app (PasarelaDePago)
// y traduce las llamadas hacia la librería externa (PasarelaExterna).

class AdaptadorPasarela implements PasarelaDePago {
    // Referencia a la instancia de la clase externa que adaptamos
    private pasarelaExterna: PasarelaExterna;
    private moneda: string;

    constructor(pasarelaExterna: PasarelaExterna, moneda: string = 'COP') {
        this.pasarelaExterna = pasarelaExterna;
        this.moneda = moneda;
    }

    // Implementamos el método que espera nuestra app...
    procesarPago(monto: number): void {
        console.log(`%c[Adaptador] Convirtiendo llamada para la pasarela externa...`, COLORS.yellow);
        // ...y lo traducimos al método de la librería externa
        this.pasarelaExterna.realizarTransaccion(monto, this.moneda);
    }
}

// ─── Tienda (Cliente) ─────────────────────────────────────────────────────────
// El cliente solo conoce la interfaz PasarelaDePago.
// No sabe si detrás hay una clase propia o un adaptador hacia un tercero.

class TiendaEnLinea {
    private pasarela: PasarelaDePago;

    constructor(pasarela: PasarelaDePago) {
        this.pasarela = pasarela;
    }

    comprar(producto: string, precio: number): void {
        console.log(`%cComprando: ${producto} por $${precio}`, COLORS.blue);
        // La tienda llama siempre al mismo método, sin importar la implementación
        this.pasarela.procesarPago(precio);
        console.log('%c¡Compra exitosa!\n', COLORS.green);
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {

    // Instanciamos la librería externa (no la podemos cambiar)
    const pasarelaExterna = new PasarelaExterna();

    // Envolvemos la librería en el adaptador para que sea compatible con nuestra app
    const adaptador = new AdaptadorPasarela(pasarelaExterna, 'USD');

    // La tienda trabaja normalmente con la interfaz PasarelaDePago
    const tienda = new TiendaEnLinea(adaptador);

    tienda.comprar('Teclado Mecánico', 150);
    tienda.comprar('Monitor 4K', 450);
    tienda.comprar('Mouse Gamer', 80);
}

main();
