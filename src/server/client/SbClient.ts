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

  async getAllCodingProblems() {
    let { data } = await this.supabaseClient.from('coding_problem').select('*, basis_knowledge_state(id, standard_basis_relationship(*))');
    return data;
  }

  async getFringeStandards(arr: number[]) {
    let { data: x } = await this.supabaseClient.rpc('get_fringe_standards', { _arr: arr });
    return x;
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
}
