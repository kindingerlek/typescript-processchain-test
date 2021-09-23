/*
    Created by: Lucas Ernesto Kindinger
    Date: 2021

    References: 
    - https://source.coveo.com/2016/02/04/typescript-injection-decorator/
    - https://www.danielcornock.co.uk/articles/dependency-injection-typescript-decorators
*/

import Injector, { ClassDefinition } from "../index";

/**
 * @param keys The class that needs to be injected
 * @returns 
 */
export function injectProperty(keys: ClassDefinition) {
    return (target: any, key: string) => {
        target[key] = Injector.getRegistered(keys);
    };
}
