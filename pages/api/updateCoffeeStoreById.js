import {
  findRecordByFilter,
  coffeeStoresTable,
  getMinifiedRecords,
} from '../../lib/airtable';

const updateCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  const { rating } = req.body;

  if (req.method === 'PUT') {
    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const updatedRecord = await coffeeStoresTable.update([
            {
              id: record.recordId,
              fields: {
                rating,
              },
            },
          ]);
          res.status(200);
          res.json(getMinifiedRecords(updatedRecord));
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
      res.json({ message: `Ooups, something went wrong: ${error}.` });
    }
  }
};

export default updateCoffeeStoreById;
