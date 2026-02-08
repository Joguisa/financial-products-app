import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bp-pagination-control',
  standalone: true,
  imports: [],
  templateUrl: './pagination-control.component.html',
  styleUrl: './pagination-control.component.scss'
})
export class PaginationControlComponent {
  @Input() total = 0;
  @Input() filteredCount = 0;
  @Output() limitChange = new EventEmitter<number>();

  get displayCount(): number {
    return this.filteredCount > 0 ? this.filteredCount : this.total;
  }

  onLimitChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.limitChange.emit(Number(value));
  }
}
