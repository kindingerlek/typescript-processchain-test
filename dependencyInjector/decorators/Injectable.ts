/*
    Created by: Lucas Ernesto Kindinger
    Date: 2021

    References: 
    - https://source.coveo.com/2016/02/04/typescript-injection-decorator/
    - https://www.danielcornock.co.uk/articles/dependency-injection-typescript-decorators
*/

import Injector from "..";

/**
 * Make the class able to be instanciated when program starts, and injected on property
 */
export function injectable(args?: any[]): Function {
    return function (target: new () => object): void {
        Injector.register(target, new target());
    };
}
