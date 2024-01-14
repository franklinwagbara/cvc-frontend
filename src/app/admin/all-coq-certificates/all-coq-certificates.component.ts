import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-coq-certificates',
  templateUrl: './all-coq-certificates.component.html',
  styleUrls: ['./all-coq-certificates.component.css']
})
export class AllCoqCertificatesComponent implements OnInit {
  certificates: any[]

  certificateKeysMappedToHeaders = {

  }

  ngOnInit(): void {
    
  }

  onViewData(event: any): void {
    window.location.assign(event?.url);
  }

}
