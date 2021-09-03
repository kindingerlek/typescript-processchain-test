import { InjectMethod } from "./injectMethod";
import { InjectProperty } from "./injectProperty";
import { ClassDefinition } from "../index";


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
