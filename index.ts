/** This interface is used to define a process in a {@link Pipeline} */
interface IProcess {
  /**
   * This will be called **before** the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onStart?(processData: any): void;

  /**
   * This will be called **after** the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onFinish?(processData: any): void;

  /**
   * This will be called **when error occours** on the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onError?(error: any, processData: any): void;

  /**
   * This will be called **after** the {@link onFinish} function or the {@link onError}, even the {@link onProcess} throws an error
   *
   * (Optional implemention)
   * @param processData
   */
  onFinally?(processData: any): void;

  
  /**
   * This is where you define your logic of process.
   *
   * (Mandatory implemention)
   * @param processData
   */
  onProcess(processData: any): any;
}

class ProxyBaseProcess implements IProcess {
  /** The next Process that implements {@link IProcess}*/
  next?: ProxyBaseProcess;

  /** The concrete instance of object that implements {@link IProcess}*/
  concreteProcessInstance: IProcess;

  /** The class definition which implements {@link IProcess}*/
  handlerClass: new () => IProcess;
  constructor(realHandler: new () => IProcess) {
    this.handlerClass = realHandler;
    this.concreteProcessInstance = new realHandler();
  }
  onStart?(processData: any) {
    if (!this.concreteProcessInstance.onStart) return;

    console.log(`${this.handlerClass.name} - Chamando onStart`);
    this.concreteProcessInstance.onStart(processData);
    console.log(`${this.handlerClass.name} - onStart Finalizado`);
  }

  onFinish?(processData: any) {
    if (!this.concreteProcessInstance.onFinish) return;

    console.log(`${this.handlerClass.name} - Chamando onFinish`);
    this.concreteProcessInstance.onFinish(processData);
    console.log(`${this.handlerClass.name} - onFinish Finalizado`);
  }

  onError?(error: any, processData: any) {
    if (!this.concreteProcessInstance.onError) return;

    console.log(`${this.handlerClass.name} - Chamando onError`);
    this.concreteProcessInstance.onError(error, processData);
    console.log(`${this.handlerClass.name} - onError Finalizado`);
  }

  onFinally?(processData: any) {
    if (!this.concreteProcessInstance.onFinally) return;

    console.log(`${this.handlerClass.name} - Chamando onFinally`);
    this.concreteProcessInstance.onFinally(processData);
    console.log(`${this.handlerClass.name} - onFinally Finalizado`);
  }

  onProcess(processData: any) {
    try {
      if (this.onStart) this.onStart(processData);

      console.log(`${this.handlerClass.name} - Chamando onProcess`);
      this.concreteProcessInstance.onProcess(processData);
      console.log(`${this.handlerClass.name} - onProcess Finalizou!`);

      if (this.onFinish) this.onFinish(processData);

      if (this.next) this.next.onProcess(processData);
    } catch (err: any) {
      if (this.onError) this.onError(err, processData);
    } finally {
      if (this.onFinally) this.onFinally(processData);
    }
  }
}

class Pipeline {
  processesList: ProxyBaseProcess[] = [];
  pipeData: any = {};

  register(handler: new () => IProcess) {
    const proxyHandler = new ProxyBaseProcess(handler);
    const lastHandler = this.processesList[this.processesList.length - 1];

    if (lastHandler) lastHandler.next = proxyHandler;

    this.processesList.push(proxyHandler);
  }

  start() {
    const firstProcess = this.processesList[0];

    if (!firstProcess) throw new Error("No process are registered to this ProcessChain");

    let result = firstProcess.onProcess(this.pipeData);
    Object.assign(this.pipeData, result);
  }
}

class OperationOne implements IProcess {
  onStart(processData: any) {
    console.log("Inicianando processo 1");
  }
  onProcess(processData: any) {
    console.log("Processando 1");
  }
}

class OperationTwo implements IProcess {
  onProcess(processData: any) {
    console.log("Processando 2");
  }
  onFinish(processData: any) {
    console.log("Finalizado processo 2");
  }
}

class OperationThree implements IProcess {
  onProcess(processData: any) {
    console.log("Processando 3");
  }
}


let pipe = new Pipeline();

pipe.register(OperationOne);
pipe.register(OperationTwo);
pipe.register(OperationThree);

pipe.start();
