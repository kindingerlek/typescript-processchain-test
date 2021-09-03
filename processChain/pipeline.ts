import { IProcess } from ".";
import ProxyProcess from "./proxyProcess";

export default class Pipeline {
  private processesList: ProxyProcess[] = [];
  private pipeData: any = {};

  register(handler: new () => IProcess) {
    const proxyHandler = new ProxyProcess(handler);
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