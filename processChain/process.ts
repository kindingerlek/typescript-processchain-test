/** This interface is used to define a process in a {@link Pipeline} */
export default interface Process {
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