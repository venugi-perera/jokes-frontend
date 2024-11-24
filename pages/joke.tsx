const JokePage = ({ setType, joke, types, fetchRandomJoke, type }: any) => {
  console.log(joke);

  return (
    <>
      <label
        htmlFor="type"
        style={{ marginBottom: "10px", display: "block", fontSize: "20px" }}
      >
        Select Joke Type
      </label>
      <select
        id="type"
        onChange={(e) => setType(e.target.value)}
        value={type}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      >
        <option value="">Select Type</option>
        {types.map((type: any) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button
        onClick={fetchRandomJoke}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Get Joke
      </button>
      <p style={{ marginTop: "20px" }}>{joke}</p>
    </>
  );
};

export default JokePage;
