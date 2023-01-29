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
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  video: HTMLVideoElement;


  constructor() {

  }

  imageURL: string;
  model: cocoSSD.ObjectDetection;

  async loadModel() {
    console.log('load start');
    //  .assets/data-models/ssd_mobilenet_v1_1_metadata_1.tflite
    // this.model = await cocoSSD.load({
    //   base: 'mobilenet_v1',
    //   modelUrl: 'https://github.com/BaasMurdo/Midas/blob/try-upgrade-001/Midas-Desktop/src/assets/data-models/ssd_mobilenet_v1_1_metadata_1.tflite'
    // });

    this.model = await cocoSSD.load();

    console.log('load end');
    if (this.model) {
      console.log('load good');
      this.$modelLoaded.next(true);
    } else {
      console.log('load bad');
      this.$modelLoaded.next(false);
    }
  }

  async predict(image: any) {
    if (image)
      try {
        console.log('in predict')
        console.log('predict start');
        const result = await this.model.detect(image);
        console.log('predict end');


        const c = document.getElementById('canvas') as HTMLCanvasElement;
        c.width = 224;
        c.height = 224;
        console.log('canvas ?', c);
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
      } catch (ex) {
        console.log('try/c error', ex)
      }
  }


  startPredictVideo(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")

    video.addEventListener("play", () => {
      this.canvas.width = video.videoWidth
      this.canvas.height = video.videoHeight
      this.timerCallback()
    }, false)
  }

  async timerCallback() {
    if (this.video.paused || this.video.ended) {
      return
    }
    await this.computeFrame()
    setTimeout(() => this.timerCallback(), 0)
  };

  async computeFrame() {
    // detect objects in the image.
    const predictions = await this.model.detect(this.video)

    const context = this.context
    // draws the frame from the video at position (0, 0)
    context.drawImage(this.video, 0, 0)

    context.strokeStyle = "red"
    context.fillStyle = "red"
    context.font = "16px sans-serif"
    for (const { bbox: [x, y, width, height], class: _class, score } of predictions) {
      // draws a rect with top-left corner of (x, y)
      context.strokeRect(x, y, width, height)
      // writes the class directly above (x, y), outside the rectangle
      context.fillText(_class, x, y)
      // writes the class directly below (x, y), inside the rectangle
      context.fillText(score.toFixed(2), x, y + 16)
    }
  }

}
