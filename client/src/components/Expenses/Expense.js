import "./Expense.css";

const Expense = ({ task }) => {
  return (
    <div className="singleExpense">
      <ul>
        <li className="nav-item">
          <h3>{task.text}</h3>
        </li>
        <li className="nav-item price">
          <span>{task.price}</span>
        </li>
        <li className="nav-item">
          <i class="bi bi-trash3-fill"></i>
        </li>
      </ul>
    </div>
  );
};

export default Expense;
