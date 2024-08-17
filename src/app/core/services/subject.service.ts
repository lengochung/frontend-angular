/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { AsyncSubject, Subject, BehaviorSubject, Observable } from "rxjs";
import { SubjectEntity } from "../entities";
import Lib from "../../utils/lib";
@Injectable({
    providedIn: 'root'
})
/**
 * Handle asynchronous data flow using RxJS to multicast data to multiple Observables simultaneously,
 * meaning that subscriptions will receive the same data value
 */
export class SubjectService {
    /**
     * Only receive data after subscribing
     */
    private _subject = new Subject<SubjectEntity>();
    /**
      * Get Subject subscribe
      * 
      * Declare in the constructor component: public subject: SubjectService
      * Then call it in ngOnInit as follows:
      * this.subject.getSubject.subscribe((data: any) => {
      *     console.log('Subscriber data:', data);
      * });
      * When exiting the component, unsubscribe from getSubject() in ngOnDestroy
      */

    public getSubject = this._subject.asObservable();
    /**
     * The subscriber will receive the last value that the Subject emits when it starts subscribing.
     */
    private _behaviorSubject = new BehaviorSubject<SubjectEntity>(new SubjectEntity());
    private _behaviorSubjectKeys: { [key: string]: BehaviorSubject<SubjectEntity> } = {};
    /**
     * Get BehaviorSubject subscribe
     * Used similarly to getSubject
     */
    public getBehaviorSubject = this._behaviorSubject.asObservable();
    /**
     * Chỉ emit giá trị cuối cùng lúc nó complete bởi hàm complete().
     */
    private _asyncSubject = new AsyncSubject<SubjectEntity>();
    private _asyncSubjectKeys: { [key: string]: AsyncSubject<SubjectEntity> } = {};
    /**
     * Get asyncSubject subscribe
     * Used similarly to getSubject
     */
    public getAsyncSubject = this._asyncSubject.asObservable();
    /** constructor */
    constructor(
    ) {
        /**
         *  Create multiple data subjects based on keys
         * EX:
         * const subjectE: { [key: string]: BehaviorSubject<SubjectEntity> } = {};
         * subjectE['subject key'] = new BehaviorSubject<SubjectEntity>(new SubjectEntity());
         * this._behaviorSubjectKeys = subjectE;
         */
    }
    /**
     * set Subject data
     * 
     * @param {SubjectEntity} data subject data
     * @returns {void}
     */
    setSubject(data: SubjectEntity): void {
        this._subject.next(data);
    }
    /**
     * set BehaviorSubject data
     * 
     * @param {SubjectEntity} data      BehaviorSubject data
     * @param {string} subjectKey       behaviorSubject key
     * @returns {SubjectEntity} aaa
     */
    setBehaviorSubject(data: SubjectEntity, subjectKey?: string): void {
        if (!subjectKey) {
            this._behaviorSubject.next(data);
        } else {
            if (!Lib.isObject(this._behaviorSubjectKeys) || !this._behaviorSubjectKeys[subjectKey]) {
                return;
            }
            this._behaviorSubjectKeys[subjectKey].next(data);
        }
    }
    /**
     * Retrieve information from a BehaviorSubject based on a key
     * @param {string} subjectKey  behaviorSubject key
     * @returns {asObservable} --
     */
    public getBehaviorSubjectByKey(subjectKey: string) {
        if (!subjectKey) {
            return this._behaviorSubject.asObservable();
        }
        if (!Lib.isObject(this._behaviorSubjectKeys) || !this._behaviorSubjectKeys[subjectKey]) {
            return new Observable<SubjectEntity>();
        }
        return this._behaviorSubjectKeys[subjectKey].asObservable();
    }
    /**
     * set AsyncSubject data
     * 
     * @param {SubjectEntity} data AsyncSubject data
     * @param {string} subjectKey       behaviorSubject key
     * @returns {void}
     */
    setAsyncSubject(data: SubjectEntity, subjectKey?: string): void {
        if (!subjectKey) {
            this._asyncSubject.next(data);
            this._asyncSubject.complete();
        } else {
            if (!Lib.isObject(this._asyncSubjectKeys) || !this._asyncSubjectKeys[subjectKey]) {
                return;
            }
            this._asyncSubjectKeys[subjectKey].next(data);
        }
    }
    /**
     * Retrieve information from a AsyncSubject based on a key
     * @param {string} subjectKey  AsyncSubject key
     * @returns {asObservable} --
     */
    public getAsyncSubjectByKey(subjectKey: string) {
        if (!subjectKey) {
            return this._asyncSubject.asObservable();
        }
        if (!Lib.isObject(this._behaviorSubjectKeys) || !this._behaviorSubjectKeys[subjectKey]) {
            return new Observable<SubjectEntity>();
        }
        return this._behaviorSubjectKeys[subjectKey].asObservable();
    }
}