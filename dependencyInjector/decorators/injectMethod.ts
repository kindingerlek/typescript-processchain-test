import Injector, { ClassDefinition } from "../index";


export function InjectMethod(...keys: ClassDefinition[]) {
    return (target: any, key: string, descriptor: any) => {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            var add = keys.map((key) => Injector.getRegistered(key));
            args = args.concat(add);

            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
