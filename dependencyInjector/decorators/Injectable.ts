import Injector from "..";

/**
 * Make the class Injectable
 */
export function Injectable(args?: any[]): Function {
    return function (target: new () => object): void {
        Injector.register(target, new target());
    };
}
