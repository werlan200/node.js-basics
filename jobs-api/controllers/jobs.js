const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const allJobs = await Job.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length });
};

const getSingleJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`could not find job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(newJob);
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;

  if (position === "" || company === "") {
    throw new BadRequestError("provide company or position");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError(`could not find job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const deletedJob = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!deletedJob) {
    throw new NotFoundError(`could not find job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ deletedJob });
};

module.exports = { getAllJobs, getSingleJob, createJob, updateJob, deleteJob };
