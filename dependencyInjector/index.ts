/*
    Created by: Lucas Ernesto Kindinger
    Date: 2021

    References: 
    - https://source.coveo.com/2016/02/04/typescript-injection-decorator/
    - https://www.danielcornock.co.uk/articles/dependency-injection-typescript-decorators
*/

import { inject } from './decorators/inject';
import { injectMethod } from './decorators/injectMethod';
import { injectProperty } from './decorators/injectProperty';
import { injectable } from './decorators/injectable';

export type ClassDefinition = new () => object;

export default class Injector {

  private static registery: {[key: string]: any} = {};

  static getRegistered(key: ClassDefinition) {
      var registered = Injector.registery[key.name];
      if (registered) {
          return registered;
      } else {
          throw new Error(`Error: ${key} was not registered.`);
      }
  }

  static register(key: ClassDefinition, value: any) {
      var registered = Injector.registery[key.name];
      if (registered) {
          console.log(`Overriding registered value at ${key.name}.`);
      } else {
          console.log(`Registered value at ${key.name}.`);
      }
      Injector.registery[key.name] = value;
  }
}

export {
    inject,
    injectable,
    injectMethod,
    injectProperty,
}
