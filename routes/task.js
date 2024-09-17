const Utils = require("../utils");
const { Task, validate, validateAdd } = require("../models/task");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const websocket = require("../wsserver");

const buildQuery = (queryParams) => {
  const filter = {};

  // Filter by task_status
  if (queryParams.status) {
    filter.task_status = queryParams.status;
  }

  // Filter by due_date range
  if (queryParams.due_date_from || queryParams.due_date_to) {
    filter.due_date = {};
    if (queryParams.due_date_from) {
      filter.due_date.$gte = new Date(queryParams.due_date_from);
    }
    if (queryParams.due_date_to) {
      filter.due_date.$lte = new Date(queryParams.due_date_to);
    }
  }

  return filter;
};

router.get("/", async (req, res) => {
  try {
    // Extract query parameters
    const { sort, status, due_date_from, due_date_to } = req.query;

    //Utils.log(req.query);

    // Determine sort field and order
    let sort_by = "";
    let sort_order = "";

    if (sort && sort.includes("status")) sort_by = "task_status";
    else sort_by = "due_date";

    if (sort && sort.includes("_desc")) sort_order = "desc";
    else sort_order = "asc";

    // Build query filter
    const queryFilter = buildQuery({ status, due_date_from, due_date_to });

    // Fetch tasks from the database with filters and sorting
    const tasks = await Task.find(queryFilter).sort({
      [sort_by]: sort_order,
    });

    websocket.broadcast(tasks);

    res.send(tasks);
  } catch (err) {
    Utils.log(err);
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateAdd(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let task = new Task({
    name: req.body.name,
    desp: req.body.desp,
    due_date: req.body.due_date,
    task_status: "Not Started",
  });
  task = await task.save();

  res.send(task);
});

router.put("/:id", async (req, res) => {
  if (!Utils.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid id");
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      desp: req.body.desp,
      due_date: req.body.due_date,
      task_status: req.body.task_status,
      updated_at: Utils.getCurrentDateTime(),
    },
    { new: true }
  );

  if (!task)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(task);
});

router.delete("/:id", async (req, res) => {
  if (!Utils.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid id");
  }

  const task = await Task.findOneAndDelete(req.params.id);

  if (!task)
    return res.status(404).send("The Task with the given ID was not found.");

  res.send(task);
});

// router.get("/:id", async (req, res) => {
//   const customer = await Customer.findById(req.params.id);

//   if (!customer)
//     return res
//       .status(404)
//       .send("The customer with the given ID was not found.");

//   res.send(customer);
// });

module.exports = router;
