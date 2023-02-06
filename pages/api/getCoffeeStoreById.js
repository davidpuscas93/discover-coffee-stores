import { findRecordByFilter } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.status(200);
        res.json(records);
      } else {
        res.status(400);
        res.json({ message: `Could not find record with id: ${id}.` });
      }
    } else {
      res.status(400);
      res.json({ message: 'The following field is missing: id.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: `Something went wrong: ${error}` });
  }
};

export default getCoffeeStoreById;
