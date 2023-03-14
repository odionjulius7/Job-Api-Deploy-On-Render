const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

// get all jobs
const getAlljobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// get single job
const getJob = async (req, res) => {
  // destructure the user.userId(gotten frm token) and the params.id
  const {
    user: { userId },
    params: { id: jobId },
  } = req; // this is called nested destructuring

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }

  console.log(job);

  res.status(StatusCodes.OK).json({ job });
};

// create job
const createJob = async (req, res) => {
  // req.user is the user we created from the auth token in authentication middleware
  // get the user that created the job // note we just need make an update to the model createdBy
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

// update job
const updateJob = async (req, res) => {
  // nested destructuring
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError(`Company or Position field can not b empty`);
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }

  // console.log(job);
  res.status(StatusCodes.OK).json({ job });
};

// delete job
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }

  console.log(job);
  res.status(StatusCodes.OK).json({ msg: "deleted successfully" });
};

module.exports = { getAlljobs, getJob, createJob, updateJob, deleteJob };
