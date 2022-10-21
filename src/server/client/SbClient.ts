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
}
