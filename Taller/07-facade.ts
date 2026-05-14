/**
 * ! Patrón Facade
 *
 * ¿Qué hace el patrón?
 * Facade es un patrón de diseño estructural que proporciona una interfaz
 * simplificada y unificada para un conjunto de subsistemas complejos.
 * Oculta la complejidad interna y expone solo lo que el cliente necesita,
 * reduciendo la cantidad de objetos con los que el cliente debe interactuar.
 *
 * ¿Qué problema se está resolviendo?
 * Realizar un pedido en línea involucra múltiples subsistemas independientes:
 * verificar stock en el inventario, procesar el pago, generar la factura y
 * despachar el envío. Si el cliente tuviera que coordinar todos estos pasos
 * manualmente cada vez que se hace un pedido, el código del cliente sería
 * complejo, frágil y difícil de mantener. Cualquier cambio en un subsistema
 * afectaría directamente al cliente.
 *
 * ¿Por qué el patrón Facade es adecuado?
 * Facade agrupa toda esa orquestación en un único método (`realizarPedido`).
 * El cliente solo llama a ese método y la fachada se encarga de coordinar los
 * subsistemas en el orden correcto. Si mañana se cambia el proveedor de pagos
 * o la lógica del inventario, solo se modifica la fachada — el cliente no
 * se ve afectado. También facilita las pruebas, ya que se puede mockear la
 * fachada completa en vez de todos los subsistemas individuales.
 *
 * Ejemplo: Sistema de pedidos en línea (inventario, pagos, facturación, envío).
 *
 * https://refactoring.guru/es/design-patterns/facade
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Subsistemas ──────────────────────────────────────────────────────────────
// Cada subsistema tiene su propia lógica compleja e independiente.
// El cliente NO debería interactuar directamente con ellos.

// Subsistema 1: gestiona el stock de productos
class ServicioInventario {
    private stock: Record<string, number> = {
        'Teclado Mecánico': 5,
        'Monitor 4K':       2,
        'Mouse Gamer':      0,   // sin stock
    };

    verificarStock(producto: string, cantidad: number): boolean {
        const disponible = this.stock[producto] ?? 0;
        if (disponible >= cantidad) {
            console.log(`  %c[Inventario] ✔ Stock disponible: ${disponible} unidades de "${producto}"`, COLORS.green);
            return true;
        }
        console.log(`  %c[Inventario] ✘ Sin stock suficiente de "${producto}" (disponible: ${disponible})`, COLORS.red);
        return false;
    }

    reservarStock(producto: string, cantidad: number): void {
        this.stock[producto] -= cantidad;
        console.log(`  %c[Inventario] Reservadas ${cantidad} unidad(es) de "${producto}"`, COLORS.green);
    }
}

// Subsistema 2: procesa los pagos
class ServicioPagos {
    procesarPago(monto: number, metodoPago: string): boolean {
        console.log(`  %c[Pagos] Procesando $${monto} con ${metodoPago}...`, COLORS.yellow);
        // Simulamos aprobación (en real llamaría a una API de pagos)
        const aprobado = monto > 0;
        if (aprobado) {
            console.log(`  %c[Pagos] ✔ Pago aprobado`, COLORS.green);
        } else {
            console.log(`  %c[Pagos] ✘ Pago rechazado`, COLORS.red);
        }
        return aprobado;
    }
}

// Subsistema 3: genera facturas
class ServicioFacturacion {
    private consecutivo: number = 1000;

    generarFactura(cliente: string, producto: string, total: number): string {
        const numeroFactura = `FAC-${++this.consecutivo}`;
        console.log(
            `  %c[Facturación] Factura ${numeroFactura} generada → Cliente: ${cliente} | Producto: ${producto} | Total: $${total}`,
            COLORS.blue
        );
        return numeroFactura;
    }
}

// Subsistema 4: gestiona el despacho y envío
class ServicioEnvio {
    programarEnvio(cliente: string, producto: string, factura: string): void {
        console.log(
            `  %c[Envío] Paquete de "${producto}" programado para ${cliente} | Ref. factura: ${factura}`,
            COLORS.cyan
        );
    }
}

// ─── Facade ───────────────────────────────────────────────────────────────────
// Orquesta todos los subsistemas y expone una interfaz simple al cliente.

class TiendaOnlineFacade {
    // La fachada posee referencias a todos los subsistemas
    private inventario: ServicioInventario;
    private pagos: ServicioPagos;
    private facturacion: ServicioFacturacion;
    private envio: ServicioEnvio;

    constructor() {
        this.inventario   = new ServicioInventario();
        this.pagos        = new ServicioPagos();
        this.facturacion  = new ServicioFacturacion();
        this.envio        = new ServicioEnvio();
    }

    /**
     * Método unificado que el cliente llama para completar un pedido.
     * Internamente coordina inventario → pago → factura → envío.
     */
    realizarPedido(
        cliente: string,
        producto: string,
        cantidad: number,
        precioPorUnidad: number,
        metodoPago: string
    ): void {
        const total = precioPorUnidad * cantidad;

        console.log(`\n%c╔══ Procesando pedido de ${cliente} ══`, COLORS.orange);
        console.log(`%c║  Producto: ${producto} | Cantidad: ${cantidad} | Total: $${total}`, COLORS.white);

        // Paso 1: verificar stock
        if (!this.inventario.verificarStock(producto, cantidad)) {
            console.log(`%c╚══ Pedido cancelado por falta de stock\n`, COLORS.red);
            return;
        }

        // Paso 2: procesar el pago
        if (!this.pagos.procesarPago(total, metodoPago)) {
            console.log(`%c╚══ Pedido cancelado por fallo en el pago\n`, COLORS.red);
            return;
        }

        // Paso 3: reservar el stock
        this.inventario.reservarStock(producto, cantidad);

        // Paso 4: generar factura
        const factura = this.facturacion.generarFactura(cliente, producto, total);

        // Paso 5: programar envío
        this.envio.programarEnvio(cliente, producto, factura);

        console.log(`%c╚══ ¡Pedido completado exitosamente!\n`, COLORS.green);
    }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────
// El cliente solo conoce la fachada. No sabe nada de los subsistemas internos.

function main() {

    // Un único objeto es todo lo que el cliente necesita
    const tienda = new TiendaOnlineFacade();

    // Pedido exitoso
    tienda.realizarPedido('Santiago Martinez', 'Teclado Mecánico', 1, 150, 'Tarjeta de Crédito');

    // Pedido sin stock disponible
    tienda.realizarPedido('Laura Toro', 'Mouse Gamer', 2, 80, 'PayPal');

    // Segundo pedido exitoso
    tienda.realizarPedido('Laura Toro', 'Monitor 4K', 1, 450, 'Transferencia Bancaria');
}

main();
