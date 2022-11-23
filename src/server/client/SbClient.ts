import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

  async getCodingProblemById(id: number) {
    let { data } = await this.supabaseClient
      .from('coding_problem')
      .select('*, basis_knowledge_state(id, standard_basis_relationship(*))')
      .eq('id', id);
    return data;
  }

  async getAllCodingProblems(userId: string) {
    let { data } = await this.supabaseClient
      .from('coding_problem')
      .select(
        '*, basis_knowledge_state(id, standard_basis_relationship(*)), user_problem_attempt_history(attempt_timestamp, is_successful_attempt)'
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

  async getLearningStandardRelationships() {
    const { data } = await this.supabaseClient.from('standard_relationship').select();
    return data;
  }

  async getAllLearningStandards() {
    const { data } = await this.supabaseClient.from('learning_standard').select();
    return data;
  }

  async getAllCourseUnits() {
    const { data } = await this.supabaseClient.from('learning_unit').select();
    return data;
  }

  async getTopicUnitRelationships() {
    const { data } = await this.supabaseClient.from('topic_unit_relationship').select();
    return data;
  }

  async updateCodingProblemAttemptHistory(problemId: number, userId: string, isCorrect: boolean) {
    const timestamp = new Date().toISOString();
    const { data } = await this.supabaseClient
      .from('user_problem_attempt_history')
      .insert({
        problem_id: problemId,
        user_id: userId,
        is_successful_attempt: isCorrect,
        attempt_timestamp: timestamp
      })
      .select();
    return data;
  }

  async getUserProblemAttemptHistory(userId: string) {
    const { data } = await this.supabaseClient.from('user_problem_attempt_history').select().eq('user_id', userId);
    return data;
  }

  async createCodingProblem(codingProblem: any) {
    const { count } = await this.supabaseClient.from('coding_problem').select('*', {
      count: 'exact',
      head: true
    });
    const id = count ? count + 1 : 9999999;
    const timestamp = new Date().toISOString();

    const { data, error } = await this.supabaseClient
      .from('coding_problem')
      .insert({ ...codingProblem, id, created_at: timestamp })
      .select();
    return { data, error };
  }
}
