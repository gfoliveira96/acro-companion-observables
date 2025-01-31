export interface Option {
  index: number;
  imageUrl: string;
  pokemonName: string;
  soundUrl: string;
  value: number;
  pokemonType: string[];
}

export interface AppState {
  selectedOptions: (Option | null)[];
  currentBoxIndex: number | null;
  pokemons: Option[];
}