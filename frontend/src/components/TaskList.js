import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

function TaskList({ isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchByName, setSearchByName] = useState('');
  const [searchByEmail, setSearchByEmail] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    open: false,
    done: false,
    'in progress': false,
  });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const tasksPerPage = 3;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/task_manager/api/get_tasks');
        setTasks(response.data);
        setFilteredTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchByName) {
      filtered = filtered.filter((task) =>
        task.user.name.toLowerCase().includes(searchByName.toLowerCase())
      );
    }

    if (searchByEmail) {
      filtered = filtered.filter((task) =>
        task.user.email.toLowerCase().includes(searchByEmail.toLowerCase())
      );
    }

    const activeStatuses = Object.keys(statusFilters).filter(
      (key) => statusFilters[key]
    );

    if (activeStatuses.length > 0) {
      filtered = filtered.filter((task) => activeStatuses.includes(task.status));
    }

    setFilteredTasks(filtered);
  }, [searchByName, searchByEmail, statusFilters, tasks]);

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen((prev) => !prev);
  };

  const handleStatusChange = (status) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  const handleBlur = async (taskId, updatedFields) => {
    try {
      const response = await axios.put('/task_manager/api/update_task', {
        task_key: taskId,
        updated_fields: updatedFields,
      });

      if (response.data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedFields } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="task-list-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by email"
          value={searchByEmail}
          onChange={(e) => setSearchByEmail(e.target.value)}
        />
        <div className="status-dropdown">
          <button className="dropdown-button" onClick={toggleStatusDropdown}>
            Filter by Status
          </button>
          {statusDropdownOpen && (
            <div className="dropdown-menu">
              {Object.keys(statusFilters).map((status) => (
                <label key={status}>
                  <input
                    type="checkbox"
                    checked={statusFilters[status]}
                    onChange={() => handleStatusChange(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <table className="task-list-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Task Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id}>
              <td>
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={task.user.name}
                    onBlur={(e) =>
                      handleBlur(task.id, { user: { name: e.target.value } })
                    }
                  />
                ) : (
                  task.user.name
                )}
              </td>
              <td>
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={task.user.email}
                    onBlur={(e) =>
                      handleBlur(task.id, { user: { email: e.target.value } })
                    }
                  />
                ) : (
                  task.user.email
                )}
              </td>
              <td>
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={task.description}
                    onBlur={(e) =>
                      handleBlur(task.id, { description: e.target.value })
                    }
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {isAdmin ? (
                  <select
                    defaultValue={task.status}
                    onBlur={(e) =>
                      handleBlur(task.id, { status: e.target.value })
                    }
                  >
                    <option value="open">Open</option>
                    <option value="done">Done</option>
                    <option value="in progress">In Progress</option>
                  </select>
                ) : (
                  task.status
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="task-list-pagination">
        {Array.from(
          { length: Math.ceil(filteredTasks.length / tasksPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default TaskList;
