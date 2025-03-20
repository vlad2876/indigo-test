import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly _document = inject(DOCUMENT);
  private readonly _storage = this._document.defaultView?.localStorage;

  getItem<T>(key: string): T | null {
      const item = this._storage?.getItem(key);
      return item ? JSON.parse(item) : null;
  }

  setItem<T>(key: string, value: T): void {
      return this._storage?.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    return this._storage?.removeItem(key);
  }

  getKeys(): string[] {
    return this._storage ? Object.keys(this._storage) : [];
  }
}
