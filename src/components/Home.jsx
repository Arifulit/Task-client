
// Home.js
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: "",
    category: "To-Do",
  });
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        "https://task-manager-server-eight-ashy.vercel.app/tasks"
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.error("Error fetching tasks:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://task-manager-server-eight-ashy.vercel.app/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          timestamp: "",
          category: "To-Do",
        });
        fetchTasks();
      } else {
        console.error("Error adding task:", res.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const res = await fetch(
        `https://task-manager-server-eight-ashy.vercel.app/tasks/${updatedTask._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );
      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Error updating task:", res.statusText);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await fetch(
          `https://task-manager-server-eight-ashy.vercel.app/tasks/${id}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "The task has been deleted.",
            icon: "success",
          });
          fetchTasks();
        } else {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the task.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  const handleDragEnd = async (result) => {
    // eslint-disable-next-line no-unused-vars
    const { source, destination } = result;
    if (!destination) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(
      (task) => task._id === result.draggableId
    );
    if (!movedTask) return;

    movedTask.category = destination.droppableId;

    setTasks(updatedTasks);

    try {
      await fetch(
        `https://task-manager-server-eight-ashy.vercel.app/tasks/${movedTask._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movedTask),
        }
      );
    } catch (error) {
      console.error("Error updating task category:", error);
    }
  };

  const boardCategories = ["To-Do", "In Progress", "Done"];
  const tasksByCategoryForRender = {};
  boardCategories.forEach((category) => {
    tasksByCategoryForRender[category] = tasks
      .filter((task) => task.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return (
    <div className="max-w-full px-4 py-8 md:max-w-6xl md:mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-4 text-center">Task Board</h1>

      <form
        onSubmit={addTask}
        className="mb-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={(e) =>
            setFormData({ ...formData, timestamp: e.target.value })
          }
          required
          className="border p-2 rounded w-full"
        />
        <select
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          className="border p-2 rounded w-full"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button
          type="submit"
          className="col-span-1 sm:col-span-2 md:col-span-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      {editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateTask(editTask);
                setEditTask(null);
              }}
            >
              <input
                type="text"
                name="title"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                required
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="text"
                name="description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                required
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="datetime-local"
                name="timestamp"
                value={editTask.timestamp}
                onChange={(e) =>
                  setEditTask({ ...editTask, timestamp: e.target.value })
                }
                required
                className="border p-2 rounded mb-2 w-full"
              />
              <select
                name="category"
                value={editTask.category}
                onChange={(e) =>
                  setEditTask({ ...editTask, category: e.target.value })
                }
                required
                className="border p-2 rounded mb-2 w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditTask(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex overflow-x-auto space-x-4 flex-wrap sm:flex-nowrap">
          {boardCategories.map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white shadow-lg p-6 rounded-lg flex-1 w-full sm:w-[350px] transition-all mb-4"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {category}
                  </h2>
                  {tasksByCategoryForRender[category].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={`${task._id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 rounded-lg bg-slate-600 shadow-md border border-blue-300 mb-2 flex justify-between items-center transition-transform duration-200 ease-in-out transform ${
                            snapshot.isDragging ? "opacity-50" : ""
                          }`}
                        >
                          <div>
                            <h3 className="font-bold text-white">
                              {task.title}
                            </h3>
                            <p className="text-sm text-white">
                              {task.description}
                            </p>
                            <p className="text-xs text-white">
                              {new Date(task.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditTask(task)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
