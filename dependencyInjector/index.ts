import { Inject } from './decorators/inject';
import { Injectable } from './decorators/Injectable';
import { InjectMethod } from './decorators/injectMethod';
import { InjectProperty } from './decorators/injectProperty';

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
    Inject,
    Injectable,
    InjectMethod,
    InjectProperty,
}