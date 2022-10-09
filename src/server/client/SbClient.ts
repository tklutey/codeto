import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { definitions } from 'types/supabase';

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
    let { data: x, error } = await this.supabaseClient.rpc<definitions['decorated_denormalized_standards']>('get_standards');
    return x;
  }

  async getCodingProblem() {
    let { data: x, error } = await this.supabaseClient.rpc<definitions['coding_problem']>('get_coding_problem');
    return x;
  }

  async getFringeStandards(arr: number[]) {
    let { data: x, error } = await this.supabaseClient.rpc<definitions['learning_standard']>('get_fringe_standards', { _arr: arr });
    return x;
  }
}
