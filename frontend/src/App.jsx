import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchBoard, updateTask, createTask, deleteTask } from "./services/api";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function App() {
  // State Variables
  const [columns, setColumns] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    column: "todo",
  });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Handle initial API fetch
  useEffect(() => {
    fetchBoard().then((data) => setColumns(data.columns));
  }, []);

  // Handle drag and drop
  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return; // dropped outside any list :contentReference[oaicite:6]{index=6}

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [moved] = sourceCol.tasks.splice(source.index, 1);
    destCol.tasks.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
    await updateTask(draggableId, { column: destination.droppableId });
    if (source.droppableId != destination.droppableId) {
      fetchBoard().then((data) => setColumns(data.columns));
    }
  };

  // Handle form input changes
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new task
  const onSubmit = async (e) => {
    e.preventDefault();
    const newTask = await createTask(form);
    setColumns({
      ...columns,
      [newTask.column]: {
        ...columns[newTask.column],
        tasks: [newTask, ...columns[newTask.column].tasks],
      },
    });
    setForm({ title: "", description: "", column: "todo" });
    setModalOpen(false);
  };

  // Delete handler
  const handleDelete = async (taskId, columnKey) => {
    await deleteTask(taskId); // delete via API :contentReference[oaicite:0]{index=0}
    setColumns({
      ...columns,
      [columnKey]: {
        ...columns[columnKey],
        tasks: columns[columnKey].tasks.filter((t) => t.id !== taskId), // remove from state :contentReference[oaicite:1]{index=1}
      },
    });
  };

  // Start editing
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  // Cancel edit
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Submit update
  const submitEdit = async (task, columnKey) => {
    const updated = await updateTask(task.id, { title: editText }); // update via API :contentReference[oaicite:2]{index=2}
    setColumns({
      ...columns,
      [columnKey]: {
        ...columns[columnKey],
        tasks: columns[columnKey].tasks.map((t) =>
          t.id === task.id ? updated : t
        ), // replace in state :contentReference[oaicite:3]{index=3}
      },
    });
    window.location.reload();
    cancelEditing();
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4 h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([colKey, col]) => (
          <Droppable droppableId={colKey} key={colKey}>
            {(prov) => (
              <div
                ref={prov.innerRef}
                {...prov.droppableProps}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                <h2 className="font-bold mb-2 uppercase">{col.name}</h2>
                <hr />
                <br />
                {col.tasks.map((task, idx) => (
                  <Draggable draggableId={task.id} index={idx} key={task.id}>
                    {(p) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        className={
                          task.column === "done"
                            ? "bg-green-100 p-2 mb-2 rounded flex items-center justify-between hover:bg-green-200"
                            : "bg-gray-100 p-2 mb-2 rounded flex items-center justify-between hover:bg-gray-200"
                        }
                      >
                        {editingId === task.id ? (
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 mr-2 flex-grow focus:outline-none"
                          />
                        ) : (
                          <span className="flex-grow">{task.title}</span>
                        )}

                        <div className="flex space-x-1">
                          {editingId === task.id ? (
                            <>
                              <button
                                onClick={() => submitEdit(task, colKey)}
                                className="text-green-600 hover:underline"
                              >
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-red-600 hover:underline"
                              >
                                <XCircleIcon className="h-5 w-5 text-red-500" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(task)}
                                className="text-blue-600 hover:underline"
                              >
                                <PencilSquareIcon className="h-5 w-5 text-black" />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id, colKey)}
                                className="text-red-600 hover:underline"
                              >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {/* Floating Action Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full w-15 h-15 flex items-center font-bold justify-center shadow-lg"
        aria-label="Add Task"
      >
        <span className="text-4xl leading-none">+</span>
      </button>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-lg p-6 w-80 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">New Task</h2>

            <label className="block mb-2">
              <span className="text-gray-700">Title</span>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded px-2 py-1 focus:outline-none"
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                className="mt-1 block w-full border rounded px-2 py-1 focus:outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Column</span>
              <select
                name="column"
                value={form.column}
                onChange={onChange}
                className="mt-1 block w-full border rounded px-2 py-1 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-black text-white hover:bg-black"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
