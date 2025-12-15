async function fetchJob(jobID) {
  const res = await fetch(`${API_BASE}/embroidery-jobs/${jobID}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

async function deleteJob(jobID) {
  const res = await fetch(`${API_BASE}/embroidery-jobs/${jobID}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new Error("Failed to delete job");
  }
}
