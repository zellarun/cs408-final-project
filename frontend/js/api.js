
const API_BASE = "https://p8aejde0rj.execute-api.us-east-2.amazonaws.com";

// Create a new job (called from add-job.js)
async function apiCreateJob(jobData) {
  const res = await fetch(`${API_BASE}/embroidery-jobs`, {
    method: "PUT", // matches your route for create
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    console.error("Create job failed:", res.status, await res.text());
    throw new Error("Failed to create job");
  }

  return res.json();
}

// Get all jobs (for view-jobs + dashboard)
async function apiGetJobs(query = {}) {
  const params = new URLSearchParams(query);
  const url =
    Object.keys(query).length === 0
      ? `${API_BASE}/embroidery-jobs`
      : `${API_BASE}/embroidery-jobs?` + params.toString();

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Get jobs failed:", res.status, await res.text());
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

// Get a single job by ID (if you need it later)
async function apiGetJob(jobId) {
  const res = await fetch(`${API_BASE}/embroidery-jobs/${jobId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch job");
  }
  return res.json();
}

// Delete a job (if you want a delete button)
async function apiDeleteJob(jobId) {
  const res = await fetch(`${API_BASE}/embroidery-jobs/${jobId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new Error("Failed to delete job");
  }
}
