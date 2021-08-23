/** This interface is used to define a process in a {@link Pipeline} */
interface IProcess {
  /**
   * This will be called **before** the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onStart?(processData: any): Promise<void>;

  /**
   * This will be called **after** the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onFinish?(processData: any): Promise<void>;

  /**
   * This will be called **when error occours** on the {@link onProcess} function;
   *
   * (Optional implemention)
   * @param processData
   */
  onError?(error: any, processData: any): Promise<void>;

  /**
   * This will be called **after** the {@link onFinish} function or the {@link onError}, even the {@link onProcess} throws an error
   *
   * (Optional implemention)
   * @param processData
   */
  onFinally?(processData: any): Promise<void>;

  
  /**
   * This is where you define your logic of process.
   *
   * (Mandatory implemention)
   * @param processData
   */
  onProcess(processData: any): Promise<any>;
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
      processData = Object.assign(processData, {
        [this.handlerClass.name] : result
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

class Pipeline {
  private processesList: ProxyBaseProcess[] = [];
  private pipeData: any = {};

  register(handler: new () => IProcess) {
    const proxyHandler = new ProxyBaseProcess(handler);
    const lastHandler = this.processesList[this.processesList.length - 1];

    if (lastHandler) lastHandler.next = proxyHandler;

    this.processesList.push(proxyHandler);
  }

  async start() {
    const firstProcess = this.processesList[0];

    if (!firstProcess) throw new Error("No process are registered to this ProcessChain");

    let result = await firstProcess.onProcess(this.pipeData);
    // this.pipeData = Object.assign(this.pipeData, result);
  }

  getResult() {
    return this.pipeData;
  }
}

class OperationOne implements IProcess {
  async onStart(processData: any) {
    console.log("Iniciando processo 1");
  }
  async onProcess(processData: any) {
    console.log("Processando 1");

    return 1;
  }
}

class OperationTwo implements IProcess {
  async onProcess(processData: any) {
    console.log("Processando 2");

    return 'processo 2';
  }
  async onFinish(processData: any) {
    console.log("Finalizado processo 2");
  }
}

class OperationThree implements IProcess {
  async onProcess(processData: any) {
    console.log("Processando 3");

    return ['123','1']
  }
}

async function run() {

  
  let pipe = new Pipeline();

  pipe.register(OperationOne);
  pipe.register(OperationTwo);
  pipe.register(OperationThree);
  
  await pipe.start();

  console.log(pipe.getResult())
  
  console.log('Done');
}

run();