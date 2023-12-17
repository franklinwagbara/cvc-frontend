import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoqFormService {
  public liquidProductPreviewData: any[] = [];
  public liquidProductPreviewData$ = new BehaviorSubject<any[]>([]);
  public liquidProductReviewData: any[] = [];
  public liquidProductReviewData$ = new BehaviorSubject<any[]>([]);

  constructor() { }

  public get liquidProductDiff(): any {
    return {}
  }
}
