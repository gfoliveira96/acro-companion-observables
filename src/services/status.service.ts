import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AppState, Option } from '../interfaces/aux.interfaces';


@Injectable({ providedIn: 'root' })
export class StatusService {

  private initialState: AppState = {
    selectedOptions: Array(),
    currentBoxIndex: null,
    pokemons: []
  };

  private state$ = new BehaviorSubject<AppState>(this.loadState());
  pokemons$ = this.state$.pipe(map(state => state.pokemons));
  selectedOptions$ = this.state$.pipe(map(state => state.selectedOptions));
  currentBoxIndex$ = this.state$.pipe(map(state => state.currentBoxIndex));
  totalValue$ = this.selectedOptions$.pipe(
    map(options => options.reduce((total, selectedOption) => total + (selectedOption?.value || 0), 0))
  );

  constructor() {
    this.state$.subscribe(state => {
      this.saveState(state)
    });
  }

  private loadState(): AppState {
    let saved = localStorage.getItem('boxState');
    return saved ? { ...this.initialState, ...JSON.parse(saved) } : this.initialState;
  }

  selectBox(index: number): void {
    this.state$.next({ ...this.state$.value, currentBoxIndex: index });
  }

  private saveState(state: AppState): void {
    localStorage.setItem('boxState', JSON.stringify(state));
  }

  setPokemons(pokemons: Option[]): void {
      console.log("Updating Pokémon state:", pokemons);

    this.state$.next({
      ...this.state$.value,
      pokemons: [...pokemons] //  New reference
    });  }

  selectOption(option: Option): void {
    let currentState = this.state$.value;

    if (currentState.currentBoxIndex === null) return;

    let newOptions = [...currentState.selectedOptions];
    newOptions[currentState.currentBoxIndex] = option;

    let nextIndex;

    if (currentState.currentBoxIndex < 9) {
      nextIndex = currentState.currentBoxIndex + 1;
    } else if (currentState.currentBoxIndex === 9) {
      nextIndex = currentState.currentBoxIndex;
    } else {
      nextIndex = null;
    }

    this.state$.next({
      ...currentState,
      selectedOptions: newOptions,
      currentBoxIndex: nextIndex
    });
  }

  clearAll(): void {
    this.state$.next({
      selectedOptions: [],
      currentBoxIndex: null,
      pokemons: this.state$.value.pokemons
    });
  }

}