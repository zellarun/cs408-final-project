// frontend/js/add-job.js

document.addEventListener("DOMContentLoaded", () => {
  // Update this ID to match your actual form's id
  const form = document.getElementById("add-job-form");

  if (!form) {
    console.error("add-job-form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const jobData = Object.fromEntries(formData.entries());

    try {
      const created = await apiCreateJob(jobData);
      console.log("Created job:", created);

      // Show success & go to View Jobs
      alert("Job created successfully!");
      window.location.href = "view-jobs.html";
    } catch (err) {
      console.error(err);
      alert("There was a problem creating the job. Please try again.");
    }
  });
});
