import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-relaxation',
  templateUrl: './relaxation.component.html',
  styleUrls: ['./relaxation.component.css']
})
export class RelaxationComponent  {
  public computerResult: string | undefined;
  public result: string | undefined;
  public results = { computer: 0, player: 0 };
  @Output() hrefID = new EventEmitter<string>();

  private userResult: string | undefined;
  constructor() { }

  
  public play(action: string): void {
    console.log('USER: ', action);
    this.userResult = action; 
    this.computer();
    this.calculateWinner();
  }

  private computer(): void {
    const randomNumber = Math.floor(Math.random() * 3);
    const options: string[] = [ 'rock', 'paper', 'scissors' ];

    console.log('COMPUTER: ', options[randomNumber]);
    this.computerResult = options[randomNumber];
  }

  private calculateWinner(): void {
    if (this.userResult === this.computerResult) {
      this.result = 'There was a tie / draw';
    }

    if (this.userResult === 'rock' && this.computerResult === 'paper') {
      this.results.computer++;
      this.result = 'Computer wins';
    }
    if (this.userResult === 'rock' && this.computerResult === 'scissors') {
      this.results.player++;
      this.result = 'You win';
    }
    if (this.userResult === 'paper' && this.computerResult === 'rock') {
      this.results.player++;
      this.result = 'You win';
    }
    if (this.userResult === 'paper' && this.computerResult === 'scissors') {
      this.results.computer++;
      this.result = ' Computer wins';
    }
    if (this.userResult === 'scissors' && this.computerResult === 'rock') {
      this.results.computer++;
      this.result = ' Computer wins';
    }
    if (this.userResult === 'scissors' && this.computerResult === 'paper') {
      this.results.player++;
      this.result = ' You win';
    }
  }


}
