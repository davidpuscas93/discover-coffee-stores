import {
  coffeeStoresTable,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  const { id, name, image, address, locality, rating } = req.body;

  if (req.method === 'POST') {
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.status(200);
          res.json(records);
        } else {
          if (name) {
            const newRecord = await coffeeStoresTable.create([
              {
                fields: {
                  id,
                  name,
                  image,
                  address,
                  locality,
                  rating,
                },
              },
            ]);
            const record = getMinifiedRecords(newRecord);
            res.status(201);
            res.json(record);
          } else {
            res.status(400);
            res.json({
              message: 'The following field is missing: name.',
            });
          }
        }
      } else {
        res.status(400);
        res.json({
          message: 'The following field is missing: id.',
        });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: `Oops, something went wrong: ${error}` });
    }
  }
};

export default createCoffeeStore;
