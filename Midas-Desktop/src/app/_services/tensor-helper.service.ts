import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { Subject } from 'rxjs';

// BASED on https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd/demo

@Injectable({
  providedIn: 'root'
})
export class TensorHelperService {
  $modelLoaded: Subject<Boolean> = new Subject<Boolean>();


  constructor() {

  }

  imageURL: string;
  model: cocoSSD.ObjectDetection;

  async loadModel() {
    console.time('load');
    this.model = await cocoSSD.load();
    console.timeEnd('load');
    if(this.model){
      this.$modelLoaded.next(true);
    } else {
      this.$modelLoaded.next(true);
    }
  }

  async predict(image: HTMLImageElement) {
    console.time('predict');
    const result = await this.model.detect(image);
    console.timeEnd('predict');


    const c = document.getElementById('canvas') as HTMLCanvasElement;
    const context = c.getContext('2d');
    context.drawImage(image, 0, 0);
    context.font = '10px Arial';

    console.log('number of detections: ', result.length);
    for (let i = 0; i < result.length; i++) {
      context.beginPath();
      context.rect(...result[i].bbox);
      context.lineWidth = 1;
      context.strokeStyle = 'green';
      context.fillStyle = 'green';
      context.stroke();
      context.fillText(
          result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
          result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
    }
  }
}
