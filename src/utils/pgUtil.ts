import SbClient from 'server/client/SbClient';

type QueryJoinArg = {
  queryResult: any;
  joinKey: string;
};

export const join = (
  { queryResult: queryResult1, joinKey: query1JoinKey }: QueryJoinArg,
  { queryResult: queryResult2, joinKey: query2JoinKey }: QueryJoinArg
) => {
  return queryResult1?.map((query1Element: any) => {
    const query2Match = queryResult2?.find((query2Element: any) => query2Element[query2JoinKey] === query1Element[query1JoinKey]);
    return { ...query1Element, ...query2Match };
  });
};

export const generateIdAndTimestamp = async (tableName: string) => {
  const sbClient = new SbClient();
  const maxId = await sbClient.getMaxId(tableName);
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    id: maxId + 1
  };
};
