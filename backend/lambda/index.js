// index.js - single Lambda handler for all embroidery-jobs routes

const AWS = require("aws-sdk");
const crypto = require("crypto");

const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "EmbroideryJobs";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
};


// create a new job  (PUT /embroidery-jobs)
async function createJob(event) {
  const body = JSON.parse(event.body || "{}");

  const jobId = crypto.randomUUID();
  const now = new Date().toISOString();

  const item = {
    jobId,            
    createdAt: now,
    status: body.status || "Pending",
    ...body,
  };

  await ddb
    .put({
      TableName: TABLE_NAME,
      Item: item,
    })
    .promise();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(item),
  };
}

// list jobs (GET /embroidery-jobs) with optional filters
async function listJobs(event) {
  const qs = event.queryStringParameters || {};
  const status = qs.status || null;       
  const daysAhead = qs.daysAhead || null; 

  const params = {
    TableName: TABLE_NAME,
  };

  const filterPieces = [];
  const exprNames = {};
  const exprValues = {};

  if (status) {
    filterPieces.push("#s = :status");
    exprNames["#s"] = "status";
    exprValues[":status"] = status;
  }

  if (daysAhead) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + Number(daysAhead));

    const todayStr = today.toISOString().slice(0, 10);   // YYYY-MM-DD
    const futureStr = future.toISOString().slice(0, 10); // YYYY-MM-DD

    filterPieces.push("#d BETWEEN :today AND :future");
    exprNames["#d"] = "dueDate";
    exprValues[":today"] = todayStr;
    exprValues[":future"] = futureStr;
  }

  if (filterPieces.length > 0) {
    params.FilterExpression = filterPieces.join(" AND ");
    params.ExpressionAttributeNames = exprNames;
    params.ExpressionAttributeValues = exprValues;
  }

  const result = await ddb.scan(params).promise();
  const items = result.Items || [];


  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(items),
  };
}

// get one job (GET /embroidery-jobs/{jobID})
async function getJob(event) {
  const jobIdFromPath =
    event.pathParameters?.jobID ||
    event.pathParameters?.id ||
    event.pathParameters?.jobId;

  if (!jobIdFromPath) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "jobID path parameter required" }),
    };
  }

  const result = await ddb
    .get({
      TableName: TABLE_NAME,
      Key: { jobId: jobIdFromPath }, // Dynamo key is jobId
    })
    .promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Job not found" }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Item),
  };
}

// delete job (DELETE /embroidery-jobs/{jobID})
async function deleteJob(event) {
  const jobIdFromPath =
    event.pathParameters?.jobID ||
    event.pathParameters?.id ||
    event.pathParameters?.jobId;

  if (!jobIdFromPath) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "jobID path parameter required" }),
    };
  }

  await ddb
    .delete({
      TableName: TABLE_NAME,
      Key: { jobId: jobIdFromPath },
    })
    .promise();

  return {
    statusCode: 204,
    headers,
    body: "",
  };
}

// update status (not wired to a specific route yet, but ready)
async function updateJobStatus(event) {
  const body = JSON.parse(event.body || "{}");

  const jobId =
    (event.pathParameters && (event.pathParameters.jobID || event.pathParameters.id)) ||
    body.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "jobId is required" }),
    };
  }

  const newStatus = body.status;
  if (!newStatus) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "status is required" }),
    };
  }

  const result = await ddb
    .update({
      TableName: TABLE_NAME,
      Key: { jobId },
      UpdateExpression: "SET #s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":status": newStatus },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes),
  };
}


exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.rawPath || event.path || "";

  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Base route: /embroidery-jobs
    if (path === "/embroidery-jobs") {
      if (method === "PUT") {
        return await createJob(event);
      }
      if (method === "GET") {
        return await listJobs(event);
      }
    }

    // Routes with an ID: /embroidery-jobs/{jobID}
    if (path.startsWith("/embroidery-jobs/")) {
      
      const parts = path.split("/");
      const jobID = parts[2];
      event.pathParameters = event.pathParameters || {};
      if (!event.pathParameters.jobID) {
        event.pathParameters.jobID = jobID;
      }

      if (method === "GET") {
        return await getJob(event);
      }
      if (method === "DELETE") {
        return await deleteJob(event);
      }
      
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Route not found", method, path }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
