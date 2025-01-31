import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';
import { StatusService } from '../../services/status.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { Option } from '../../interfaces/aux.interfaces';

@Component({
  selector: 'app-option-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option-selector.component.html',
  styleUrls: ['./option-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectorComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() option!: Option;

  appState$: Observable<{ option: Option | null, boxIndex: number | null }> = combineLatest([
    this.service.selectedOptions$,
    this.service.currentBoxIndex$, 
  ]).pipe(
    map(([option, boxIndex]) => ({
      option: boxIndex != null ? option[boxIndex] : null,
      boxIndex,
    }))
  );

  constructor(private service: StatusService) { }

  selectOption(option: Option): void {
    this.service.selectOption(option);

    if (this.audioPlayer) {
      let audio = this.audioPlayer.nativeElement
      audio.load();  // Reloads to allow multiple executions
      audio.play().catch(error => console.error("Error playing audio:", error));
      audio.volume = 0.02;
    }
  }
}