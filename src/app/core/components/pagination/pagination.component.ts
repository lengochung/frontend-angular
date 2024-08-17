import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import Lib from '../../../utils/lib';
import Constants from '../../../utils/constants';
@Component({
	selector: 'app-pagination',
	standalone: true,
	template: `
		@if(paginations && paginations.length > 0) {
		<div class="row">
			<ul class="pagination pagination-sm">
				<li class="page-item">
					@if(page > 0) {
						<a class="page-link" (click) = "setPage(page - 1)">&laquo;</a>
					} @else if (page === 0) {
						<span class="page-link disabled">&laquo;</span>
					}
				</li>
				@for(page of paginations; track $index){
				<li class="page-item"  class="{{page.selected}}">
					@if(page.link !== '' && page.selected === '') {
						<a (click) = "setPage(page.link)" class="page-link">{{page.num}}</a>
					}
					@if (page.link !== '' && page.selected !== '') {
						<span class="page-link">{{page.num}}</span>
					}
					@if (page.link === '') {
						<span class="page-link relative">...</span>
					}
				</li>
				}
				<li class="page-item">
					@if((page + 1) < totalPage) {
						<a class="page-link" (click) = "setPage(page + 1)">&raquo;</a>
					} @else if ((page + 1) === totalPage) {
						<span class="page-link disabled">&raquo;</span>
					}
				</li>
			</ul>
		</div>
		}
	`,
	styles: `
		:host {
			display: flex;
			width: 100%;
			justify-content: center;
		}
		.page-item.active .page-link{
			background-color: #145DA0;
			border-color: #145DA0;
		}
		.page-link{
			color: #145DA0;
		}
		.pagination-sm .page-link{
			padding: 0.25rem 0.6rem;
		}
	`
})
export class PaginationComponent implements OnChanges {
    /**
     * isPage = true, pagination for page
     * isPage = false, pagination for element in page
     */
	@Input() isPage = true;
	@Input() page = 0;
	@Input() pageSize = Constants.PAGINATE_LIMIT;
	@Input() totalRow = 0;
	//The number of items to be shown per page.
	@Input() perPage = 5;
	//Number of pages displayed on 1 page
	@Input() maxPages = 7;
	@Output() changePage = new EventEmitter<any>();
	public paginations: Array<any> = [];
	public totalPage = 0;
	/** constructor*/
	constructor() {
		this.changePage = new EventEmitter<any>();
	}
	/**
	 * Lifecycle hook that is called when any data-bound property of a directive changes.
	*
	 * @param {SimpleChanges} changes  	object that contains the current and previous property values for each property bound to data in the directive.
	 * @returns {void}
	 */
	ngOnChanges(changes: SimpleChanges): void {
		for (const property in changes) {
			if (!Lib.isNull(property)) {
				if ('totalRow' === property) {
					this.totalRow = changes[property].currentValue;
					this.paginationRender();
				}
				if ('page' === property) {
					this.page = changes[property].currentValue;
					this.paginationRender();
				}
			}
		}
	}
	/**
	 * @description
	 * Build pagination
	 *
	 * @returns {void}
	 */
	public paginationRender() {
		const pages = Math.ceil(this.totalRow / this.pageSize);
		if (pages <= 1 || this.page >= pages) {
			this.totalPage = 0;
			this.paginations = [];
			return;
		}
		this.totalPage = pages;
		let limit = 0;
		let idx = 0;
		let first = true;
		let last = true;
		if (pages <= this.maxPages) {
			limit = pages;
			first = false;
			last = false;
		} else if ((this.page + 1) < this.perPage) {
			limit = this.perPage;
			first = false;
		} else if ((this.page + 1) >= this.perPage && (this.page + this.perPage) <= pages) {
			limit = this.page + 2;
			idx = this.page - 1;
		} else if ((this.page + this.perPage) > pages) {
			limit = pages;
			idx = pages - this.perPage;
			last = false;
		}
		const results: any = [];
		// let k = 0;
		let pagin: any = {};
		if (first) {
			pagin.link = 0;
			pagin.num = 1;
			pagin.selected = '';
			results.push(pagin);
			pagin = {};
			pagin.link = '';
			pagin.num = '';
			pagin.selected = '';
			results.push(pagin);
			//k = 2;
		}
		for (let x = idx; x < limit; x++) {
			let selected = '';
			if (this.page == x) {
				selected = 'active';
			}
			pagin = {};
			pagin.link = x;
			pagin.num = x + 1;
			pagin.selected = selected;
			results.push(pagin);
			//k++;
		}
		if (last) {
			pagin = {};
			pagin.link = '';
			pagin.num = '';
			pagin.selected = '';
			results.push(pagin);
			pagin = {};
			pagin.link = pages - 1;
			pagin.num = pages;
			pagin.selected = '';
			results.push(pagin);
		}
		this.paginations = results;
	}
	/**
	 * get current page selected
	 * @param {number} page current page selected
	 *
	 * @returns {void}
	 */
	public setPage(page: number) {
		//Insert param page to url if isPage = true
        if(this.isPage)
		    Lib.insertParamToUrl(Constants.PAGINATION_PARAM, (page + 1));
		this.changePage.emit(page);
	}
}
