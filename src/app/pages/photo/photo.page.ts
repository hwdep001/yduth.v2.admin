import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public photo: string;

  constructor(
    private router: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.log('PhotoPage');
    this.photo = this.router.snapshot.paramMap.get('photo');
  }

  showPhoto(): string {
    if (this.photo == null || this.photo === '' || this.photo === undefined) {
      return 'assets/img/google_default_photo.jpg';
    } else {
      return this.photo;
    }
  }

}
