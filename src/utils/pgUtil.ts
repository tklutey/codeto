import _ from 'lodash';
import SbClient from 'server/client/SbClient';

type QueryJoinArg = {
  queryResult: any;
  joinKey: string;
};

export const join = (
  { queryResult: queryResult1, joinKey: query1JoinKey }: QueryJoinArg,
  { queryResult: queryResult2, joinKey: query2JoinKey }: QueryJoinArg,
  objectKey: string
) => {
  return queryResult1?.map((query1Element: any) => {
    const query2Match = queryResult2?.filter((query2Element: any) => {
      return _.get(query2Element, query2JoinKey) === _.get(query1Element, query1JoinKey);
    });
    return { ...query1Element, [objectKey]: query2Match };
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
