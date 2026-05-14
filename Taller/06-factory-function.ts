/**
 * ! Patrón Factory Function
 *
 * ¿Qué hace el patrón?
 * Factory Function es un patrón de diseño creacional que consiste en usar una
 * función para crear y retornar objetos (o funciones) configurados de forma
 * dinámica. A diferencia de una clase, no requiere `new` ni herencia; la
 * función actúa como una "fábrica" que encapsula la lógica de creación y
 * retorna objetos listos para usar.
 *
 * ¿Qué problema se está resolviendo?
 * En un sistema de notificaciones, queremos enviar mensajes por distintos
 * canales (Email, SMS, Push). Cada canal tiene su propia lógica de envío,
 * pero el resto de la aplicación solo quiere llamar a `enviar(mensaje)` sin
 * importarle qué canal se usa. Crear instancias de clases específicas por
 * todas partes acopla el código al canal concreto.
 *
 * ¿Por qué el patrón Factory Function es adecuado?
 * La Factory Function `crearNotificador` recibe el canal como parámetro y
 * devuelve un objeto notificador ya configurado con su lógica particular.
 * El código que usa el notificador no sabe ni le importa cómo está
 * implementado por dentro. Agregar un nuevo canal es tan sencillo como añadir
 * un caso más en la fábrica, sin tocar el código consumidor. Es especialmente
 * útil en TypeScript/JavaScript donde las funciones son ciudadanos de primera
 * clase y este patrón resulta más natural que las clases en muchos contextos.
 *
 * Ejemplo: Sistema de notificaciones multi-canal (Email, SMS, Push).
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Tipo del objeto que devuelve la fábrica ──────────────────────────────────
// Cualquier notificador, sin importar el canal, debe cumplir esta forma.

type Notificador = {
    canal: string;
    enviar: (destinatario: string, mensaje: string) => void;
};

// ─── Factory Function ─────────────────────────────────────────────────────────
// Recibe el canal deseado y retorna un notificador listo para usar.
// El cliente no necesita saber qué objeto concreto hay detrás.

type Canal = 'email' | 'sms' | 'push';

function crearNotificador(canal: Canal): Notificador {
    // Cada caso configura la lógica específica del canal y retorna el objeto
    switch (canal) {

        case 'email':
            return {
                canal: 'Email',
                enviar(destinatario: string, mensaje: string): void {
                    console.log(
                        `%c[Email] %cPara: ${destinatario} | Asunto: Notificación | Cuerpo: ${mensaje}`,
                        COLORS.blue, COLORS.white
                    );
                }
            };

        case 'sms':
            return {
                canal: 'SMS',
                enviar(destinatario: string, mensaje: string): void {
                    // Los SMS tienen límite de caracteres — recortamos si es necesario
                    const textoCorto = mensaje.length > 60
                        ? mensaje.substring(0, 57) + '...'
                        : mensaje;
                    console.log(
                        `%c[SMS] %cA: ${destinatario} | Texto (max 60 chars): "${textoCorto}"`,
                        COLORS.green, COLORS.white
                    );
                }
            };

        case 'push':
            return {
                canal: 'Push',
                enviar(destinatario: string, mensaje: string): void {
                    console.log(
                        `%c[Push] %c🔔 Notificación push enviada a [${destinatario}]: ${mensaje}`,
                        COLORS.orange, COLORS.white
                    );
                }
            };

        default:
            // TypeScript garantiza exhaustividad, pero lo manejamos igualmente
            throw new Error(`Canal desconocido: ${canal}`);
    }
}

// ─── Servicio de notificaciones (Cliente) ─────────────────────────────────────
// Solo conoce la interfaz Notificador. No sabe cómo está implementado cada canal.

function enviarAlertas(notificador: Notificador, usuarios: string[], mensaje: string): void {
    console.log(`\n%c── Enviando por ${notificador.canal} ──`, COLORS.cyan);
    for (const usuario of usuarios) {
        notificador.enviar(usuario, mensaje);
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {

    const usuarios = ['santiago.martinez', 'laura.toro', 'admin'];
    const mensajeCorto = 'Tu pedido ha sido confirmado.';
    const mensajeLargo = 'Tu pedido #4892 ha sido confirmado y será entregado en un plazo de 3 a 5 días hábiles a la dirección registrada.';

    // La fábrica crea cada notificador según el canal solicitado
    const notificadorEmail = crearNotificador('email');
    const notificadorSMS   = crearNotificador('sms');
    const notificadorPush  = crearNotificador('push');

    // El servicio usa siempre la misma función; el canal es transparente
    enviarAlertas(notificadorEmail, usuarios, mensajeLargo);
    enviarAlertas(notificadorSMS,   usuarios, mensajeLargo);  // quedará recortado
    enviarAlertas(notificadorPush,  usuarios, mensajeCorto);

    // También podemos crear notificadores dinámicamente en tiempo de ejecución
    console.log('\n%c── Selección dinámica de canal ──', COLORS.cyan);
    const canales: Canal[] = ['email', 'sms', 'push'];
    for (const canal of canales) {
        const notificador = crearNotificador(canal);
        notificador.enviar('usuario.dinamico', `Mensaje de prueba vía ${notificador.canal}`);
    }
}

main();
