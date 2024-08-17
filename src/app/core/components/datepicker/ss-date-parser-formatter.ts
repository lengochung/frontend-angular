/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class SSDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '/';
    parse(value: string): NgbDateStruct | null {
        if (!value) {
            return null;
        }
        const date = value.split(this.DELIMITER);
        return {
            year: Number(date[0]),
            month: Number(date[1]),
            day: Number(date[2]),
        };
    }
    format(date: NgbDateStruct | null): string {
        if(!date){
            return "";
        }
        const month = date.month <= 9 ? `0${date.month}` : date.month;
        const day = date.day <= 9 ? `0${date.day}` : date.day;
        return `${date.year}${this.DELIMITER}${month}${this.DELIMITER}${day}`;
    }
}
