import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { carte, defaultCarte } from '../type';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [],
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent {

  @Input({required : true}) carteSubject! : BehaviorSubject<carte>;
  @Input({required : true}) score! : BehaviorSubject<number>;
  private carte : carte = defaultCarte;

  ngOnInit() {
    this.carteSubject.subscribe(carte => {
      this.carte = { ...carte };
    });
  }

  ngOnDestroy() {
    this.carteSubject.unsubscribe();
  }

  getCarte() : carte{
    return this.carte;
  }
}
