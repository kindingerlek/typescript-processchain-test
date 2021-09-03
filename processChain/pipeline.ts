
import Process, { ProcessData } from "./process";
import ProxyProcess from "./proxyProcess";

export type PipelineData<T> = { [key: string]: ProcessData<T> };


export default class Pipeline {
  private processesList: ProxyProcess[] = [];
  private pipeData: PipelineData<any> = {};

  register(handler: new () => Process) {
    const proxyHandler = new ProxyProcess(handler, this.pipeData);
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