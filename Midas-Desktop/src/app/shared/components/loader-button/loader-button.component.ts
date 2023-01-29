import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loader-button',
  templateUrl: './loader-button.component.html',
  styleUrls: ['./loader-button.component.scss']
})
export class LoaderButtonComponent implements OnInit {
  @Input() label: string = '';
  @Input() color: 'primary' | 'accent' | 'white' | 'aqua' | 'orange' | 'dark-orange' = 'primary';
  @Input() $loading: Subject<boolean> = new Subject<boolean>();
  @Input() defaultSize: boolean = true;
  @Input() $disabled: Subject<boolean> = new Subject<boolean>();

  // Will only emit if the button is not loading.
  @Output() clicked = new EventEmitter();

  loading = false;
  disabled = false;

  constructor() { }

  ngOnInit() {
    this.$loading.subscribe(isLoading => this.loading = isLoading);
    this.$disabled.subscribe(isDisabled => this.disabled = isDisabled);
  }

  execute() {
    this.clicked.emit();
  }

}
