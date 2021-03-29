import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createAt: string;
}
// dados pra criar uma transaction
//interface TransactionInput {
//    title: string;
//    amount: number;
//    type: string;
//    category: string;
//  }
//ou
// retirar id e createAt
type TransactionInput = Omit<Transaction, 'id' | 'createAt'>;
// ou pegar apenas
//type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type'| 'category'>;
interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  //toda função async retorna uma Promise
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // usando axios
  useEffect(() => {
    api.get('/transactions')
    .then(response => setTransactions(response.data.transactions))
   }, []);

  async function createTransaction(transactionInput : TransactionInput) {
    
    const response = await api.post('/transactions', {
      ...transactionInput,
      createAt: new Date(),
    })
    const { transaction } = response.data;

    //Criando um vetor com a informção que já tem + a informação nova
    setTransactions([
      ...transactions,
      transaction,
    ]);
  }  
   
   return (
     <TransactionsContext.Provider value={{ transactions, createTransaction}} >
       {children}
     </TransactionsContext.Provider>

   )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}