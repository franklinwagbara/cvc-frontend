import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadWithProgressService {

  public uploadResponses: any[] = [];
  public uploadResponses$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File, uploadUrl: string, docIndex: number): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
    });

    return this.httpClient.request(request).pipe(
      this.trackUploadProgress(docIndex)
    );
  }

  private trackUploadProgress(docIndex: number): ( source: Observable<any> ) => Observable<any> {
    return (source: Observable<any>): Observable<any> => {
      return new Observable<number>(observer => {
        source.subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              observer.next(percentDone);
            } else if (event instanceof HttpResponse) {
              observer.complete();
              const res = event.body;
              if (!Array.isArray(res) && Object.keys(res).length) {
                let responseExists = false;
                this.uploadResponses = this.uploadResponses.map((el) => {
                  if (el?.docIndex === docIndex) {
                    responseExists = true;
                    return res;
                  }
                  return el;
                });
                if (!responseExists) {
                  this.uploadResponses.push({ ...event.body, docIndex });
                }
                this.uploadResponses$.next(this.uploadResponses);
              }
            }
          },
          error: error => {
            observer.error(error);
          }}
        )});
    };
  }
}
