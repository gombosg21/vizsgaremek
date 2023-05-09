import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carousel-thread',
  templateUrl: './carousel-thread.component.html',
  styleUrls: ['./carousel-thread.component.css']
})
export class CarouselThreadComponent implements OnDestroy, OnInit {

  public carouselID?: number;
  public threadID?: number;

  constructor(private router: ActivatedRoute) {
  };

  ngOnInit(): void {
    this.carouselID = this.router.snapshot.params['carouselid'];
    this.threadID = this.router.snapshot.params['threadid'];
  };

  ngOnDestroy(): void { };

};
