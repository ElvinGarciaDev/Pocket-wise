import { useState, useEffect } from "react";

import "./App.css";
import Header from "./components/Header";
import AddBudget from "./components/AddBudget/AddBudget";
import AddExpenses from "./components/AddExpenses/AddExpenses";

import Expenses from "./components/Expenses/Expenses";

function App() {
  // Store the data that will be fetched from the backend. AT first it will be empty
  const [data, setData] = useState([]);

  // Store the budget the user saved to the database
  const [budget, setBudget] = useState([])

  // Store the balance. AT the start set the balance to the total budget
  const [balance, setBalance] = useState()


  // Fetch all expenses
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api");
      const data = await res.json();

      // the data we are getting looks like this. it's a big array that has all ther data, expenes, budget and a callculation
      // Of all the expenses. We need to break up the array and store specific data at different state variables
      // [
      //   {
      //     _id: 63c0d1cb2f1721388f151770,
      //     title: 'car',
      //     price: 100,
      //     createdAt: 2023-01-13T03:36:43.770Z,
      //     __v: 0
      //   },
      //   {
      //     _id: 63c0d1db2f1721388f151772,
      //     title: 'hotel',
      //     price: 50,
      //     createdAt: 2023-01-13T03:36:59.797Z,
      //     __v: 0
      //   },
      //   { _id: 63c0c52d2c41d334914337e2, budget: 500, __v: 0 },
      //   { allExpenses: 150 }
      // ]
  

      // use the set methods to set the state for the expenses and budget
      setData(data.data);
      setBudget(data.budgetData)

    }
    fetchData();

  }, []);


  // When someone adds a new expense to the database
  const addExpense = async (expense) => {
    const res = await fetch("/expense", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    const newExpense = await res.json();
    // The new task that was added will be sent back.
    // We need to set the new task. So take the current tasks state and add the new element added (data)
    setData([...data, newExpense]);

    // Update the balance
    setBalance(Number(balance) - Number(newExpense.price))
  };

  // When somone deletes an expense
  const deleteExpense = async (id) => {

    // Use setData to update the state. use the filter method to filter out the expense that was clicked
    setData(data.filter((expense) => expense._id !== id));
    
    let findExpense = data.filter((expense) => expense._id == id)
    // Update the balance
    console.log("is this", findExpense)
    setBalance(Number(balance) + Number(findExpense[0].price))

    await fetch(`/expense/${id}`, {
      method: "DELETE",
    });


  };

    // Add budget
    const addBudget = async (expense) => {
      console.log(expense)
      const res = await fetch("/budget", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(expense),
      });
  
      const budget = await res.json();
      // The new task that was added will be sent back.
      // We need to set the new task. So take the current tasks state and add the new element added (data)
      setBudget([budget]);
    };

    // if the user wants to update the budget
    const updateBudget = async (num) => {
      let id = budget[0]._id

      const res = await fetch(`/budget/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(num),
      });
  
      const updatedBudget = await res.json();
      // Budget should be an object. We need to store is in an array so we can set it as the state for budget
      let arr = []
      arr.push(updatedBudget)
      // The new budget that was added will be sent back.
      // We need to set the new budget. So take the current budget state and add the new element added (data)
      setBudget(arr);
    }

  return (
    <div>
      <Header title={"Pocket Wise"} userName={"Elvin"} budget={budget} />

      <div className="flex">
        {/* We want to have a form that can work for creating a budget for a new user and for also updating the budget if they alreday have a budget
            what I did was use a conditial. if the budget state is empty, it means there is no budget in the database so have the form call a POST
            request when submitted. Else there is a budget, so if the user submitts this form, send a put request */}
        {budget.length == 0 ? (<AddBudget onAdd={addBudget} innerText={"Enter budget"} />) : (<AddBudget onAdd={updateBudget} innerText={"Update budget"}/>)}
        <AddExpenses onAdd={addExpense} />
      </div>

      <div>
      <ul>
        <li>Total Budget</li>
        <li>{budget.map((item) => item.budget)}</li>
      </ul>

      <ul>
        <li>Balance</li>
        <li>{balance}</li>
      </ul>

      </div>

      <div className="expenseDiv">
        <h1>Expense List</h1>
        <Expenses tasks={data} onDelete={deleteExpense}/>
      </div>

    </div>

  );
}

export default App;
