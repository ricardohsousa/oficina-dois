export type TransactionContext = {
  transaction: unknown;
};

export interface TransactionManager {
  runInTransaction<T>(operation: (context: TransactionContext) => Promise<T>): Promise<T>;
}
