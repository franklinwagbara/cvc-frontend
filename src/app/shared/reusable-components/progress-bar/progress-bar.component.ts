import {
  Component,
  OnInit,
  Input,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent
  implements OnInit, AfterContentInit, OnChanges
{
  public isOpen: boolean;

  constructor(public progressBar: ProgressBarService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.progressBar.progressBar.subscribe((status) => {
      this.isOpen = status as boolean;
    });
  }
  ngAfterContentInit(): void {
    this.progressBar.progressBar.subscribe((status) => {
      this.isOpen = status as boolean;
    });
  }

  ngOnInit(): void {
    this.progressBar.progressBar.subscribe((status) => {
      this.isOpen = status as boolean;
    });
  }
}
