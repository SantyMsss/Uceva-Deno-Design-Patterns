/**
 * ! Patrón Command
 * Este patrón encapsula una solicitud como un objeto,
 * lo que le permite parametrizar otros objetos con diferentes solicitudes,
 * encolar solicitudes, o registrar solicitudes, y soporta operaciones que pueden deshacerse.
 *
 * Me gustó mucho la explicación de Refactoring Guru
 * https://refactoring.guru/es/design-patterns/command
 *
 * * Es útil cuando se necesita desacoplar el objeto que invoca
 * * la operación del objeto que sabe cómo realizarla.
 *
 *
 */

import { COLORS } from '../../helpers/colors.ts';

interface Command {
    execute(): void;
}

class Light {
    turnOn(): void {
        console.log('%cLa luz esta encendida', COLORS.yellow);
    }
    
    turnOff(){
        console.log('%cLa luz esta apagada', COLORS.yellow);
    }
}

class Fan {
    on(): void {
        console.log('%cEl ventilador esta encendido', COLORS.green);
    }
    
    off(){
        console.log('%cEl ventilador esta apagado', COLORS.green);
    }
}

// Comandos
class LightOnCommand implements Command {
    private light: Light;
    constructor(light: Light){
        this.light = light;
    }

    execute(): void {
        this.light.turnOn();
    }
}

class LightOffCommand implements Command {
    private light: Light;
    constructor(light: Light){
        this.light = light;
    }

    execute(): void {
        this.light.turnOff();
    }
}

class FanOnCommand implements Command {
    private fan: Fan;
    constructor(fan: Fan){
        this.fan = fan;
    }

    execute(): void {
        this.fan.on();
    }
}

class FanOffCommand implements Command {
    private fan: Fan;
    constructor(fan: Fan){
        this.fan = fan;
    }

    execute(): void {
        this.fan.off();
    }
}

class RemoteControl {

    private commands: Record<string, Command> = {};

    setCommand(button: string, command: Command){
        this.commands[button] = command;
    }

    pressButton(button: string){
        if(this.commands[button]){
            this.commands[button].execute();
            return;
        }
        console.log('%cNo se ha asignado un comando a ese boton', COLORS.red);
    }

}

function main(){
    const remoteControl = new RemoteControl();
    const light = new Light();
    const fan = new Fan();

    //Crear Comandos para Dispositivos
    const lightOnCommand = new LightOnCommand(light);
    const lightOffCommand = new LightOffCommand(light);
    
    const fanOnCommand = new FanOnCommand(fan);
    const fanOffCommand = new FanOffCommand(fan);

    //Asignar las acciones a el control remoto
    remoteControl.setCommand('1', lightOnCommand);
    remoteControl.setCommand('2', lightOffCommand);
    remoteControl.setCommand('3', fanOnCommand);
    remoteControl.setCommand('4', fanOffCommand);

    let continueProgram = true;

    do {

        console.clear();
        const presseButton = prompt(`
            Preciona un boton del control:
            1. Encender la Luz
            2. Apagar la Luz
            3. Encender el Ventilador
            4. Apagar el Ventilador
            Boton:`) ?? '';
        remoteControl.pressButton(presseButton);
        const continueProgramResponse = prompt(`\n¿Deseas continuar? (y/n)`)?.toLowerCase();
        continueProgram = continueProgramResponse === 'n' ? false : true;
    } while( continueProgram );

}

main();