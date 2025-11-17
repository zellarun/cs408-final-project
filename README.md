# Embroidery Job Tracker


## Project Spec

The Embroidery Job Tracker is a staff-facing web application designed to better manage custom embroidery jobs. Instead of tracking orders and job status through paper notes, spreadsheets, or emails, this website centralizes job information in a single, structured system.


The basic idea is to provide staff with a simple and effective way to add new custom embroidery jobs, view existing jobs, change the status of the job, filter jobs based on specific criteria, and delete jobs when they are finished or not needed.


This application will be built as a full-stack web app using HTML, CSS, and JavaScript on the front end, and AWS on the backend. All styling will be done with custom CSS.


## Theme

The overall theme of this project is a job management dashboard for an embroidery business. This is not a public-facing e-commerce storefront, but rather an internal tool used by staff to track custom embroiderer jobs/orders.


Each embroidery job will have important information such as:
- Customer name and contact info
- Garment details: type, size, color
- Quantity
- Logo or design
- Thread colors
- Job status: Pending, Digitizing, Stitching, Completed, Cancelled
- Time frame or due date
- Staff and customer notes
- Special instructions


## Functionality

The Embroidery Job Tracker will have:


   1. **Landing Page - Dashboard/Overview**
       - A simple introduction to the tool
       - Navigation to other pages such as: add job, view all jobs, filter/search jobs, about
       - Can display a summary of job analysis such as: total jobs, jobs in progress, jobs due this week
  
   2. **Add Job Page**
       - A form to allow staff to submit new embroidery jobs
       - The form field will include: customer name, customer contact info, garment details, quantity, logo/design, thread colors, status, due date, notes,
       - When the form is submitted it will send a POST request to an AWS endpoint by the Lambda function, which will insert the job into a DynamoDB table.
       - All form inputs will be validated and sanitized before being sent to the backend
  
   3. **View All Jobs Page**
       - An automatic load that retrieves all jobs from the database vis AWS and displays then in a card layout
       - Each job entry will display the key fields and include a delete option
       - Deleting an entry will call a DELETE endpoint that removes the job from DynamoDB
  
   4. **Filter/Search Jobs Page**
       - A PAge designed specifically to retrieve conditional data instead of the entire database
       - Filters such as: status, customer name, and due date range
       - This will use a form to capture filter input and then send that data to an AWS endpoint, which runs a filtered query on DynamoDB and returns only matching jobs


   5. **About/Help Page**
       - A simple static page that explains what the Embroidery Job Tracker is, who it is for, and basic usage instructions for staff
      


## Audience

The primary audience is shop staff at an embroidery business. Either front desk or customer service staff who creates new job entries when orders come in. Production staff that need to see the jobs and their current statuses. Also managers who want an overview of upcoming jobs, workload, and deadlines. This tool is specifically for staff members only.


## Data Model

The main data type managed by the application will be the Embroidery Job. This data will be dynamically generated based on user input from forms.


Each job stored will include fields such as:
- jobID
- customerName
- customerContact
- garmentDetails
- quantity
- logo
- threadColors
- status
- dueDate
- staffNotes
- customerNotes


## AWS Backend

The backend will be implemented using AWS services.


AWS Lambda functions will handle creating new jobs, retrieving all jobs, retrieving filtered jobs, and deleting jobs. Also all requests will validate and sanitize input before writing to the database.


## Testing and Accessibility

Front-end JavaScript will be tested with small unit tests. Will particularly focus on form validation, data formatting, and API interaction logic. All pages will be built to reach a perfect Lighthouse accessibility score: semantic HTML structure, proper labels, color contrast, keyboard navigation, and clear focus indicators.


## Stretch Goals

If the basic functionality if completed and stable, my stretch goals include:
   - Allowing staff to update the job statuses
   - Adding a job detail view page for a single job
   - Adding sorting options
   - Adding more statistics sections/page
   - A simple customer-facing request form that creates a job entry  with a default "New Request" status


## Project Wireframe

https://app.moqups.com/lalfv29nnAemdqsDaacd8fuqNLHccKA9/view/page/abc0e607a



