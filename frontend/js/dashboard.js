// frontend/js/dashboard.js

document.addEventListener("DOMContentLoaded", async () => {

  const totalEl = document.getElementById("total-jobs-count");
  const inProgressEl = document.getElementById("in-progress-count");
  const completedEl = document.getElementById("completed-count");
  const dueSoonEl = document.getElementById("due-soon-count");

  try {
    const allJobs = await apiGetJobs();
    const dueSoon = await apiGetJobs({ daysAhead: 7 });

    if (totalEl) totalEl.textContent = allJobs.length;

    const inProgress = allJobs.filter((j) => j.status === "In Progress").length;
    const completed = allJobs.filter((j) => j.status === "Completed").length;

    if (inProgressEl) inProgressEl.textContent = inProgress;
    if (completedEl) completedEl.textContent = completed;
    if (dueSoonEl) dueSoonEl.textContent = dueSoon.length;
  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
});
