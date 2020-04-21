import Transaction from '../models/Transaction';
import Balance from '../models/Balance';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const reducer = (
      currentValue: Omit<Balance, 'total'>,
      transaction: Transaction,
    ): Omit<Balance, 'total'> => {
      const newValue: Omit<Balance, 'total'> = {
        income: currentValue.income,
        outcome: currentValue.outcome,
      };

      if (transaction.type === 'income') {
        newValue.income += transaction.value;
      } else {
        newValue.outcome += transaction.value;
      }

      return newValue;
    };

    const acumulator: Omit<Balance, 'total'> = { income: 0, outcome: 0 };

    const balance = new Balance(this.transactions.reduce(reducer, acumulator));

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
