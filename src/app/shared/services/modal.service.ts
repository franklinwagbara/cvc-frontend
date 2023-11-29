import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private emodalcom = new Subject<boolean>();
    public emodal = this.emodalcom.asObservable();
    private noticecom = new Subject<boolean>();
    public notice = this.noticecom.asObservable();
    private subecom = new Subject<boolean>();
    public sube = this.subecom.asObservable();
    private appcover = new Subject<boolean>();
    public cover = this.appcover.asObservable();
    private appconnective = new Subject<boolean>();
    public connective = this.appconnective.asObservable();
    private reload = new Subject<boolean>();
    public reloado = this.reload.asObservable();
    private concessionSituCom = new Subject<boolean>();
    public concessionSitu = this.concessionSituCom.asObservable();
    public head: any;
    public body: any;
    public icon: any;
    public isNonBlocker = false;
    public concessionHeld: string;

    public logYawa(body: any, head: any) {
        this.head = head;
        this.body = body;
        this.emodalcom.next(true);
    }
    public logNotice(body: any, head?: any, icon?: any) {
        this.head = head;
        this.body = body;
        this.icon = icon;
        this.noticecom.next(true);
    }

    public logConnective() {
      this.appconnective.next(true);
    }

    public logSub(body: any) {
      this.body = body;
      this.subecom.next(true);
    }
    public logCover(body?: any, isnonblocker = false) {
      this.body = body;
      this.isNonBlocker = isnonblocker;
      this.appcover.next(true);
    }
    public logReload() {
      this.reload.next(true);
    }

    public togYawa() {
        this.emodalcom.next(false);
    }
    public togNotice() {
        this.noticecom.next(false);
    }

    public togConnective() {
      this.appconnective.next(false);
    }

    public togSub() {
      this.subecom.next(false);
    }
    public togCover() {
      this.appcover.next(false);
    }

    public logConcessionSituation(data: string) {
      this.concessionHeld = data;
      this.concessionSituCom.next(true);
    }
}
