import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateIdAndTimestamp, join } from 'utils/pgUtil';
import { ProblemAttemptStatus } from 'server/types';

export default class SbClient {
  private supabaseClient: SupabaseClient;

  constructor() {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;
    if (SUPABASE_URL && SUPABASE_KEY) {
      this.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      throw new Error('Missing Supabase URL or key');
    }
  }

  _getTableName(tableName: string) {
    // create a new set with 2 elements
    const hasBetaTable = new Set(['coding_problem', 'coding_problem_tests', 'problem_standard_relationship']);
    const env = process.env.NODE_ENV;
    if (env === 'development' && hasBetaTable.has(tableName)) {
      return `beta:${tableName}`;
    }
    return tableName;
  }

  async getCodingProblemById(id: number) {
    let { data } = await this.supabaseClient
      .from('coding_problem')
      .select('*, coding_problem_tests(test_type, source_type, test_message, test_code)')
      .eq('id', id);
    return data;
  }

  async getAllCodingProblems(userId: string) {
    let { data } = await this.supabaseClient
      .from('coding_problem')
      .select(
        '*, problem_standard_relationship(learning_standard(id, code, description)), user_problem_attempt_history(attempt_timestamp, is_successful_attempt, attempt_status), coding_problem_tests(test_type, source_type, test_message, test_code)'
      )
      .eq('user_problem_attempt_history.user_id', userId);
    return data;
  }

  async getMasteredStandardsForUser(userUuid: string) {
    const { data: masteredStandards } = await this.supabaseClient
      .from('user_learning_standard_relationship')
      .select()
      .eq('user_id', userUuid);
    return masteredStandards;
  }

  async deleteUserMasteredStandards(userUuid: string) {
    const { data } = await this.supabaseClient.from('user_learning_standard_relationship').delete().eq('user_id', userUuid);
    return data;
  }

  async deleteUserProblemAttemptHistory(userId: string) {
    const { data } = await this.supabaseClient.from('user_problem_attempt_history').delete().eq('user_id', userId);
    return data;
  }

  async updateUserKnowledgeState(newLearningStandards: number[], userUuid: string) {
    const masteredStandards = await this.getMasteredStandardsForUser(userUuid);
    const existingLearningStandardsSet = new Set(masteredStandards?.map((x) => x.learning_standard_id));
    const insertRecords = newLearningStandards
      .map((id) => {
        if (!existingLearningStandardsSet.has(id)) {
          return {
            user_id: userUuid,
            learning_standard_id: id
          };
        }
      })
      .filter((x) => x);

    if (insertRecords.length > 0) {
      return this.supabaseClient.from('user_learning_standard_relationship').upsert(insertRecords).select();
    }
    return 'No new records to insert';
  }

  async getLearningStandards() {
    const { data: standard_objective } = await this.supabaseClient
      .from('standard_relationship')
      .select('objective:parent_id(*), standard:child_id!inner(*)')
      .eq('standard.type', 'standard');

    const { data: standard_dependencies } = await this.supabaseClient.from('standard_dependencies').select();

    const standardObjectivesWithDeps = join(
      { queryResult: standard_objective, joinKey: 'standard.id' },
      {
        queryResult: standard_dependencies,
        joinKey: 'standard_id'
      },
      'dependencies'
    );

    const formattedStandardObjectivesWithDeps = standardObjectivesWithDeps.map((x: any) => {
      const { dependencies, standard, objective } = x;
      const formattedDependencies = dependencies.map((y: any) => y.dependent_standard);

      const standardWithDependencies = { ...standard, dependencies: formattedDependencies };
      return { standard: standardWithDependencies, objective };
    });

    const { data: objective_topic } = await this.supabaseClient
      .from('standard_relationship')
      .select('topic:parent_id(*, topic_unit_relationship(learning_unit(*))), objective:child_id!inner(*)')
      .eq('objective.type', 'objective');

    const fullStandardsJoin = join(
      { queryResult: formattedStandardObjectivesWithDeps, joinKey: 'objective.id' },
      {
        queryResult: objective_topic,
        joinKey: 'objective.id'
      },
      'topic_objective'
    ).map((x: any) => {
      const { topic_unit_relationship, ...topic } = x.topic_objective[0].topic;
      return {
        standard: x.standard,
        objective: x.objective,
        topic: topic,
        unit: topic_unit_relationship[0].learning_unit
      };
    });
    return fullStandardsJoin;
  }

