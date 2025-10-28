import { createClient } from '@supabase/supabase-js';
import type { IStorage } from "./storage";
import type {
  User,
  InsertUser,
  Transaction,
  InsertTransaction,
  Goal,
  InsertGoal,
  AiMessage,
  InsertAiMessage
} from "@shared/schema";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      createdAt: new Date(data.created_at)
    } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: '37f30cf0-ead3-49fb-af66-40450d54e0e8',
        ...insertUser
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at)
    } as User;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      createdAt: new Date(data.created_at)
    } as User;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data.map(t => ({
      ...t,
      userId: t.user_id,
      createdAt: new Date(t.created_at)
    })) as Transaction[];
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Transaction;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaction.userId,
        amount: transaction.amount,
        label: transaction.label,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Transaction;
  }

  async updateTransaction(id: string, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const updateData: any = {};
    if (transactionData.amount !== undefined) updateData.amount = transactionData.amount;
    if (transactionData.label !== undefined) updateData.label = transactionData.label;
    if (transactionData.category !== undefined) updateData.category = transactionData.category;
    if (transactionData.type !== undefined) updateData.type = transactionData.type;
    if (transactionData.date !== undefined) updateData.date = transactionData.date;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Transaction;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(g => ({
      ...g,
      userId: g.user_id,
      createdAt: new Date(g.created_at)
    })) as Goal[];
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Goal;
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: goal.userId,
        name: goal.name,
        target: goal.target,
        current: goal.current || '0',
        color: goal.color || '#007aff'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Goal;
  }

  async updateGoal(id: string, goalData: Partial<InsertGoal>): Promise<Goal | undefined> {
    const updateData: any = {};
    if (goalData.name !== undefined) updateData.name = goalData.name;
    if (goalData.target !== undefined) updateData.target = goalData.target;
    if (goalData.current !== undefined) updateData.current = goalData.current;
    if (goalData.color !== undefined) updateData.color = goalData.color;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as Goal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async getAiMessages(userId: string): Promise<AiMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(m => ({
      ...m,
      userId: m.user_id,
      createdAt: new Date(m.created_at)
    })) as AiMessage[];
  }

  async createAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const { data, error } = await supabase
      .from('ai_messages')
      .insert({
        user_id: message.userId,
        role: message.role,
        content: message.content
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      userId: data.user_id,
      createdAt: new Date(data.created_at)
    } as AiMessage;
  }

  async clearAiMessages(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('ai_messages')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

export const storage = new SupabaseStorage();
