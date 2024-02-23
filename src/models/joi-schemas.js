import Joi from "joi";

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const BusinessSpec = {
  title: Joi.string().required(),
  category: Joi.string().required(),
};

export const LocationSpec = {
  title: Joi.string().required(),
};