import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
@Component({
  selector: 'demo-circular-progress',
  inputs: ['size'],
  templateUrl: 'build/pages/circularprogress/circularprogress.html'
})
export class CircularProgressComponent {
    size: string;
    
}