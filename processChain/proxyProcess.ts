import Process from "./process";


export default class ProxyProcess implements Process {
  /** The next Process that implements {@link Process}*/
  next?: ProxyProcess;

  /** The concrete instance of object that implements {@link Process}*/
  concreteProcessInstance: Process;

  /** The class definition which implements {@link Process}*/
  processClass: new () => Process;

  constructor(concreteProcess: new () => Process) {
    this.processClass = concreteProcess;
    this.concreteProcessInstance = new concreteProcess();
  }

  async onStart?(processData: any) {
    if (!this.concreteProcessInstance.onStart) return;

    console.log(`${this.processClass.name} - Chamando onStart`);
    this.concreteProcessInstance.onStart(processData);
    console.log(`${this.processClass.name} - onStart Finalizado`);
  }

  async onFinish?(processData: any) {
    if (!this.concreteProcessInstance.onFinish) return;

    console.log(`${this.processClass.name} - Chamando onFinish`);
    this.concreteProcessInstance.onFinish(processData);
    console.log(`${this.processClass.name} - onFinish Finalizado`);
  }

  async onError?(error: any, processData: any) {
    if (!this.concreteProcessInstance.onError) return;

    console.log(`${this.processClass.name} - Chamando onError`);
    this.concreteProcessInstance.onError(error, processData);
    console.log(`${this.processClass.name} - onError Finalizado`);
  }

  async onFinally?(processData: any) {
    if (!this.concreteProcessInstance.onFinally) return;

    console.log(`${this.processClass.name} - Chamando onFinally`);
    this.concreteProcessInstance.onFinally(processData);
    console.log(`${this.processClass.name} - onFinally Finalizado`);
  }

  async onProcess(processData: any) {
    try {
      console.log(`------------------------------------------------`);
      if (this.onStart) this.onStart(processData);

      console.log(`${this.processClass.name} - Chamando onProcess`);
      const result = await this.concreteProcessInstance.onProcess(processData);

      // Append the result of process to pipeline data
      processData = Object.assign(processData, {
        [this.processClass.name]: result,
      });
      console.log(`${this.processClass.name} - onProcess Finalizou!`);

      if (this.onFinish) this.onFinish(processData);

      if (this.next) await this.next.onProcess(processData);
    } catch (err: any) {
      if (this.onError) this.onError(err, processData);
    } finally {
      if (this.onFinally) this.onFinally(processData);
    }
  }
}
