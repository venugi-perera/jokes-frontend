import axios from "axios";
import { useEffect, useState } from "react";
import Admin from "./admin";
import JokePage from "./joke";
import Submit from "./submit";

export default function Home() {
  const [joke, setJoke] = useState("");
  const [adminLogin, setAdminLogin] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [type, setType] = useState("");

  useEffect(() => {
    // Fetch joke types on component mount
    axios
      .get("http://localhost:3001/jokes/types")
      .then((response) => setTypes(response.data))
      .catch((error) => console.error("Error fetching joke types:", error));
  }, []);

  const fetchRandomJoke = () => {
    // Fetch a random joke based on the selected type
    axios
      .get(`http://localhost:3001/jokes/random/${type}`)
      .then((response) => {
        const jokes = response.data;
        setJoke(jokes.content);
      })
      .catch((error) => console.error("Error fetching random joke:", error));
  };

  return !adminLogin ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Side - Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRight: "1px solid #ddd",
        }}
      >
        <h1>Random Jokes</h1>
        <div
          style={{
            display: "flex",
            gap: "10px", // Space between buttons
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setAdminLogin(true)}
            style={{
              backgroundColor: "#007BFF",
              color: "#FFFFFF",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            Admin Login
          </button>
          {submit === true ? (
            <button
              onClick={() => setSubmit(false)}
              style={{
                backgroundColor: "#28A745",
                color: "#FFFFFF",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              View Joke
            </button>
          ) : (
            <button
              onClick={() => setSubmit(true)}
              style={{
                backgroundColor: "#FFC107",
                color: "#000000",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              Submit Joke
            </button>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          {submit === true ? (
            <Submit />
          ) : (
            <JokePage
              joke={joke}
              types={types}
              fetchRandomJoke={fetchRandomJoke}
              setType={setType}
              type={type}
            />
          )}
        </div>
      </div>

      {/* Right Side - Side Panel */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <h2>Welcome to the Joke Platform</h2>
        <p>Explore various types of jokes and have fun!</p>
        <img
          src="/main.png" // Ensure the image is in the public folder or adjust path accordingly
          alt="Joke Illustration"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </div>
  ) : (
    <div>
      <button
        style={{
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px",
        }}
        onClick={() => setAdminLogin(false)}
      >
        User Login
      </button>
      <Admin />
    </div>
  );
}
