import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bp-skeleton-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.scss'
})
export class SkeletonTableComponent {
  rows = input<number>(5);
  columns = input<number>(6);

  get rowsArray(): number[] {
    return Array(this.rows()).fill(0);
  }

  get columnsArray(): number[] {
    return Array(this.columns()).fill(0);
  }
}
