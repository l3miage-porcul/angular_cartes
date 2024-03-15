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
  private aJoue1 : boolean = false;
  private aJoue2 : boolean = false;
  private nbCartesRestantes: number = 52;

  constructor(private batailleService: BatailleService) {}

  async piocherJoueur(Idjoueur: number): Promise<void> {

    if (this.nbCartesRestantes === 0) return;
    if (Idjoueur === 1 && this.aJoue1 == true) return;
    if (Idjoueur === 2 && this.aJoue2 == true) return;

    const carteTiree = await this.batailleService.drawCard();
    Idjoueur === 1 ? this.sigJoueur1.next(carteTiree) : this.sigJoueur2.next(carteTiree);
    Idjoueur === 1 ? this.aJoue1 = true : this.aJoue2 = true;
    this.nbCartesRestantes--;
  }

  bataille(): void {

    if (this.aJoue1 && this.aJoue2 && this.nbCartesRestantes > 0) {

      this.aJoue1 = false;
      this.aJoue2 = false;
      
      const carteGagnante = this.comparerCartes(this.sigJoueur1.value, this.sigJoueur2.value);
      this.calculScore(carteGagnante);
    }
  }

  calculScore(carteGagnante : carte | 'égalité'): void {
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
    
    console.log(valeurCarte1, valeurCarte2)

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

  async automaticPlay(): Promise<void> {
    await this.piocherJoueur(1);
    await this.piocherJoueur(2);
    this.bataille();
  }

  jeuAuto() : void{
    this.automaticPlay();
    setInterval(() => {
      this.automaticPlay();
    }, 1000);
  }
}