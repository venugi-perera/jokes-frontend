import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type Joke = {
  _id: string;
  content: string;
  type: string;
};

export default function Admin() {
  const [token, setToken] = useState("");
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [jokeTypes, setJokeTypes] = useState<string[]>([]);
  const [newJokeType, setNewJokeType] = useState("");
  const [editingJoke, setEditingJoke] = useState<Joke | null>(null);
  const [isLogin, setIsLogin] = useState(false);

  const login = async () => {
    try {
      // Simulate login success for demo purposes
      setToken("dummy-token");
      setIsLogin(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fetchJokes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3002/jokes/random", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJokes(response.data);
    } catch (error) {
      console.error("Error fetching jokes:", error);
    }
  }, [token]);

  const fetchJokeTypes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3002/jokes/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJokeTypes(response.data);
    } catch (error) {
      console.error("Error fetching joke types:", error);
    }
  }, [token]);

  const updateJoke = async (id: string, content: string, type: string) => {
    try {
      await axios.put(
        `http://localhost:3004/jokes/${id}`,
        { content, type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchJokes();
    } catch (error) {
      console.error("Error updating joke:", error);
    }
  };

  const addJokeType = async () => {
    if (!newJokeType.trim()) return;
    try {
      await axios.post(
        "http://localhost:3004/joke-types",
        { type: newJokeType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewJokeType("");
      fetchJokeTypes();
    } catch (error) {
      console.error("Error adding joke type:", error);
    }
  };

  const approveJoke = async (id: string) => {
    try {
      await axios.post(
        `http://localhost:3004/jokes/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchJokes();
      alert("Joke approved!");
    } catch (error) {
      console.error("Error approving joke:", error);
    }
  };

  const rejectJoke = async (id: string) => {
    try {
      await axios.post(
        `http://localhost:3004/jokes/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchJokes();
    } catch (error) {
      console.error("Error rejecting joke:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJokes();
      fetchJokeTypes();
    }
  }, [token, fetchJokes, fetchJokeTypes]);

  if (!isLogin) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Hello Admin</h1>
          <input type="email" style={styles.input} placeholder="Email" />
          <input type="password" style={styles.input} placeholder="Password" />
          <button style={styles.button} onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <h1 style={styles.header}>Jokes Management</h1>

      {/* <button style={styles.fetchButton} onClick={fetchJokes}>
        Fetch Jokes
      </button> */}

      <h2 style={styles.sectionHeader}>Jokes</h2>
      <ul style={styles.list}>
        {jokes.map((joke) => (
          <li key={joke._id} style={styles.listItem}>
            {editingJoke?._id === joke._id ? (
              <div>
                <input
                  type="text"
                  style={styles.input}
                  value={editingJoke.content}
                  onChange={(e) =>
                    setEditingJoke({ ...editingJoke, content: e.target.value })
                  }
                />
                <select
                  style={styles.select}
                  value={editingJoke.type}
                  onChange={(e) =>
                    setEditingJoke({ ...editingJoke, type: e.target.value })
                  }
                >
                  {jokeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  style={styles.button}
                  onClick={() => {
                    updateJoke(
                      editingJoke._id,
                      editingJoke.content,
                      editingJoke.type
                    );
                    setEditingJoke(null);
                  }}
                >
                  Save
                </button>
                <button
                  style={styles.buttonSecondary}
                  onClick={() => setEditingJoke(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={styles.jokeRow}>
                <span style={styles.jokeContent}>
                  {joke.content} - {joke.type}
                </span>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.button}
                    onClick={() => setEditingJoke(joke)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.approveButton}
                    onClick={() => approveJoke(joke._id)}
                  >
                    Approve
                  </button>
                  <button
                    style={styles.rejectButton}
                    onClick={() => rejectJoke(joke._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2 style={styles.sectionHeader}>Add New Joke Type</h2>
      <div>
        <input
          type="text"
          style={styles.input}
          value={newJokeType}
          onChange={(e) => setNewJokeType(e.target.value)}
          placeholder="New Joke Type"
        />
        <button style={styles.button} onClick={addJokeType}>
          Add Type
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  jokeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    borderBottom: "1px solid #ddd",
    marginBottom: "0.5rem",
  },
  jokeContent: {
    flex: "1",
    textAlign: "left",
    marginRight: "1rem",
    fontSize: "1rem",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end", // Align buttons to the right within their container
  },
  button: {
    padding: "0.3rem 1rem",
    backgroundColor: "#2196f3",
    color: "white",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  approveButton: {
    padding: "0.3rem 1rem",
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "0.3rem 1rem",
    backgroundColor: "#f44336",
    color: "white",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  input: {
    display: "block",
    width: "500px",
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.8rem",
  },
  buttonSecondary: {
    padding: "0.3rem 1rem",
    backgroundColor: "#f44336",
    color: "white",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "0.5rem",
  },
  fetchButton: {
    padding: "0.3rem 1rem",
    marginBottom: "1rem",
    backgroundColor: "#2196f3",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  mainContainer: {
    padding: "1rem",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "2rem",
    color: "#333",
    // marginBottom: "1rem",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    color: "#555",
    marginBottom: "0.75rem",
    borderBottom: "2px solid #ddd",
    paddingBottom: "0.25rem",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    margin: "1rem 0",
  },
  listItem: {
    // display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    borderBottom: "1px solid #ddd",
  },
  select: {
    padding: "0.5rem",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.8rem",
    width: "100%",
  },
};
