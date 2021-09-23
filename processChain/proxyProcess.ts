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
        creationDate: new Date(),
      } as ProcessData<any>,
    });
  }

  
  private getThisProcessData(pipelineData: PipelineData<any>) {
    return pipelineData[this.processClass.name];
  }

  async onStart?(pipelineData: PipelineData<any>) {
    const processData = this.getThisProcessData(pipelineData)
    processData.status = ProcessStatus.started;
    processData.processDate = new Date();

    if (!this.concreteProcessInstance.onStart) return;

    console.log(`${this.processClass.name} - Chamando onStart()`);
    this.concreteProcessInstance.onStart(pipelineData);
    console.log(`${this.processClass.name} - onStart() Finalizado`);
  }


  async onFinish?(pipelineData: PipelineData<any>) {
    const processData = this.getThisProcessData(pipelineData)
    processData.status = ProcessStatus.finishing;
    if (!this.concreteProcessInstance.onFinish) return;

    console.log(`${this.processClass.name} - Chamando onFinish()`);
    this.concreteProcessInstance.onFinish(pipelineData);
    console.log(`${this.processClass.name} - onFinish() Finalizado`);
  }

  async onError?(error: any, pipelineData: PipelineData<any>) {
    const processData = this.getThisProcessData(pipelineData)

    processData.status = ProcessStatus.failed;
    if (!this.concreteProcessInstance.onError) return;

    console.log(`${this.processClass.name} - Chamando onError()`);
    this.concreteProcessInstance.onError(error, pipelineData);
    console.log(`${this.processClass.name} - onError() Finalizado`);
  }

  async onFinally?(pipelineData: PipelineData<any>) {
    const processData = this.getThisProcessData(pipelineData)
    
    processData.finishDate = new Date();
    
    if(processData.status != ProcessStatus.failed)
      processData.status = ProcessStatus.done;

    if (!this.concreteProcessInstance.onFinally) return;

    console.log(`${this.processClass.name} - Chamando onFinally()`);
    this.concreteProcessInstance.onFinally(pipelineData);
    console.log(`${this.processClass.name} - onFinally() Finalizado`);
  }

  async onProcess(pipelineData: PipelineData<any>) {
    const processData = this.getThisProcessData(pipelineData)
    processData.status = ProcessStatus.processing;
    try {
      if (this.onStart) this.onStart(pipelineData);

      console.log(`${this.processClass.name} - Chamando onProcess()`);
      const result = await this.concreteProcessInstance.onProcess(pipelineData);

      processData.data = result;
      console.log(`${this.processClass.name} - onProcess() Finalizou!`);

      if (this.onFinish) this.onFinish(pipelineData);
      console.log(`------------------------------------------------`);
      if (this.next) await this.next.onProcess(pipelineData);
    } catch (err: any) {
      console.error(err);
      processData.error = err
      if (this.onError) this.onError(err, pipelineData);
    } finally {
      if (this.onFinally) this.onFinally(pipelineData);
    }
  }
}
