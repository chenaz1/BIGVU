import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Picture} from "../pictures/piture.component";
import {ActivatedRoute} from "@angular/router";
import {AppComponent} from "../app.component"
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})

export class FrameComponent implements OnInit {
  // @ViewChild('canvas', {static: true}) canvas: ElementRef;
  // private ctx: CanvasRenderingContext2D;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;

  frameColor: string = '';

  public title: string = '';
  public userTitle: string | undefined;
  userTitleUpdate = new Subject<string>();

  image = new Image();
  chosenPic: string = '';
  picture: string = this.chosenPic;
  path: string = '../assets/pictures.json';
  pictures: Picture[] = [];

  x: number;
  y: number;

  constructor(private http: HttpClient, private route: ActivatedRoute, private data: AppComponent) {
    this.userTitleUpdate
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.title = value;
        this.updateSelection();
      });
  }


  ngOnInit() {
    this.x = (this.canvas.nativeElement as HTMLCanvasElement).width;
    this.y = (this.canvas.nativeElement as HTMLCanvasElement).height;
    this.getPictures().subscribe(
      (response) => {
        this.pictures = response;
      })
    this.data.currentColor.subscribe(update => this.frameColor = update);
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  getPictures() {
    return this.http.get<Picture[]>(this.path);
  }

  updateSelection() {
    let ratio: number = 2 / 3;
    this.ctx!.clearRect(0, 0, this.x, this.y);
    this.picture = this.chosenPic;
    this.image.src = this.chosenPic;
    this.image.onload = () => {
      this.ctx!.drawImage(this.image, 0, 0, this.x * (ratio), this.y);
      this.initFrame();
      // this.draw();
      this.wrapText(1-ratio);
    }
  }

  private draw() {
    this.ctx!.font = "30px Arial";
    this.ctx!.textBaseline = 'middle';
    this.ctx!.textAlign = 'center';
    this.ctx!.fillStyle = "grey";
    this.ctx!.fillText(this.title, this.x / 2, this.y / 2);

  }

  wrapText(ratio:number) {
    const maxWidth: number = this.x * (ratio);
    let words = this.title.split(' ');
    let line = '';
    let i: number;
    i = this.linesCouter(words, maxWidth);
    let yLine = this.y / 2 - (15 * i);

    this.ctx!.font = "30px Arial";
    this.ctx!.fillStyle = "grey";
    this.ctx!.textAlign = 'center';
    this.ctx!.textBaseline = 'middle';

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = this.ctx!.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.ctx!.fillText(line, this.x * (5 / 6), yLine);
        line = words[n] + ' ';
        yLine += 30;
      } else {
        line = testLine;
      }
    }
    this.ctx!.fillText(line, this.x * (1-ratio/2), yLine);
  }

  initFrame() {
    this.ctx!.strokeStyle = this.frameColor;
    this.ctx!.lineWidth = 20;
    this.ctx!.strokeRect(0, 0, this.x, this.y);
  }

  linesCouter(words: string | any[], maxWidth: number) {
    let line: string = '';
    let i: number = 0;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = this.ctx!.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        i++;
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    return i;
  }

}
