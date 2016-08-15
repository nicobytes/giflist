import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Injectable()
export class RedditService {

  private _after: string = null;

  constructor(private http: Http) {
    
  }

  fetchData(subreddit: string, sort: string, perPage: number):Observable<any>{
    let url =`https://www.reddit.com/r/${subreddit}/${sort}/.json?limit=${perPage}`;
    if(this._after !== null) url += `&after=${this._after}`;
    return this.http.get( url )
    .map(res => this._preparateData(res.json()));
  }

  initAfter(){
    this._after = null;
  }

  private _preparateData(data) {
    this._after = data.data.children[ data.data.children.length -1 ].data.name;
    return data.data.children
    .filter(post => {
      return post.data.url.indexOf('.gifv') > -1 || post.data.url.indexOf('.webm') > -1;
    })
    .map(post => {
      post.showLoader = false;
      post.data.url = this._toMp4( post.data.url );
      post.data.cover = this._makeCover( post.data.preview );
      if(post.data.thumbnail == 'nsfw') post.data.thumbnail = 'images/nsfw.png';
      return post;
    });
  }

  private _toMp4(url:string): string{
    if(url.indexOf('.gifv') > -1) return url.replace('.gifv', '.mp4');
    if(url.indexOf('.webm') > -1) return url.replace('.webm', '.mp4');
    return "";
  }

  private _makeCover(preview: any){
    if(preview !== undefined){
      let cover = preview.images[0].source.url.replace('&amp;','&','g');
      if(cover !== undefined) return cover;
      return "";
    }
    return "";
  }

}

