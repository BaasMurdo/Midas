import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { IpcService } from '../_services/ipc.service';
import { TensorHelperService } from '../_services/tensor-helper.service';
import { DesktopCapturerSource } from 'electron';
// import * as m from 'mock-browser';
// const MockBrowser = require('mock-browser').mocks.MockBrowser;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  windowSource: Electron.DesktopCapturerSource;

  constructor(
    private ipcService: IpcService,
    private domSanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private tfhs: TensorHelperService) { }

  private unsubscribe = new Subject<void>();
  currentImg: any;
  showImage: boolean = false;
  $currentImg: Subject<any> = new Subject<any>();

  async ngOnInit() {
    // const mock = new MockBrowser();
    // global['navigator'] = mock.getNavigator();
    // console.log(global.navigator)
    await this.tfhs.loadModel();
    this.tfhs.$modelLoaded.subscribe(loaded => {
      console.log('model has loaded?', loaded);
    })
    // this.goLive();
  }

  async takeScreenShotNow() {
    this.currentImg = null;
    this.showImage = false;
    this.changeDetectorRef.detectChanges();
    if (this.ipcService) {
      this.ipcService.takeScreenShot().pipe(
        takeUntil(this.$currentImg)
      ).subscribe(async value => {
        console.log('Screenshot taken, path:', value.path);
        this.currentImg = this.domSanitizer.bypassSecurityTrustUrl(value.path);
        this.$currentImg.next(this.currentImg);
        this.$currentImg.next(null);
        this.showImage = true;
        this.changeDetectorRef.detectChanges();
        const imgElement = document.getElementById('theone') as HTMLImageElement;
        console.log('has Img, is showing image, passing to prediction')
        const res = await this.tfhs.predict(imgElement)
        console.log(res);
      });
    } else {
      console.log('no service')
    }
  }

  async goLive(windowSource: DesktopCapturerSource) {
    console.log('.navigator', (window as any).navigator)

    let stream = null;
    let sourceId = 'window:200408:0';

    if(windowSource) {
      this.windowSource = windowSource;
      sourceId = windowSource.id
      console.log('windowSource in goLive', windowSource)
      this.ipcService.toggleFullScreen();
      this.changeDetectorRef.detectChanges();
    }

    stream = await (window as any).navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          width: { min: 1920 },
          height: { min: 1080 }
        }
      }
    })

    console.log('setVideo result in home', stream)
    const video = document.getElementById('live') as HTMLVideoElement;
    console.log('video element', video)
    video.srcObject = stream;
    await this.tfhs.startPredictVideo(video);

    video.onloadedmetadata = (e) => video.play();
  }

  async openWindowSelect() {
    this.windowSource = null;
    this.ipcService.toggleFullScreen();
    this.changeDetectorRef.detectChanges();
  }

  async openDevTools() {
    this.ipcService.openDevTools();
  }

}
