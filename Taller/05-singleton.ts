/**
 * ! Patrón Singleton
 *
 * ¿Qué hace el patrón?
 * Singleton es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia en toda la aplicación y proporciona un punto
 * de acceso global a esa instancia.
 *
 * ¿Qué problema se está resolviendo?
 * En una aplicación grande, múltiples módulos (autenticación, carrito de
 * compras, historial de navegación) necesitan acceder a la sesión del usuario
 * activo. Si cada módulo creara su propia instancia de "sesión", habría
 * datos inconsistentes: un módulo podría ver al usuario como "conectado"
 * mientras otro lo ve como "desconectado". Se necesita una única fuente de
 * verdad para el estado de la sesión.
 *
 * ¿Por qué el patrón Singleton es adecuado?
 * Singleton asegura que sin importar cuántas veces se solicite la sesión del
 * usuario desde distintas partes de la aplicación, siempre se obtiene la
 * misma instancia. El constructor es privado, por lo que nadie puede crear
 * una segunda sesión accidentalmente. Toda lectura y escritura va al mismo
 * objeto, garantizando consistencia en toda la app.
 *
 * Ejemplo: Gestor de sesión de usuario en una aplicación web.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { COLORS } from '../helpers/colors.ts';

// ─── Singleton ────────────────────────────────────────────────────────────────
// Una sola instancia gestiona toda la sesión del usuario activo.

class SesionUsuario {
    // La única instancia se guarda aquí como atributo estático
    private static instancia: SesionUsuario;

    // Estado de la sesión
    private usuario: string | null = null;
    private rol: string | null = null;
    private activa: boolean = false;

    // Constructor privado: impide usar `new SesionUsuario()` desde afuera
    private constructor() {
        console.log('%c[SesionUsuario] Instancia creada (solo ocurre una vez)', COLORS.purple);
    }

    // Punto de acceso global: devuelve siempre la misma instancia
    static getInstance(): SesionUsuario {
        if (!SesionUsuario.instancia) {
            SesionUsuario.instancia = new SesionUsuario();
        }
        return SesionUsuario.instancia;
    }

    // Inicia la sesión con un usuario y su rol
    iniciarSesion(usuario: string, rol: string): void {
        if (this.activa) {
            console.log(`%c[Sesión] Ya existe una sesión activa para: ${this.usuario}`, COLORS.yellow);
            return;
        }
        this.usuario = usuario;
        this.rol = rol;
        this.activa = true;
        console.log(`%c[Sesión] Sesión iniciada → Usuario: ${usuario} | Rol: ${rol}`, COLORS.green);
    }

    // Cierra la sesión actual
    cerrarSesion(): void {
        if (!this.activa) {
            console.log('%c[Sesión] No hay sesión activa para cerrar', COLORS.yellow);
            return;
        }
        console.log(`%c[Sesión] Sesión cerrada para: ${this.usuario}`, COLORS.red);
        this.usuario = null;
        this.rol = null;
        this.activa = false;
    }

    // Muestra el estado actual de la sesión
    mostrarEstado(): void {
        if (this.activa) {
            console.log(`%c[Sesión] Activa → Usuario: ${this.usuario} | Rol: ${this.rol}`, COLORS.blue);
        } else {
            console.log('%c[Sesión] Sin sesión activa', COLORS.gray);
        }
    }

    // Verifica si el usuario tiene un rol específico
    tieneRol(rol: string): boolean {
        return this.activa && this.rol === rol;
    }
}

// ─── Módulos que consumen la sesión ───────────────────────────────────────────
// Simulan distintas partes de la aplicación que acceden a la sesión.
// Ninguno crea su propia sesión; todos piden la instancia única.

function moduloCarrito(): void {
    console.log('\n%c── Módulo Carrito ──', COLORS.cyan);
    const sesion = SesionUsuario.getInstance(); // obtiene la misma instancia
    sesion.mostrarEstado();

    if (sesion.tieneRol('cliente')) {
        console.log('%c[Carrito] Acceso permitido — cargando carrito del cliente', COLORS.green);
    } else {
        console.log('%c[Carrito] Acceso denegado — inicia sesión primero', COLORS.red);
    }
}

function moduloAdmin(): void {
    console.log('\n%c── Módulo Administración ──', COLORS.cyan);
    const sesion = SesionUsuario.getInstance(); // misma instancia
    sesion.mostrarEstado();

    if (sesion.tieneRol('admin')) {
        console.log('%c[Admin] Acceso permitido — panel de administración', COLORS.green);
    } else {
        console.log('%c[Admin] Acceso denegado — se requiere rol de administrador', COLORS.red);
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function main() {

    // Intentar acceder sin sesión activa
    moduloCarrito();
    moduloAdmin();

    // Iniciar sesión como cliente
    console.log('\n%c── Inicio de sesión ──', COLORS.cyan);
    const sesion = SesionUsuario.getInstance();
    sesion.iniciarSesion('sofia.toro', 'cliente');

    // Intentar abrir una segunda sesión (debe bloquearse)
    sesion.iniciarSesion('otro.usuario', 'admin');

    // Los módulos ahora ven la sesión activa
    moduloCarrito(); // tiene acceso
    moduloAdmin();   // no tiene acceso (rol incorrecto)

    // Verificamos que todos obtienen la MISMA instancia
    const ref1 = SesionUsuario.getInstance();
    const ref2 = SesionUsuario.getInstance();
    console.log(
        `\n%c¿ref1 === ref2? ${ref1 === ref2} (siempre deben ser la misma instancia)`,
        COLORS.orange
    );

    // Cerrar sesión
    console.log('\n%c── Cierre de sesión ──', COLORS.cyan);
    sesion.cerrarSesion();
    moduloCarrito(); // ya no tiene acceso
}

main();
