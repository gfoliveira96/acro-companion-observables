import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { StatusService } from '../../services/status.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { Option } from '../../interfaces/aux.interfaces';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
  @Input() boxIndex!: number;

  appState$: Observable<{ options: (Option | null)[], boxIndex: number | null }> = combineLatest([
    this.service.selectedOptions$,
    this.service.currentBoxIndex$,
  ]).pipe(
    map(([options, boxIndex]) => ({
      options: options,
      boxIndex,
    }))
  );

  constructor(private service: StatusService) {}

  selectBox(): void {
    console.log("click box Nº", this.boxIndex);
    this.service.selectBox(this.boxIndex);
  }


}