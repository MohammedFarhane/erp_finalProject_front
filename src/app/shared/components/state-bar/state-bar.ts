import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface StateSlice {
  state: string;
  count: number;
}

@Component({
  selector: 'app-state-bar',
  imports: [RouterLink],
  templateUrl: './state-bar.html',
  styleUrl: './state-bar.scss',
})
export class StateBar {
  readonly label = input.required<string>();
  readonly slices = input.required<StateSlice[]>();
  readonly link = input.required<string>();

  readonly total = computed(() => this.slices().reduce((sum, slice) => sum + slice.count, 0));
}
