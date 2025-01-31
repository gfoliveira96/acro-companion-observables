import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { Option } from '../interfaces/aux.interfaces';


@Injectable({ providedIn: 'root' })
export class PokemonService {
  private loadingState$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingState$.asObservable();
  private pokemons$ = new BehaviorSubject<Option[]>([]);

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
 
  constructor(private http: HttpClient) { }

  getPokemons(limit: number): Observable<Option[]> {

    if (this.pokemons$.value.length > 0) {
      return this.pokemons$.asObservable();
    }

    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`).pipe(
      tap(()=> this.loadingState$.next(true)),
      map(response => response.results),
      switchMap(pokemons =>
        forkJoin(pokemons.map((pokemon: any) =>
          this.getPokemonDetails(pokemon.url)
        ))
      ),

      map((details: any) => details.map((d: any, index: number) => {
        return {
          index: index + 1,
          pokemonName: d.name,
          imageUrl: d.sprites.other['official-artwork'].front_default,
          soundUrl: d.cries?.latest || d.cries?.legacy,
          value: (index + 1) * 2,
          pokemonType: d.types.map((t: any) => t.type.name)
        };
      })),

      tap(pokemons => {
        //  Update the observable with new pokémons
        this.pokemons$.next(pokemons);
        this.loadingState$.next(false);
      }),

      catchError(error => {
        console.error('Error loading pokemons', error);
        return of([]);
      }),

      finalize(() => this.loadingState$.next(false)),
      shareReplay(1),
    );
  }

  private getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }
}