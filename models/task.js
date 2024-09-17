const Joi = require("joi");
const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    // user: {
    //   type: new mongoose.Schema({
    //     name: {
    //       type: String,
    //       //required: true,
    //       minlength: 5,
    //       maxlength: 50,
    //     },
    //   }),
    //   required: true,
    // },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    desp: {
      type: String,
      maxlength: 200,
    },
    due_date: {
      type: Date,
      //required: true,
    },
    task_status: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  })
);

function validateAddTask(task) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    desp: Joi.string().allow("", null),
    task_status: Joi.string().allow("", null),
    due_date: Joi.date().iso().messages({
      //   "date.base": "Date of birth must be a valid date",
      //   "date.isoDate": "Date of birth must be in ISO format (YYYY-MM-DD)",
      //   "date.less": "Date of birth must be in the past",
      "any.required": "Due date is required",
    }),
  });

  return schema.validate(task);
}

function validateTask(task) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    desp: Joi.string().allow("", null),
    task_status: Joi.string(),
    due_date: Joi.date().iso().messages({
      //   "date.base": "Date of birth must be a valid date",
      //   "date.isoDate": "Date of birth must be in ISO format (YYYY-MM-DD)",
      //   "date.less": "Date of birth must be in the past",
      "any.required": "Due date is required",
    }),
  });

  return schema.validate(task);
}

exports.Task = Task;
exports.validateAdd = validateAddTask;
exports.validate = validateTask;
