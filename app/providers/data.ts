import { Injectable } from '@angular/core';
import { Storage, SqlStorage } from 'ionic-angular';

@Injectable()
export class DataService {

  storage: Storage;

  constructor() {
    this.storage = new Storage(SqlStorage, {name: 'giflist-settings'});
  }

  getData(): Promise<any>{
    return this.storage.get('settings')
    .then(data => {
      if (data !== undefined) return Promise.resolve(JSON.parse(data));
      return Promise.reject('No existe');
    })
    .catch(error => Promise.reject(error))
  }

  save(data): void{
    this.storage.set('settings', JSON.stringify(data));
  }

}

