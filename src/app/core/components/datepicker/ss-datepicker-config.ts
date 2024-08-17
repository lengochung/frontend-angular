/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class SSDatepickerConfig extends NgbDatepickerConfig {
    override minDate = {year: 1920, month: 1, day: 1};
    //override maxDate = {year:new Date().getFullYear(),month: new Date().getMonth()+1, day: new Date().getDate()};
}
