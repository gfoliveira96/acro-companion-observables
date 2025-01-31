import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StatusService } from './services/status.service';
import { Observable } from 'rxjs';
import { Option } from './interfaces/aux.interfaces';
import { PokemonService } from './services/pokemon.service';
import { CommonModule } from '@angular/common';
import { BoxComponent } from './components/box/box.component';
import { OptionSelectorComponent } from './components/optionSelector/option-selector.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, BoxComponent, OptionSelectorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./global_styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  @ViewChild('pokemonAudio') pokemonAudio!: ElementRef<HTMLAudioElement>;

  boxes = Array(10);
  mp3Music: string = "https://vgmsite.com/soundtracks/pokemon-ten-years-of-pokemon/refozwlafz/01.%20Pokémon%20Theme%20(Season%20Theme).mp3";
  options$ = this.service.pokemons$;
  totalCount$: Observable<number> = this.service.totalValue$;
  currentBoxIndex$: Observable<number | null> = this.service.currentBoxIndex$;
  loader$: Observable<boolean> = this.pokemonService.loading$;

  constructor(private service: StatusService, private pokemonService: PokemonService) {
  }

  ngOnInit(): void {
    this.pokemonService.getPokemons(84).subscribe({
      next: pokemons => {
        console.log("Pokémons Loading:", pokemons);
        this.service.setPokemons(pokemons);
      },
      error: err => console.error("Error loading Pokémon:", err)
    });

    document.addEventListener('click', this.firstClickHandler.bind(this));
  }


  private firstClickHandler() {
    this.playAudio();
    document.removeEventListener('click', this.firstClickHandler);
  }

  playAudio() {
    try {
      let audio = this.pokemonAudio.nativeElement;
      audio.volume = 0.01;
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  clear(): void {
    this.service.clearAll();
  }
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule)
  ]
});