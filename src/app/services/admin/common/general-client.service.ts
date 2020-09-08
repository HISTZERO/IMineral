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

    if (keyResult === null || keyResult === undefined) {
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

    if (keyResult === null || keyResult === undefined) {
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

    if (result === null || result === undefined) {
      return false;
    }

    return true;
  }

  updateDataToList<T>(list: T[], data: T, keyPar: string): T[] {
    if (keyPar === null || keyPar === undefined) {
      return list;
    }

    let arrKeys: any[] = Object.keys(list[0]);
    let keyResult = arrKeys.find(key => key === keyPar);

    if (keyResult === null || keyResult === undefined) {
      return list;
    }

    arrKeys = Object.keys(data);
    keyResult = arrKeys.find(key => key === keyPar);

    if (keyResult === null || keyResult === undefined) {
      return list;
    }

    list.map((item, index) => {
      if (item[keyPar] === data[keyPar]) {
        list[index] = data;
        return list;
      }
    });

    return list;
  }

  generateOrderOfObject<T>(list: T[], keyName: string, startAt: number): T[] {
    if (keyName === null || keyName === undefined) {
      return list;
    }

    if (list == null || list.length === 0) {
      return list;
    }

    const arrKeys: any[] = Object.keys(list[0]);
    const keyResult = arrKeys.find(key => key === keyName);

    if (keyResult === null || keyResult === undefined) {
      return list;
    }

    if (typeof list[0][keyName] !== "number") {
      return list;
    }

    list.map((item, index) => {
      item[keyName] = startAt + index;
    });

    return list;
  }

  generateOrderOf<T>(list: T[], keyName: string, startAt: number): any[] {
    if (keyName === null || keyName === undefined) {
      return list;
    }

    if (list == null || list.length === 0) {
      return list;
    }

    const arrKeys: any[] = Object.keys(list[0]);
    const keyResult = arrKeys.find(key => key === keyName);

    if (keyResult === null || keyResult === undefined) {
      const listData = list as any[];
      listData.map((item, index) => {
        item[keyName] = startAt + index;
      });

      return listData;
    }

    if (typeof list[0][keyName] !== "number") {
      return list;
    }

    list.map((item, index) => {
      item[keyName] = startAt + index;
    });

    return list;
  }

  clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  cloneObject<T>(object: T): T {
    if (object === null) {
      return object;
    }

    if (object instanceof Date) {
      return new Date(object.getTime()) as any;
    }

    if (typeof object === 'object') {
      if (typeof object[(Symbol as any).iterator] === 'function') {
        const cp = [] as any[];
        if ((object as any as any[]).length > 0) {
          for (const arrayMember of object as any as any[]) {
            cp.push(this.cloneObject(arrayMember));
          }
        }
        return cp as any as T;
      } else {
        const targetKeys = Object.keys(object);
        const cp = {};
        if (targetKeys.length > 0) {
          for (const key of targetKeys) {
            cp[key] = this.cloneObject(object[key]);
          }
        }
        return cp as T;
      }
    }

    return object;
  }
}
