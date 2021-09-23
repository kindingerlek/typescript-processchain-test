import { injectable, injectProperty } from "./dependencyInjector";

import Pipeline, { PipelineData } from "./processChain/pipeline";
import Process from "./processChain/process";
import { requireProcess } from "./processChain/requireProcess";

@injectable()
class ProviderA {
  getValue() {
    return "Value from ProviderA";
  }
}

@injectable()
class ProviderB {
  getValue() {
    return "Value from ProviderB";
  }
}

class OperationOne implements Process {
  async onStart(processData: PipelineData<any>) {
    console.log("Iniciando processo 1");
  }
  async onProcess(processData: PipelineData<any>) {
    console.log("Processando 1");

    return 1;
  }
}

class OperationTwo implements Process {
  @injectProperty(ProviderA)
  private provider?: ProviderA;

  async onProcess(processData: PipelineData<any>) {
    console.log("Processando 2");

    if (this.provider) console.log("Retorno do provider no OperationTwo" + this.provider.getValue());

    return "processo 2";
  }
  async onFinish(processData: PipelineData<any>) {
    console.log("Finalizado processo 2");
  }
}

class OperationThree implements Process {
  @injectProperty(ProviderB)
  private provider?: ProviderB;

  @requireProcess(OperationOne, OperationTwo)
  async onProcess(processData: PipelineData<any>) {
    console.log("Processando 3");

    return ["123", "1", this.provider?.getValue()];
  }
}

async function run() {
  let pipe = new Pipeline();

  pipe.register(OperationOne);
  //pipe.register(OperationTwo);
  pipe.register(OperationThree);

  await pipe.start();

  console.log("Done");
  console.log("Results: ", pipe.getResult());
}

run();
