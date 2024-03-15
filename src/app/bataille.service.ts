import { Injectable } from '@angular/core';
import { carte, defaultCarte } from './type';

@Injectable({
  providedIn: 'root'
})
export class BatailleService {

    private deckId: string = '';
    private nbCartesRestantes: number = 0;

    constructor() {
        this.getDeckId().then(deckId => {
            this.deckId = deckId;
        });
    }

    async getDeckId(): Promise<string> {

        // Récupérer l'identifiant du jeu de cartes
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        const deckId = data.deck_id;
        this.nbCartesRestantes = parseInt(data.remaining);

        // Retourner l'identifiant du jeu de cartes
        return deckId;
    }
    
    async drawCard(): Promise<carte> {
        
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`);
        const data = await response.json();
        
        if (data.remaining === 0) return defaultCarte;   

        const carte: carte = {
            code: data.cards[0].code,
            image: data.cards[0].image,
            value: this.calculValeur(data.cards[0]),
        };
    
        return carte;
    } 

    calculValeur(carte : carte): number {
        const valeur = carte.value;
        switch(valeur) {
            case 'ACE': return 14;
            case 'KING': return 13;
            case 'QUEEN': return 12;
            case 'JACK': return 11;
            default: return parseInt(valeur as string);
        }
    }
}
