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

  async getKnowledgeState() {
    let { data: x } = await this.supabaseClient.rpc('get_standards');
    return x;
  }

  async getCodingProblemById(id: number) {
    let { data: x } = await this.supabaseClient.rpc('get_coding_problem_by_id', { id: id });
    return x;
  }

  async getFringeStandards(arr: number[]) {
    let { data: x } = await this.supabaseClient.rpc('get_fringe_standards', { _arr: arr });
    return x;
  }

  async getCodingProblemsWithStandards() {
    let { data: x } = await this.supabaseClient.rpc('get_coding_problems_standards');
    return x;
  }

  async getMasteredStandardsForUser(userUuid: string) {
    const { data: masteredStandards } = await this.supabaseClient
      .from('user_learning_standard_relationship')
      .select()
      .eq('user_id', userUuid);
    return masteredStandards;
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

  async getTopicUnitRelationships() {
    const { data } = await this.supabaseClient.from('topic_unit_relationship').select();
    return data;
  }
}
