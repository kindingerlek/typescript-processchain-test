import { PipelineData } from "./pipeline";
import Process, { ProcessStatus } from "./process";

export function requireProcess(...previousOperations: (new () => Process)[]) {
  return (target: any, key: string, propDesc: PropertyDescriptor) => {
    const originalMethod = propDesc.value!;


    propDesc.value = (pipelineData: PipelineData<any>) => {
      for (let op of previousOperations) {
        if (op.name == target.constructor.name)
          throw new Error(`The process ${target.constructor.name} can't require it's self.`);

        if (pipelineData[op.name] == undefined)
          throw new Error(`The result of '${op.name}' is required but was not found on pipeline`);
      }

      return originalMethod(pipelineData);
    };
  };
}

export function requireProcessSuccess(...previousOperations: (new () => Process)[]) {
  return (target: any, key: string, propDesc: PropertyDescriptor) => {
    const originalMethod = propDesc.value!;


    propDesc.value = (pipelineData: PipelineData<any>) => {
      for (let op of previousOperations) {
        if (op.name == target.constructor.name)
          throw new Error(`The process ${target.constructor.name} can't require it's self.`);

        if (pipelineData[op.name] == undefined)
          throw new Error(`The result of '${op.name}' is required but was not found on pipeline`);

        if(pipelineData[op.name].status != ProcessStatus.done)
          throw new Error(`The process '${op.name}' has not a success status`);
      }

      return originalMethod(pipelineData);
    };
  };
}
