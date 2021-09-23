import { PipelineData } from "./pipeline";

export enum ProcessStatus {
  pending = 'pending',
  started = 'started',
  processing = 'processing',
  finishing = 'finishing',
  done = 'done',
  failed = 'failed',
}

export interface ProcessData<T> {
  status: ProcessStatus;
  creationDate: Date;
  processDate?: Date;
  finishDate?: Date;
  data?: T;
  error?: any; 
}


/** This interface is used to define a process in a {@link Pipeline} */
export default interface Process {
  /**
   * (Optional implemention)
   * This will be called **before** the {@link onProcess} function;
   *
   * @param pipelineData
   */
  onStart?(pipelineData: PipelineData<any>): Promise<void>;

  /**
   * (Optional implemention)
   * This will be called **after** the {@link onProcess} function;
   *
   * @param pipelineData
   */
  onFinish?(pipelineData: PipelineData<any>): Promise<void>;

  /**
   * (Optional implemention)
   * This will be called **when error occours** on the {@link onProcess} function;
   *
   * @param pipelineData
   */
  onError?(error: any, pipelineData: PipelineData<any>): Promise<void>;

  /**
   * (Optional implemention)
   * This will be called **after** the {@link onFinish} function or the {@link onError}, even the {@link onProcess} throws an error
   *
   * @param pipelineData
   */
  onFinally?(pipelineData: PipelineData<any>): Promise<void>;

  
  /**
   * (Mandatory implemention)
   * This is where you define your logic of process.
   *
   * @param pipelineData
   */
  onProcess(pipelineData: PipelineData<any>): Promise<any>;
}