/*
    Created by: Lucas Ernesto Kindinger
    Date: 2021

    References: 
    - https://source.coveo.com/2016/02/04/typescript-injection-decorator/
    - https://www.danielcornock.co.uk/articles/dependency-injection-typescript-decorators
*/

import { InjectMethod } from "./injectMethod";
import { InjectProperty } from "./injectProperty";
import { ClassDefinition } from "../index";


/**
 * Inject an instance of the specified class on constructor. If more than one class is provided, an instance for each 
 * class is returned in same order specified;
 * 
 * @return An instance of the specified class;
 */

export function Inject(...keys: ClassDefinition[]){
    return function (...args: any[]) {
        var params = [];
        for (var i = 0; i < args.length; i++) {
            args[i] ? params.push(args[i]) : null;
        }
        
        switch (params.length) {
            case 2:
                return InjectProperty(keys[0])//.apply(this, args);
            case 3:
                return InjectMethod(...keys)//.apply(this, args);
            default:
                throw new Error("Decorators are not valid here!");
        }
    };
}
