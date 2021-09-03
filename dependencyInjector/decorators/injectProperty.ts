import Injector, { ClassDefinition } from "../index";

export function InjectProperty(...keys: ClassDefinition[]) {
    return (target: any, key: string) => {
        target[key] = Injector.getRegistered(keys[0]);
    };
}
