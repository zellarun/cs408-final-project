// frontend/js/view-jobs.js

document.addEventListener("DOMContentLoaded", async () => {
  // Update this selector to match your table body
  const tbody = document.querySelector("#jobs-table-body");

  if (!tbody) {
    console.error("No tbody with id jobs-table-body found");
    return;
  }

  try {
    const jobs = await apiGetJobs(); // all jobs
    console.log("Loaded jobs:", jobs);

    tbody.innerHTML = "";

    if (jobs.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.textContent = "No jobs yet.";
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    jobs.forEach((job) => {
      const row = document.createElement("tr");

      const cells = [
        job.jobId || job.jobID,
        job.customerName || "",
        job.school || "",
        job.dueDate || "",
        job.status || "",
        job.createdAt ? job.createdAt.slice(0, 10) : "",
      ];

      cells.forEach((text) => {
        const td = document.createElement("td");
        td.textContent = text;
        row.appendChild(td);
      });

      // Optional: delete button
      const actionsTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete this job?")) return;
        await apiDeleteJob(job.jobId || job.jobID);
        row.remove();
      });
      actionsTd.appendChild(deleteBtn);
      row.appendChild(actionsTd);

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Error loading jobs from server.");
  }
});
