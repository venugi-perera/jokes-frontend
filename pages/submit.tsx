import axios from "axios";
import { useEffect, useState } from "react";

type FormData = {
  content: string;
  type: string;
};

export default function Submit() {
  const [formData, setFormData] = useState<FormData>({ content: "", type: "" });
  const [types, setTypes] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post("http://localhost:3002/jokes", formData);
    alert("Joke submitted!");
    setFormData({ content: "", type: "" });
  };

  useEffect(() => {
    axios
      .get<string[]>("http://localhost:3001/jokes/types")
      .then((response) => setTypes(response.data))
      .catch((error) => console.error("Error fetching types:", error));
  }, []);

  return (
    <div>
      {/* <h1>Submit Joke</h1> */}
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="type"
          style={{ marginBottom: "10px", display: "block", fontSize: "20px" }}
        >
          Select Joke Type
        </label>

        <select
          id="type"
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        >
          <option value="">Select Type</option>
          {types.map((type: any) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <textarea
          style={{ width: "95%", padding: "10px", marginBottom: "20px" }}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter your joke"
          required
        />

        {/* <select
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select> */}

        {/* <input
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="Enter type"
          required
        /> */}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
