import { useSelector } from "react-redux";
import AddTransactionForm from "../components/AddTransactionForm";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TransactionList from "../components/TransactionList";

const TransactionsPage = () => {
  const items = useSelector((state) => state.transactions.items);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <TransactionList />
      </div>
      <div className="flex flex-col gap-5">
        <AddTransactionForm />
        <CategoryBreakdown transactions={items} />
      </div>
    </div>
  );
};

export default TransactionsPage;
