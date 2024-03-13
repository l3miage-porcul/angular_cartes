import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BatailleService } from './bataille.service';
import { CarteComponent } from './carte/carte.component';
import { Subject, BehaviorSubject, timeout } from 'rxjs';
import { carte, defaultCarte } from './type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private readonly sigJoueur1 = new BehaviorSubject<carte>(defaultCarte);
  private readonly sigJoueur2 = new BehaviorSubject<carte>(defaultCarte);
  private readonly scoreJoueur1 = new BehaviorSubject<number>(0);
  private readonly scoreJoueur2 = new BehaviorSubject<number>(0);

  constructor(private batailleService: BatailleService) {
    this.piocherJoueur(1);
    this.piocherJoueur(2);
  }

  async piocherJoueur(Idjoueur: number): Promise<void> {
    const carteTiree = await this.batailleService.drawCard();
    Idjoueur === 1 ? this.sigJoueur1.next(carteTiree) : this.sigJoueur2.next(carteTiree);
  }

  bataille(): void {

    const carteGagnante = this.comparerCartes(this.sigJoueur1.value, this.sigJoueur2.value);
    if (carteGagnante === this.sigJoueur1.value) {
      this.scoreJoueur1.next(this.scoreJoueur1.value + 1);
    } else if (carteGagnante === this.sigJoueur2.value) {
      this.scoreJoueur2.next(this.scoreJoueur2.value + 1);
    } else {
      this.scoreJoueur1.next(this.scoreJoueur1.value + 1);
      this.scoreJoueur2.next(this.scoreJoueur2.value + 1);
    }
  }

  comparerCartes(carte1: carte, carte2: carte): carte | 'égalité' {
    const valeurCarte1 = carte1.value;
    const valeurCarte2 = carte2.value;
    
    if (valeurCarte1 > valeurCarte2) {
      return carte1;
    } else if (valeurCarte1 < valeurCarte2) {
      return carte2;
    } else {
      return 'égalité';
    }
  }

  getSigJoueur(numero: number): BehaviorSubject<carte> {
    return numero === 1 ? this.sigJoueur1 : this.sigJoueur2;
  }

  getScore(numero: number): BehaviorSubject<number> {
    return numero === 1 ? this.scoreJoueur1 : this.scoreJoueur2;
  }
}