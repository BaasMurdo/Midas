import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IpcService } from '@app/_services/ipc.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { TensorHelperService } from '@app/_services/tensor-helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
    await this.tfhs.loadModel();
    this.tfhs.$modelLoaded.subscribe(loaded => {
      console.log('model has loaded?', loaded);
    })
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

        const res = await this.tfhs.predict(imgElement)
        console.log(res);
      });
    }
  }

  async openDevTools() {
    this.ipcService.openDevTools();
  }

}
