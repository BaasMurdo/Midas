import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import * as EventEmitter from 'events';
import { DesktopCapturerSource } from 'electron';
import { IpcService } from '../_services/ipc.service';

export interface DCSwithImage extends DesktopCapturerSource {
  thumbPath?: any;
}

@Component({
  selector: 'app-window-selector',
  templateUrl: './window-selector.component.html',
  styleUrls: ['./window-selector.component.scss']
})
export class WindowSelectorComponent implements OnInit {
  @Output() selected: EventEmitter<DesktopCapturerSource> = new EventEmitter<DesktopCapturerSource>();
  windowSources: DCSwithImage[];
  isLoading: boolean;

  constructor(
    private ipcService: IpcService,
    private domSanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef) { }

  get hasWindows(): boolean {
    return (this.windowSources && this.windowSources.length > 0) ? true : false;
  }

  ngOnInit(): void {
  }

  async getWindowList() {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.ipcService.getAvailableWindows().subscribe(async windows => {
      console.log('getWindowList - Res -', windows);
      this.windowSources = windows;
      this.windowSources.forEach(ws => {
        ws.thumbPath = this.domSanitizer.bypassSecurityTrustUrl(ws.thumbPath);
      })
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  getThumbnail(windowSource: DesktopCapturerSource): Buffer {
    return windowSource.thumbnail.toPNG();
  }

  selectWindow(windowSource: DesktopCapturerSource) {
    this.selected.emit(windowSource);
  }

}
