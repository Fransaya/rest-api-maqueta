import { ObjectId } from 'mongodb';

const createObjectId = (id) => {
  return ObjectId.createFromHexString(id);
};

export default createObjectId;
