import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {

  perPage: string;
  sort: string;
  subreddit: string;

  constructor(
    private _viewCtrl: ViewController,
    private _params: NavParams
  ) {
    this.perPage = this._params.get('perPage');
    this.sort = this._params.get('sort');
    this.subreddit = this._params.get('subreddit');
  }

  save(): void{
    this._viewCtrl.dismiss({
      perPage: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    });
  }

  close(): void{
    this._viewCtrl.dismiss();
  }

}
