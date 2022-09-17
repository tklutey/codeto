import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { definitions } from 'types/subabase';

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

  async get_learning_units() {
    let { data: learning_unit, error } = await this.supabaseClient.from<definitions['learning_unit']>('learning_unit').select('unit_name');
    return learning_unit;
  }
}
