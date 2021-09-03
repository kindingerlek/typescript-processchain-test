import { PipelineData } from "./pipeline";
import Process, { ProcessData, ProcessStatus } from "./process";


export default class ProxyProcess implements Process {
  /** The next Process that implements {@link Process}*/
  next?: ProxyProcess;

  /** The concrete instance of object that implements {@link Process}*/
  concreteProcessInstance: Process;

  /** The class definition which implements {@link Process}*/
  processClass: new () => Process;

  constructor(concreteProcess: new () => Process, pipelineData: PipelineData<any>) {
    this.processClass = concreteProcess;
    this.concreteProcessInstance = new concreteProcess();

    // Append the result of process to pipeline data
    pipelineData = Object.assign(pipelineData, {
      [this.processClass.name]: {
        status: ProcessStatus.pending,
        data: undefined
      } as ProcessData<any>,
    });
  }

  async onStart?(pipelineData: PipelineData<any>) {
    pipelineData[this.processClass.name].status = ProcessStatus.started;

    if (!this.concreteProcessInstance.onStart) return;

    console.log(`${this.processClass.name} - Chamando onStart`);
    this.concreteProcessInstance.onStart(pipelineData);
    console.log(`${this.processClass.name} - onStart Finalizado`);
  }

  async onFinish?(pipelineData: PipelineData<any>) {
    pipelineData[this.processClass.name].status = ProcessStatus.finishing;
    if (!this.concreteProcessInstance.onFinish) return;

    console.log(`${this.processClass.name} - Chamando onFinish`);
    this.concreteProcessInstance.onFinish(pipelineData);
    console.log(`${this.processClass.name} - onFinish Finalizado`);
  }

  async onError?(error: any, pipelineData: PipelineData<any>) {
    pipelineData[this.processClass.name].status = ProcessStatus.failed;
    if (!this.concreteProcessInstance.onError) return;

    console.log(`${this.processClass.name} - Chamando onError`);
    this.concreteProcessInstance.onError(error, pipelineData);
    console.log(`${this.processClass.name} - onError Finalizado`);
  }

  async onFinally?(pipelineData: PipelineData<any>) {
    pipelineData[this.processClass.name].status = ProcessStatus.done;
    if (!this.concreteProcessInstance.onFinally) return;

    console.log(`${this.processClass.name} - Chamando onFinally`);
    this.concreteProcessInstance.onFinally(pipelineData);
    console.log(`${this.processClass.name} - onFinally Finalizado`);
  }

  async onProcess(pipelineData: PipelineData<any>) {
    pipelineData[this.processClass.name].status = ProcessStatus.processing;
    try {
      console.log(`------------------------------------------------`);
      if (this.onStart) this.onStart(pipelineData);

      console.log(`${this.processClass.name} - Chamando onProcess`);
      const result = await this.concreteProcessInstance.onProcess(pipelineData);

      pipelineData[this.processClass.name].data = result;


      console.log(`${this.processClass.name} - onProcess Finalizou!`);

      if (this.onFinish) this.onFinish(pipelineData);

      if (this.next) await this.next.onProcess(pipelineData);
    } catch (err: any) {
      if (this.onError) this.onError(err, pipelineData);
    } finally {
      if (this.onFinally) this.onFinally(pipelineData);
    }
  }
}
