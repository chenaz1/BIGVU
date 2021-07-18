import {Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  white: string = 'white';
  blue: string = 'blue';
  isWhite: boolean = true;

  public colorSource = new BehaviorSubject<string>(this.white);

  currentColor = this.colorSource.asObservable();

  constructor(private router: Router) {
  }

  changeColor(message: string) {
    this.colorSource.next(message);
  }

  ngOnInit(){
    this.router.navigate([''])
  }

  whiteBtnClick() {
    this.isWhite = true;
    this.changeColor(this.white);
  }

  blueBtnClick() {
    this.isWhite = !true;
    this.changeColor(this.blue);
  }


}

