import { IProcess } from ".";

export default class ProxyProcess implements IProcess {
  /** The next Process that implements {@link IProcess}*/
  next?: ProxyProcess;

  /** The concrete instance of object that implements {@link IProcess}*/
  concreteProcessInstance: IProcess;

  /** The class definition which implements {@link IProcess}*/
  handlerClass: new () => IProcess;

  constructor(realHandler: new () => IProcess) {
    this.handlerClass = realHandler;
    this.concreteProcessInstance = new realHandler();
  }

  async onStart?(processData: any) {
    if (!this.concreteProcessInstance.onStart) return;

    console.log(`${this.handlerClass.name} - Chamando onStart`);
    this.concreteProcessInstance.onStart(processData);
    console.log(`${this.handlerClass.name} - onStart Finalizado`);
  }

  async onFinish?(processData: any) {
    if (!this.concreteProcessInstance.onFinish) return;

    console.log(`${this.handlerClass.name} - Chamando onFinish`);
    this.concreteProcessInstance.onFinish(processData);
    console.log(`${this.handlerClass.name} - onFinish Finalizado`);
  }

  async onError?(error: any, processData: any) {
    if (!this.concreteProcessInstance.onError) return;

    console.log(`${this.handlerClass.name} - Chamando onError`);
    this.concreteProcessInstance.onError(error, processData);
    console.log(`${this.handlerClass.name} - onError Finalizado`);
  }

  async onFinally?(processData: any) {
    if (!this.concreteProcessInstance.onFinally) return;

    console.log(`${this.handlerClass.name} - Chamando onFinally`);
    this.concreteProcessInstance.onFinally(processData);
    console.log(`${this.handlerClass.name} - onFinally Finalizado`);
  }

  async onProcess(processData: any) {
    try {
      if (this.onStart) this.onStart(processData);

      console.log(`${this.handlerClass.name} - Chamando onProcess`);
      const result = await this.concreteProcessInstance.onProcess(processData);

      // Append the result of process to pipeline data
      processData = Object.assign(processData, {
        [this.handlerClass.name]: result,
      });
      console.log(`${this.handlerClass.name} - onProcess Finalizou!`);

      if (this.onFinish) this.onFinish(processData);

      if (this.next) await this.next.onProcess(processData);
    } catch (err: any) {
      if (this.onError) this.onError(err, processData);
    } finally {
      if (this.onFinally) this.onFinally(processData);
    }
  }
}
