import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public photo: string;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.photo = this.route.snapshot.params.photo;
  }

  showPhoto(): string {
    if (this.photo == null || this.photo === '' || this.photo === undefined) {
      return 'assets/img/google_default_photo.jpg';
    } else {
      return this.photo;
    }
  }

}
