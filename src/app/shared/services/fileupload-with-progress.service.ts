import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadWithProgressService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File, uploadUrl: string): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
    });

    return this.httpClient.request(request).pipe(
      this.trackUploadProgress()
    );
  }

  private trackUploadProgress(): ( source: Observable<any> ) => Observable<number> {
    return (source: Observable<any>): Observable<number> => {
      return new Observable<number>(observer => {
        source.subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              observer.next(percentDone);
            } else if (event instanceof HttpResponse) {
              observer.complete();
            }
          },
          error: error => {
            observer.error(error);
          }}
        );
      });
    };
  }
}