  async updateCodingProblemAttemptHistory(problemId: number, userId: string, problemAttemptStatus: string) {
    const timestamp = new Date().toISOString();
    const { data } = await this.supabaseClient
      .from('user_problem_attempt_history')
      .insert({
        problem_id: problemId,
        user_id: userId,
        is_successful_attempt: problemAttemptStatus === ProblemAttemptStatus.Correct,
        attempt_timestamp: timestamp,
        attempt_status: problemAttemptStatus
      })
      .select();
    return data;
  }

  async getUserProblemAttemptHistory(userId: string) {
    const { data } = await this.supabaseClient.from('user_problem_attempt_history').select().eq('user_id', userId);
    return data;
  }

  async createCodingProblem(codingProblem: any, dependentStandards: number[]) {
    const { timestamp, id: problemId } = await generateIdAndTimestamp(this._getTableName('coding_problem'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tests, ...problem } = codingProblem;

    const { data, error } = await this.supabaseClient
      .from(this._getTableName('coding_problem'))
      .insert({ ...problem, id: problemId, created_at: timestamp })
      .select();
    if (!error) {
      const dependentStandardRecords = dependentStandards.map((standard) => {
        return {
          problem_id: problemId,
          standard_id: standard
        };
      });
      const { error: error2 } = await this.supabaseClient
        .from(this._getTableName('problem_standard_relationship'))
        .insert(dependentStandardRecords)
        .select();
      if (error2) {
        throw new Error(error2.message);
      }
      const createCodingProblemTestRecord = async (test: any, sourceType: string, problemTestId: number) => {
        return {
          id: problemTestId,
          created_at: timestamp,
          coding_problem_id: problemId,
          test_type: test.type,
          source_type: sourceType,
          test_message: test.message,
          test_code: test.testCode
        };
      };
      let { id: problemTestId } = await generateIdAndTimestamp(this._getTableName('coding_problem_tests'));
      const codingProblemTestRecords = [];
      for (const test of codingProblem.tests.expectedSourceCode) {
        if (test.message) {
          const newRecord = await createCodingProblemTestRecord(test, 'stdin', problemTestId++);
          codingProblemTestRecords.push(newRecord);
        }
      }
      for (const test of codingProblem.tests.expectedOutput) {
        if (test.message) {
          const newRecord = await createCodingProblemTestRecord(test, 'stdout', problemTestId++);
          codingProblemTestRecords.push(newRecord);
        }
      }
      const { error: error3 } = await this.supabaseClient
        .from(this._getTableName('coding_problem_tests'))
        .insert(codingProblemTestRecords)
        .select();
      if (error3) {
        throw new Error(error3.message);
      }
    }
    return { data, error };
  }

  async createStandard(learningStandard: any, parentStandard: number, dependentStandards: number[]) {
    const { timestamp, id } = await generateIdAndTimestamp('learning_standard');
    const { data, error } = await this.supabaseClient
      .from('learning_standard')
      .insert({
        ...learningStandard,
        id,
        created_at: timestamp
      })
      .select();
    if (!error) {
      const { error: error2 } = await this.supabaseClient
        .from('standard_relationship')
        .insert({
          parent_id: parentStandard,
          child_id: id,
          created_at: timestamp
        })
        .select();
      if (error2) {
        throw new Error(error2.message);
      }
      if (!error2) {
        const records = dependentStandards.map((dependentStandard) => {
          return {
            standard_id: id,
            dependent_standard: dependentStandard
          };
        });
        const { error: error3 } = await this.supabaseClient.from('standard_dependencies').insert(records).select();
        if (error3) {
          throw new Error(error3.message);
        }
      }
    }

    return { data, error };
  }

  async getMaxId(tableName: string) {
    const { data } = await this.supabaseClient.from(tableName).select('id').order('id', { ascending: false }).limit(1);
    return data && data.length > 0 ? data[0].id : 0;
  }

  async getLearningStandardByType(type: string) {
    const { data } = await this.supabaseClient.from('learning_standard').select().eq('type', type);
    return data;
  }
}
