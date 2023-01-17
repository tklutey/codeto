import SbClient from 'server/client/SbClient';

export const generateIdAndTimestamp = async (tableName: string) => {
  const sbClient = new SbClient();
  const maxId = await sbClient.getMaxId(tableName);
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    id: maxId + 1
  };
};
