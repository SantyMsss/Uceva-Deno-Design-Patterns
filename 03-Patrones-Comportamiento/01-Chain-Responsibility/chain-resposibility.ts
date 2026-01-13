/**
 * ! Patron Chain of Responsibility
 * Es un patrón de diseño de comportamiento que te permite pasar solicitudes
 * a lo largo de una cadena de manejadores.
 *
 * * Es útil cuando se necesita procesar datos de diferentes maneras, pero no
 * * se sabe de antemano qué tipo de procesamiento se necesita o en qué orden
 * * pero se sabe que se necesita procesar en una secuencia.
 *
 * https://refactoring.guru/es/design-patterns/chain-of-responsibility
 */

import { COLORS } from '../../helpers/colors.ts';

interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: string): void;
}

abstract class BaseHandler implements Handler {
    private nextHandler?: Handler;

    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }
    handle(request: string): void {
        if(this.nextHandler){
            this.nextHandler.handle(request);
        }
    } 
}

class BasicSupport extends BaseHandler {
    handle(request: string): void {
        if(request === 'basico'){
            console.log('Soporte Basico: %cResolviendo problema basico', COLORS.green);
            return;
        }
        console.log('Soporte Basico: %cPasando el problema a soporte avanzado', COLORS.red);
        super.handle(request);
    } 
}

class AdvancedSupport extends BaseHandler {
    handle(request: string): void {
        if(request === 'avanzado'){
            console.log('Soporte Avanzado: %cResolviendo problema avanzado', COLORS.yellow);
            return;
        }
        console.log('Soporte Avanzado: %cPasando el problema a soporte avanzado', COLORS.red);
        super.handle(request);
    } 
}

class ExpertSupport extends BaseHandler {
    handle(request: string): void {
        if(request === 'experto'){
            console.log('Soporte Experto: %cResolviendo problema experto', COLORS.orange);
            return;
        }
        console.log('Soporte Experto: %cNo hay nada que hacer', COLORS.red);
        super.handle(request);
    } 
}

function main(){

    const basicSuport = new BasicSupport();
    const advancedSuport = new AdvancedSupport();
    const expertSuport = new ExpertSupport();

    basicSuport.setNext(advancedSuport).setNext(expertSuport);

    basicSuport.handle('basico');
    console.log('\n');
    basicSuport.handle('avanzado');
    console.log('\n');
    basicSuport.handle('experto');
    console.log('\n');
    basicSuport.handle('nuclear');

}

main();