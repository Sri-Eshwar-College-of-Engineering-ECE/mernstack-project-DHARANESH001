import { useState, useEffect } from "react";

function SkillTracker() {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("https://skilltracker-1h58.onrender.com/skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim() || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://skilltracker-1h58.onrender.com/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill, level: 1, startDate, endDate }),
      });

      if (response.ok) {
        fetchSkills();
        setNewSkill("");
        setStartDate("");
        setEndDate("");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const increaseLevel = async (id) => {
    try {
      const response = await fetch(`https://skilltracker-1h58.onrender.com/skills/${id}/increase`, { method: "PUT" });
      if (response.ok) fetchSkills();
      else alert("Level is already at the maximum value.");
    } catch (error) {
      console.error("Error increasing level:", error);
    }
  };

  const decreaseLevel = async (id) => {
    try {
      const response = await fetch(`https://skilltracker-1h58.onrender.com/skills/${id}/decrease`, { method: "PUT" });
      if (response.ok) fetchSkills();
      else alert("Level cannot go below 1.");
    } catch (error) {
      console.error("Error decreasing level:", error);
    }
  };

  const removeSkill = async (id) => {
    try {
      await fetch(`https://skilltracker-1h58.onrender.com/skills/${id}`, { method: "DELETE" });
      fetchSkills();
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };

  const uploadCertificate = async (id) => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("certificate", selectedFile);

    try {
      const response = await fetch(`https://skilltracker-1h58.onrender.com/skills/${id}/certificate`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Certificate uploaded successfully!");
        setSelectedFile(null);
        fetchSkills();
      } else {
        alert("Error uploading certificate.");
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
    }
  };

  return (
    <div className="container">
      <h1>Skill Tracker</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search skills..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="add-skill-form">
        <input type="text" placeholder="Skill name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={addSkill}>Add Skill</button>
      </div>
      <div className="skill-list">
        {skills
          .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((skill) => (
            <div key={skill._id} className="skill-card">
              <h2>{skill.name}</h2>
              <p>Level: {skill.level}</p>
              <button onClick={() => increaseLevel(skill._id)} disabled={skill.level >= 8}>
                Improve
              </button>
              <button onClick={() => decreaseLevel(skill._id)} disabled={skill.level <= 1}>
                Decline
              </button>
              <button onClick={() => removeSkill(skill._id)}>Remove</button>
              {skill.level >= 8 && (
                <>
                  <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <button onClick={() => uploadCertificate(skill._id)}>Upload Certificate</button>
                </>
              )}
              {skill.certificate && (
                <p>
                  <a href={`https://skilltracker-1h58.onrender.com/${skill.certificate}`} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default SkillTracker;
