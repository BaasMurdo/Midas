import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  api: any;
  hasApi: boolean = false;

  constructor() {
    if ((window as any) && (window as any).api) {
      this.api = (window as any).api;
      this.hasApi = true;
    } else {
      this.hasApi = false;
    }
  }

  openDevTools() {
    if (this.hasApi) {
      this.api.electronIpcSend('dev-tools');
    }
  }

  openExternalLink(url: string) {
    if (this.hasApi) {
      this.api.electronIpcSend('open-link', url);
    }
  }

  takeScreenShot(): Observable<{path: string, image: any}> {
    if(this.hasApi){
      this.api.electronIpcSend('take-screen');
      return new Observable(subscriber => {
        this.api.electronIpcOn('take-screen-done', (event, arg) => {
          subscriber.next({path: arg.location, image: arg.screenshot});
        });
      });
    }
  }

  // getStoredBuyerList(): Observable<any> {
  //   if (this.hasApi) {
  //     this.api.electronIpcSend('load-buyers');
  //     return new Observable(subscriber => {
  //       this.api.electronIpcOn('load-buyers-done', (event, arg) => {
  //         subscriber.next(arg);
  //       });
  //     });
  //   }
  // }

  // setNewBuyers(buyers) {
  //   this.api.electronIpcSend('set-buyers', buyers);
  // }

  // createCsv(filePath:string, fileName:string,  obj: any[]) {
  //   const fullPath = filePath + String.raw`/${fileName}.csv`
  //   if (this.hasApi) {
  //     this.api.electronIpcSend('create-csv', fullPath, obj);
  //   }
  // }

}
