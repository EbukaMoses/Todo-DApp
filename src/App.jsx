import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function addTask() {
    if (!taskTitle || !taskText) return alert("Please enter task details");
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.addTask(taskText, taskTitle, false);
        await tx.wait();
        alert("Task added successfully");
        getMyTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  }

  async function getMyTasks() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const taskList = await contract.getMyTask();
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  }

  async function deleteTask(taskId) {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        alert("Task deleted successfully");
        getMyTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  }

  useEffect(() => {
    getMyTasks();
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.taskTitle}</strong>: {task.taskText}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
