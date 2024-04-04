import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageSub$: Subject<boolean> = new Subject<boolean>();
  private isMobile!: boolean;

  constructor(private ngZone: NgZone) {
    this.isMobile = this.checkIsMobile();

    if (!this.isMobile) {
      navigator.vibrate(2000);

      window.addEventListener('storage', (event) =>
        this.onStorageChange(event)
      );
    } else {
      navigator.vibrate(10000);
    }
  }

  getStorage(): Observable<boolean> {
    return this.storageSub$.asObservable();
  }

  private onStorageChange(event: StorageEvent) {
    if (event.storageArea?.length === 0 || event.key === 'fb-token-exp') {
      this.ngZone.run(() => this.storageSub$.next(true));
    }
  }

  private checkIsMobile(): boolean {
    // Проверка на мобильное устройство по user agent
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  }
}
