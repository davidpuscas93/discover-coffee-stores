const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_KEY);

const coffeeStoresTable = base('coffee-stores');

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const foundRecords = await coffeeStoresTable
    .select({ filterByFormula: `id="${id}"` })
    .firstPage();

  return getMinifiedRecords(foundRecords);
};

export { coffeeStoresTable, getMinifiedRecords, findRecordByFilter };
