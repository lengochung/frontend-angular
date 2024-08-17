<div class="date-picker-group">
    <input class="form-control control-date-picker input-group-text" placeholder="YYYY/MM/DD"
        [readonly]="true" name="start_date" maxlength="10" (click)="startDate.toggle()"
        ngbDatepicker #startDate="ngbDatepicker">
    <div class="input-group-append" (click)="startDate.toggle()">
        <span class="input-group-text"><i class="fa fa-calendar"></i></span>
    </div>
</div>