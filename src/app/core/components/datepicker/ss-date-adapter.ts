/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class SSDateDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '/';
  fromModel(value: string | null): NgbDateStruct | null {
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
  toModel(date: NgbDateStruct | null): string | null {
    if(!date){
      return null;
    }
    const month = date.month <= 9 ? `0${date.month}` : date.month;
    const day = date.day <= 9 ? `0${date.day}` : date.day;
    return `${date.year}${this.DELIMITER}${month}${this.DELIMITER}${day}`;
  }
}
