import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import "./index.css";
import { Bounce, ToastContainer, toast } from "react-toastify";

const contractAddress = "0x74D3ABD84772869404fc8aEbA9F2803EBB0101D6";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function addTask() {
    if (!taskTitle || !taskText)
      return toast.error("Please enter task details");
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.addTask(taskText, taskTitle, false);
        await tx.wait();
        toast.success("Task added successfully");
        getMyTasks();
      } catch (error) {
        toast.error("Error adding task:", error);
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
        toast.error("Error fetching tasks:", error);
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
        toast.success("Task deleted successfully");
        getMyTasks();
      } catch (error) {
        toast.error("Error deleting task:", error);
      }
    }
  }

  useEffect(() => {
    getMyTasks();
  }, []);

  return (
    <div>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <div className="w-full bg-[#123] text-white flex justify-between py-5 px-8">
          <h4 className="font-extrabold text-white">DAPP</h4>
          {/* <h1 className="font-extrabold text-white">
            Smart Contract Interaction
          </h1> */}
          <h2 className="text-white">@Web3Bridge</h2>
        </div>
        <h1>Ebuka Task Manager</h1>
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
    </div>
  );
}

export default App;
