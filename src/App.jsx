import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://player-backend-1.onrender.com";

function App() {
  const [players, setPlayers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [player, setPlayer] = useState({
    playerName: "",
    age: "",
    phone: ""
  });

  function handleChange(e) {
    setPlayer({
      ...player,
      [e.target.name]: e.target.value
    });
  }

  function getPlayers() {
    fetch(`${BASE_URL}/players`)
      .then((response) => response.json())
      .then((data) => setPlayers(data));
  }

  function savePlayer(e) {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${BASE_URL}/players/${editingId}`
      : `${BASE_URL}/players`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(player)
    })
      .then((response) => response.json())
      .then(() => {
        alert(editingId ? "Player updated!" : "Player added!");

        setPlayer({
          playerName: "",
          age: "",
          phone: ""
        });

        setEditingId(null);
        getPlayers();
      });
  }

  function deletePlayer(id) {
    fetch(`${BASE_URL}/players/${id}`, {
      method: "DELETE"
    }).then(() => {
      alert("Player deleted!");
      getPlayers();
    });
  }

  useEffect(() => {
    getPlayers();
  }, []);

  const filteredPlayers = players.filter((p) =>
    p.playerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPlayers = players.length;
  const averageAge =
    players.length === 0
      ? 0
      : Math.round(
          players.reduce((sum, p) => sum + Number(p.age), 0) / players.length
        );

  const youngPlayers = players.filter((p) => Number(p.age) < 25).length;
  const seniorPlayers = players.filter((p) => Number(p.age) >= 25).length;

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="page">
        <div className="topbar">
          <h2>⚡ PlayerHub</h2>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="hero">
          <div>
            <p className="tag">Full Stack CRUD Project</p>
            <h1>Player Management Dashboard</h1>
            <p className="subtitle">
              React + Spring Boot deployed project 🚀
            </p>
          </div>

          <div className="graphic-card">
            <div className="circle">🏏</div>
            <h3>Players Hub</h3>
            <p>{players.length} total players</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h2>{totalPlayers}</h2>
            <p>Total Players</p>
          </div>

          <div className="stat-card">
            <h2>{filteredPlayers.length}</h2>
            <p>Search Results</p>
          </div>

          <div className="stat-card">
            <h2>{averageAge}</h2>
            <p>Average Age</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h2>Age Category Chart</h2>

            <div className="bar-row">
              <p>Below 25</p>
              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{
                    width:
                      totalPlayers === 0
                        ? "0%"
                        : `${(youngPlayers / totalPlayers) * 100}%`
                  }}
                ></div>
              </div>
              <span>{youngPlayers}</span>
            </div>

            <div className="bar-row">
              <p>25 & Above</p>
              <div className="bar-bg">
                <div
                  className="bar-fill second"
                  style={{
                    width:
                      totalPlayers === 0
                        ? "0%"
                        : `${(seniorPlayers / totalPlayers) * 100}%`
                  }}
                ></div>
              </div>
              <span>{seniorPlayers}</span>
            </div>
          </div>

          <div className="chart-card">
            <h2>Project Progress</h2>

            <div className="progress-circle">
              <div>
                <h3>100%</h3>
                <p>CRUD Done</p>
              </div>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="form-card">
            <h2>{editingId ? "Update Player" : "Add New Player"}</h2>

            {editingId && (
              <p className="edit-text">Editing Player ID: {editingId}</p>
            )}

            <form onSubmit={savePlayer}>
              <input
                type="text"
                name="playerName"
                placeholder="Player name"
                value={player.playerName}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={player.age}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={player.phone}
                onChange={handleChange}
                required
              />

              <button type="submit" className="primary-btn">
                {editingId ? "Update Player" : "Add Player"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingId(null);
                    setPlayer({
                      playerName: "",
                      age: "",
                      phone: ""
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h2>Players List</h2>

              <input
                className="search-box"
                type="text"
                placeholder="Search player..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Player</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="player-name">{p.playerName}</td>
                    <td>{p.age}</td>
                    <td>{p.phone}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setPlayer(p);
                          setEditingId(p.id);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deletePlayer(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty">
                      No players found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;