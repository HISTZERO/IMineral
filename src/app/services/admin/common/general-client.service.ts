import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})

export class GeneralClientService {
  constructor() {}

  filterByKeyName<T>(data: T[], keyName: string, value: any): T[] {
    if (data === null || data.length === 0) {
      return data;
    }

    const arrKeys: any[] = Object.keys(data[0]);
    const keyResult = arrKeys.find(key => key === keyName);

    if (keyResult === null) {
      return data;
    }

    const result: T[] = [];

    for (const item of data) {
      if (this.isKeyName(Object.keys(item), keyName)  === true && item[keyName] === value) {
        result.push(item[keyName]);
      }
    }

    return result;
  }

  findByKeyName<T>(data: T[], keyName: string, value: any): T {
    if (data === null || data.length === 0) {
      return null;
    }

    const arrKeys: any[] = Object.keys(data[0]);
    const keyResult = arrKeys.find(key => key === keyName);

    if (keyResult === null) {
      return null;
    }

    let result: T = null;

    for (const item of data) {
      const dataKeys = Object.keys(item);
      if (this.isKeyName(dataKeys, keyName)  === true && item[keyName] === value) {
        result = item;
      }
    }

    return result;
  }

  private isKeyName(data: string[], keyName: string): boolean {
    if (data === null || data.length === 0) {
      return false;
    }

    const result = data.find(key => key === keyName);

    if (result === null) {
      return false;
    }

    return true;
  }
}
