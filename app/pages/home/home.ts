import { Component } from '@angular/core';
import { AlertController, ModalController, LoadingController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { FORM_DIRECTIVES, Control } from '@angular/common';
import { DataService } from '../../providers/data';
import { RedditService } from '../../providers/reddit';
import { InAppBrowser } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [ DataService, RedditService ]
})
export class HomePage {

  loading: boolean = false;
  subreddit: string = 'gifs';
  sort: string = 'hot';
  perPage: number = 15;
  posts: any[] = [];
  page: number = 1;
  tries: number = 0;

  constructor(
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    private _redditService: RedditService,
    private _dataService: DataService
  ) {
    this._loadSettings();
    this._fetchData();
  }

  private _fetchData(perPage:number = this.perPage): void{
    this.loading = true;
    this._redditService.fetchData(this.subreddit, this.sort, perPage)
    .subscribe(posts => {
      this.posts = this.posts.concat( posts );
      console.log(this.posts.length);
      this.loading = false;
      if(this.posts.length == 0 || this.tries > 5){
        let alert = this._alertCtrl.create({
          title: 'Oops!',
          subTitle: 'Having trouble finding GIFs - try another subreddit,sort order, or increase the page size in your settings.',
          buttons: ['Ok']
        });
        alert.present();
        this.tries = 0;
      }else{
        if(this.posts.length < this.perPage * this.page){
          this._fetchData( (this.perPage * this.page) - this.posts.length );
          this.tries++;
        }else{
          this.tries = 0;
        }
      }
    })
  }

  private _loadSettings(): void{
    this._dataService.getData()
    .then(settings => {
      if(settings.length != 0){
        this.perPage = settings.perPage;
        this.sort = settings.sort;
        this.subreddit = settings.subreddit;
      }
      this.changeSubreddit();
    })
  }

  onInput(e){
    if ( this.subreddit.trim() == '' ) return;
    this.changeSubreddit();
  }

  showComments( post ): void{
    InAppBrowser.open('http://reddit.com' + post.data.permalink, '_system','location=yes');
  }

  openSettings(): void{
    let settingsModal = this._modalCtrl.create( SettingsPage, {
      perPage: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    });
    settingsModal.onDidDismiss(settings => {
      if(settings){
        this.perPage = settings.perPage;
        this.sort = settings.sort;
        this.subreddit = settings.subreddit;

        this._dataService.save( settings );
        this.changeSubreddit();
      }
    })
    settingsModal.present();
  }

  playVideo(e, post): void{
    let video = e.target;
    if(video.paused){
      video.play();
      video.addEventListener('playing', e =>{
        post.showLoader = false;
      })
    }else{
      video.pause();
      post.showLoader = true;
    }
  }

  loadMore(): void{
    this.page++;
    this._fetchData();
  }

  changeSubreddit(): void{
    this.page = 1;
    this.posts = [];
    this._redditService.initAfter();
    this._fetchData();
  }

}
