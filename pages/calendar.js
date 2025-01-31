import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import '../styles/globals.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: "",
    category: "",
    date: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const daysOfWeek = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
    "Niedziela",
  ];

  useEffect(() => {
    const checkAuthState = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          router.push("/login");
        }
      });
    };

    checkAuthState();
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTasks = async () => {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      };
      fetchTasks();
    }
  }, [isLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.text && newTask.category && newTask.date) {
      const localDate = new Date(newTask.date);
      const adjustedDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      await addDoc(collection(db, "tasks"), {
        ...newTask,
        date: adjustedDate,
      });
      setNewTask({ text: "", category: "", date: "" });
      const querySnapshot = await getDocs(collection(db, "tasks"));
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } else {
      alert("Wszystkie pola są wymagane.");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
  };

  const handleUpdateTask = async () => {
    if (selectedTask.text && selectedTask.category) {
      const taskDoc = doc(db, "tasks", selectedTask.id);
      await updateDoc(taskDoc, {
        text: selectedTask.text,
        category: selectedTask.category,
      });
      setSelectedTask(null);
      const querySnapshot = await getDocs(collection(db, "tasks"));
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask(null);
  };

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return {
      firstDay,
      days,
    };
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderTasksForDate = (date) => {
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    return tasks
      .filter((task) => task.date === adjustedDate)
      .map((task) => (
        <div
          key={task.id}
          className={`task-item ${
            task.category === "Personal" ? "personal-task" : "work-task"
          }`}
          onClick={() => handleEditTask(task)}
        >
          {task.text}
        </div>
      ));
  };

  const { firstDay, days } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="calendar-container">
        <h1>
          {currentDate.toLocaleString("pl-PL", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <div className="calendar-navigation">
          <button onClick={handlePreviousMonth}>Poprzedni</button>
          <button onClick={handleNextMonth}>Następny</button>
        </div>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            name="text"
            placeholder="Opis zadania"
            value={newTask.text}
            onChange={handleInputChange}
          />
          <select
            name="category"
            value={newTask.category}
            onChange={handleInputChange}
          >
            <option value="">Wybierz kategorię</option>
            <option value="Personal">Prywatne</option>
            <option value="Work">Praca</option>
          </select>
          <input
            type="date"
            name="date"
            value={newTask.date}
            onChange={handleInputChange}
          />
          <button type="submit">Dodaj</button>
        </form>
        {selectedTask && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edytuj zadanie</h2>
              <input
                type="text"
                value={selectedTask.text}
                onChange={(e) =>
                  setSelectedTask((prev) => ({ ...prev, text: e.target.value }))
                }
              />
              <select
                value={selectedTask.category}
                onChange={(e) =>
                  setSelectedTask((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="Personal">Prywatne</option>
                <option value="Work">Praca</option>
              </select>
              <button onClick={handleUpdateTask}>Zapisz</button>
              <button onClick={() => handleDeleteTask(selectedTask.id)}>
                Usuń
              </button>
              <button onClick={() => setSelectedTask(null)}>Anuluj</button>
            </div>
          </div>
        )}
        <div className="calendar-grid">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="calendar-day-name">
              {day}
            </div>
          ))}
          {Array((firstDay.getDay() + 6) % 7)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="calendar-empty"></div>
            ))}
          {days.map((day) => (
            <div key={day} className="calendar-day">
              <div className="calendar-day-number">{day.getDate()}</div>
              <div className="tasks">{renderTasksForDate(day)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
