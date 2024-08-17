import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { SystemMenuService } from '../../../core/services';
import { Subscription } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { MessageEntity, SystemMenuEntity } from '../../../core/entities';
import 'moment/locale/ja'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Layer, MapOptions, latLng, tileLayer } from 'leaflet';
import { environment } from '../../../../environments/environment';
moment.locale('ja')

@Component({
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        SHARED_MODULE,
        LeafletModule
    ]
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscriptionList: Subscription[] = [];

    public dateCalendarSelected = this.Lib.toDay("YYYY/MM/DD");
    public systemMenu:Array<SystemMenuEntity> = [];
    public messageList?: MessageEntity[];
    public weather = {
        feels_like: 0,
        humidity: 0,
        pressure: 0,
        temp: 0,
        temp_max: 0,
        temp_min: 0
    };

    public heatStrokeStatusClass = '';
    public heatStrokeColorClass = '';

    public pressureOptions: MapOptions = {
        layers: [
            tileLayer(this.Constants.MAPBOX_URL, {
                accessToken: `${environment.mapbox_access_token}`,
                id: 'streets-v12'
            })
        ],
        zoom: 4,
        center: latLng(35.6684103, 139.5760601)
    };

    public cloudsOptions: MapOptions = {
        layers: [
            tileLayer(this.Constants.MAPBOX_URL, {
                accessToken: `${environment.mapbox_access_token}`,
                id: 'streets-v12'
            })
        ],
        zoom: 4,
        center: latLng(35.6684103, 139.5760601)
    };

    public pressureLayers: Layer[] = [
        tileLayer(this.Constants.OPENWEATHERMAP_URL, {
            id: 'pressure_cntr',
            accessToken: `${environment.openweathermap_access_token}`
        })
    ];

    public cloudsLayers: Layer[] = [
        tileLayer(this.Constants.OPENWEATHERMAP_URL, {
            id: 'clouds',
            accessToken: `${environment.openweathermap_access_token}`
        })
    ]

    /** Constructor */
    constructor(
        private _router: Router,
        private _systemMenuService: SystemMenuService,
    ) {
        super();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        void this._getSystemMenu();
    }
    /**
     * @returns {void}
     */
    ngOnDestroy(): void {
        this._subscriptionList.forEach((sub) => sub.unsubscribe());
    }

    /**
     * Get count system menu
     * @author DuyPham
     * @returns {void}
     */
    private _getSystemMenu(): void {
        const sub = this._systemMenuService.getSystemMenu().subscribe({
            next: (rsp) => {
                if (!rsp.status || !rsp.data) {
                    return;
                }
                this.systemMenu = rsp.data;
            },
            error: () => {
                this.systemMenu = [];
            }
        });
        this._subscriptionList.push(sub);
    }

    /**
     * get css class for day calendar
     * @author DuyPham
     *
     * @param {NgbDateStruct} date ngbDateStruct
     * @returns {string} class css
     */
    public datepickerDate(date: NgbDateStruct): string {
        let classes = "";
        let dateString = `${date.year}/${date.month}/${date.day}`;

        const momentDate = moment(dateString, "YYYY/M/D");
        dateString = momentDate.format("YYYY/MM/DD");
        const dayOfWeek = momentDate.get('day');
        if (dateString === this.dateCalendarSelected) classes += " is-selected "
        if (dayOfWeek === 0) classes += ' is-sun ';
        if (dayOfWeek === 6) classes += ' is-sat ';

        return classes;
    }


    /**
     * Get text show calendar
     * @author DuyPham
     *
     * @param {NgbDateStruct} date ngbDateStruct
     * @returns {string} text on day
     */
    public getTextDay(date: NgbDateStruct): string {
        let textDate = "";
        if (date.day === 1) {
            textDate = "元日";
        } else if (date.day === 8) {
            textDate = "成人の日";
        }
        return textDate;
    }
}
