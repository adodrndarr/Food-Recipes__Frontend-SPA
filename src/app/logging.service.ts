import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
    lastLog: string;
    index = 1;

    printLog(message: string): void {
        console.log(`${this.index}. Input message: ${message}`);
        console.log(`${this.index}. Last log: ${this.lastLog}`);
        
        this.lastLog = message;
        console.log(`${this.index}. Last Log was just set to: ${message}\n\n`);
        this.index++;
    }
}