/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Constants from '../../../utils/constants';

@Injectable()

export class SSDatepickerI18n extends NgbDatepickerI18n {
    getWeekdayLabel(weekday: number): string {
        return Constants.DATEPICKER_I18N.ja.weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return Constants.DATEPICKER_I18N.ja.months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.year}/${date.month}/${date.day}`;
    }
    format(date: NgbDateStruct): string {
        return date ? `${date.year}/${date.month}/${date.day}` : '';
    }
}
