/**
 * ! Patrón Observer
 *
 * ¿Qué hace el patrón?
 * Observer es un patrón de diseño de comportamiento que define una dependencia
 * de uno a muchos entre objetos. Cuando el objeto central (Sujeto) cambia su
 * estado, todos sus dependientes (Observadores) son notificados y actualizados
 * automáticamente.
 *
 * ¿Qué problema se está resolviendo?
 * En una aplicación de alertas de clima, múltiples dispositivos (app móvil,
 * panel LCD, sistema de alertas por correo) necesitan reaccionar cada vez que
 * la estación meteorológica registra un nuevo dato (temperatura, humedad,
 * presión). Si cada dispositivo consultara constantemente a la estación
 * (polling), gastaríamos recursos innecesarios y la información no sería
 * en tiempo real.
 *
 * ¿Por qué el patrón Observer es adecuado?
 * Con Observer, la estación meteorológica actúa como Sujeto: mantiene una
 * lista de dispositivos suscritos y los notifica automáticamente cuando sus
 * datos cambian. Cada dispositivo implementa su propia lógica de reacción.
 * Esto desacopla la fuente de datos de sus consumidores: podemos agregar o
 * quitar dispositivos sin tocar la clase de la estación meteorológica, y la
 * estación no necesita saber nada sobre los dispositivos concretos.
 *
 * Ejemplo: Estación meteorológica con múltiples paneles de visualización.
 *
 * https://refactoring.guru/es/design-patterns/observer
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Interfaz Observador ──────────────────────────────────────────────────────
// Todos los dispositivos que quieran recibir actualizaciones deben implementarla.

interface Observador {
    actualizar(temperatura: number, humedad: number, presion: number): void;
}

// ─── Sujeto (Estación Meteorológica) ─────────────────────────────────────────
// Mantiene la lista de observadores y los notifica cuando cambian sus datos.

class EstacionMeteorologica {
    private observadores: Observador[] = [];

    // Estado interno que, al cambiar, dispara las notificaciones
    private temperatura: number = 0;
    private humedad: number = 0;
    private presion: number = 0;

    // Suscribir un dispositivo a las actualizaciones
    suscribir(observador: Observador): void {
        this.observadores.push(observador);
        console.log(`%c[Estación] Nuevo dispositivo suscrito. Total: ${this.observadores.length}`, COLORS.green);
    }

    // Desuscribir un dispositivo
    desuscribir(observador: Observador): void {
        this.observadores = this.observadores.filter(o => o !== observador);
        console.log(`%c[Estación] Dispositivo desconectado. Total: ${this.observadores.length}`, COLORS.red);
    }

    // Notifica a TODOS los observadores registrados con el estado actual
    private notificar(): void {
        for (const observador of this.observadores) {
            observador.actualizar(this.temperatura, this.humedad, this.presion);
        }
    }

    // Cuando la estación registra nuevos datos, actualiza su estado y notifica
    registrarMedicion(temperatura: number, humedad: number, presion: number): void {
        this.temperatura = temperatura;
        this.humedad = humedad;
        this.presion = presion;

        console.log(`\n%c[Estación] Nueva medición registrada`, COLORS.cyan);
        this.notificar(); // dispara la cadena de notificaciones
    }
}

// ─── Observadores Concretos ───────────────────────────────────────────────────
// Cada uno reacciona a las actualizaciones de forma diferente.

// 1. Panel LCD: muestra todos los datos en pantalla
class PanelLCD implements Observador {
    private nombre: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    actualizar(temperatura: number, humedad: number, presion: number): void {
        console.log(
            `%c[${this.nombre}] 🌡 Temp: ${temperatura}°C | 💧 Humedad: ${humedad}% | ⬆ Presión: ${presion} hPa`,
            COLORS.blue
        );
    }
}

// 2. App Móvil: muestra una notificación push con alertas de temperatura
class AppMovil implements Observador {
    private usuario: string;

    constructor(usuario: string) {
        this.usuario = usuario;
    }

    actualizar(temperatura: number, humedad: number, _presion: number): void {
        // Solo alerta si la temperatura es extrema
        if (temperatura >= 35) {
            console.log(
                `%c[App - ${this.usuario}] 🔥 ¡ALERTA! Temperatura alta: ${temperatura}°C. Humedad: ${humedad}%`,
                COLORS.red
            );
        } else if (temperatura <= 5) {
            console.log(
                `%c[App - ${this.usuario}] 🧊 ¡ALERTA! Temperatura bajo cero: ${temperatura}°C`,
                COLORS.purple
            );
        } else {
            console.log(
                `%c[App - ${this.usuario}] Clima actualizado: ${temperatura}°C`,
                COLORS.yellow
            );
        }
    }
}

// 3. Sistema de Registro: guarda el historial de mediciones
class SistemaRegistro implements Observador {
    private historial: string[] = [];

    actualizar(temperatura: number, humedad: number, presion: number): void {
        const registro = `T:${temperatura}°C H:${humedad}% P:${presion}hPa`;
        this.historial.push(registro);
        console.log(`%c[Registro] Guardado en historial: ${registro}`, COLORS.gray);
    }

    mostrarHistorial(): void {
        console.log(`\n%c═══ Historial de mediciones ═══`, COLORS.orange);
        this.historial.forEach((r, i) => console.log(`%c  ${i + 1}. ${r}`, COLORS.white));
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {

    const estacion = new EstacionMeteorologica();

    // Creamos los dispositivos observadores
    const panelPrincipal = new PanelLCD('Panel Principal');
    const panelSecundario = new PanelLCD('Panel Secundario');
    const appCarlos       = new AppMovil('Carlos');
    const appMaria        = new AppMovil('María');
    const registro        = new SistemaRegistro();

    // Los suscribimos a la estación
    estacion.suscribir(panelPrincipal);
    estacion.suscribir(panelSecundario);
    estacion.suscribir(appCarlos);
    estacion.suscribir(appMaria);
    estacion.suscribir(registro);

    // La estación registra mediciones y todos los dispositivos reaccionan
    estacion.registrarMedicion(22, 65, 1013);
    estacion.registrarMedicion(37, 80, 1008); // Temperatura alta — app lanza alerta
    estacion.registrarMedicion(3,  40, 1020); // Temperatura baja — app lanza alerta

    // Desuscribimos el panel secundario
    estacion.desuscribir(panelSecundario);

    // Esta medición ya no llegará al panel secundario
    estacion.registrarMedicion(18, 55, 1015);

    // El sistema de registro conserva todo el historial
    registro.mostrarHistorial();
}

main();
