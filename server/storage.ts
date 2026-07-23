import { 
  users, members, events, services, donations, ministries, ministryMembers, welfareCases, evangelismRecords,
  notificationTemplates, notificationLog, bankAccounts,
  type User, type InsertUser, type Member, type InsertMember, type Event, type InsertEvent,
  type Service, type InsertService, type Donation, type InsertDonation,
  type Ministry, type InsertMinistry, type MinistryMember, type InsertMinistryMember,
  type WelfareCase, type InsertWelfareCase, type EvangelismRecord, type InsertEvangelismRecord,
  type NotificationTemplate, type InsertNotificationTemplate,
  type NotificationLog, type InsertNotificationLog,
  type BankAccount, type InsertBankAccount,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;

  // Members
  getMembers(params?: { search?: string, status?: string }): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: number): Promise<void>;

  // Events
  getEvents(params?: { start?: Date, end?: Date }): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  // Donations
  getDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationsTotal(period: 'month' | 'year'): Promise<number>;

  // Ministries
  getMinistries(): Promise<Ministry[]>;
  getMinistry(id: number): Promise<Ministry | undefined>;
  createMinistry(ministry: InsertMinistry): Promise<Ministry>;
  getMinistryMembers(ministryId: number): Promise<(MinistryMember & { member: Member })[]>;
  addMinistryMember(data: InsertMinistryMember): Promise<MinistryMember>;

  // Welfare
  getWelfareCases(): Promise<WelfareCase[]>;
  createWelfareCase(data: InsertWelfareCase): Promise<WelfareCase>;
  updateWelfareCase(id: number, data: Partial<InsertWelfareCase>): Promise<WelfareCase>;

  // Evangelism
  getEvangelismRecords(): Promise<EvangelismRecord[]>;
  createEvangelismRecord(data: InsertEvangelismRecord): Promise<EvangelismRecord>;
  updateEvangelismRecord(id: number, data: Partial<InsertEvangelismRecord>): Promise<EvangelismRecord>;

  // Stats
  getDashboardStats(): Promise<{
    memberCount: number;
    attendanceTrend: number;
    donationsThisMonth: number;
    upcomingEvents: number;
    newConverts: number;
  }>;

  // Analytics
  getAnalytics(): Promise<{
    members: { total: number; active: number; inactive: number };
    donations: { total: number; count: number; average: number; monthly: { month: string; total: number; count: number }[] };
    events: { monthly: { month: string; count: number }[] };
    membersGrowth: { month: string; count: number }[];
  }>;

  // Notification Templates
  getNotificationTemplates(): Promise<NotificationTemplate[]>;
  createNotificationTemplate(data: InsertNotificationTemplate): Promise<NotificationTemplate>;
  updateNotificationTemplate(id: number, data: Partial<InsertNotificationTemplate>): Promise<NotificationTemplate>;
  deleteNotificationTemplate(id: number): Promise<void>;

  // Notification Log
  getNotificationLog(): Promise<NotificationLog[]>;
  createNotificationLog(data: InsertNotificationLog): Promise<NotificationLog>;

  // Bank Accounts
  getBankAccounts(): Promise<BankAccount[]>;
  createBankAccount(data: InsertBankAccount): Promise<BankAccount>;
  updateBankAccount(id: number, data: Partial<InsertBankAccount>): Promise<BankAccount>;
  deleteBankAccount(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Auth
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Members
  async getMembers(params?: { search?: string, status?: string }): Promise<Member[]> {
    let query = db.select().from(members);
    const conditions = [];
    
    if (params?.search) {
      conditions.push(
        sql`(${members.firstName} || ' ' || ${members.lastName}) ILIKE ${`%${params.search}%`}`
      );
    }
    
    if (params?.status) {
      conditions.push(eq(members.status, params.status as any));
    }
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(members.createdAt));
  }

  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db.insert(members).values(insertMember).returning();
    return member;
  }

  async updateMember(id: number, update: Partial<InsertMember>): Promise<Member> {
    const [member] = await db.update(members).set(update).where(eq(members.id, id)).returning();
    return member;
  }

  async deleteMember(id: number): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  // Events
  async getEvents(params?: { start?: Date, end?: Date }): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.startTime);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: number, update: Partial<InsertEvent>): Promise<Event> {
    const [event] = await db.update(events).set(update).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.date));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  // Donations
  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.date));
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(insertDonation).returning();
    return donation;
  }

  async getDonationsTotal(period: 'month' | 'year'): Promise<number> {
    // Simplified for now - usually needs more complex date filtering
    const result = await db.select({ 
      total: sql<number>`sum(${donations.amount})` 
    }).from(donations);
    return result[0]?.total || 0;
  }

  // Ministries
  async getMinistries(): Promise<Ministry[]> {
    return await db.select().from(ministries);
  }

  async getMinistry(id: number): Promise<Ministry | undefined> {
    const [ministry] = await db.select().from(ministries).where(eq(ministries.id, id));
    return ministry;
  }

  async createMinistry(insertMinistry: InsertMinistry): Promise<Ministry> {
    const [ministry] = await db.insert(ministries).values(insertMinistry).returning();
    return ministry;
  }

  async getMinistryMembers(ministryId: number): Promise<(MinistryMember & { member: Member })[]> {
    return await db.select({
      id: ministryMembers.id,
      ministryId: ministryMembers.ministryId,
      memberId: ministryMembers.memberId,
      role: ministryMembers.role,
      joinedDate: ministryMembers.joinedDate,
      member: members
    })
    .from(ministryMembers)
    .innerJoin(members, eq(ministryMembers.memberId, members.id))
    .where(eq(ministryMembers.ministryId, ministryId));
  }

  async addMinistryMember(data: InsertMinistryMember): Promise<MinistryMember> {
    const [mm] = await db.insert(ministryMembers).values(data).returning();
    return mm;
  }

  // Welfare
  async getWelfareCases(): Promise<WelfareCase[]> {
    return await db.select().from(welfareCases).orderBy(desc(welfareCases.date));
  }

  async createWelfareCase(data: InsertWelfareCase): Promise<WelfareCase> {
    const [wc] = await db.insert(welfareCases).values(data).returning();
    return wc;
  }

  async updateWelfareCase(id: number, data: Partial<InsertWelfareCase>): Promise<WelfareCase> {
    const [wc] = await db.update(welfareCases).set(data).where(eq(welfareCases.id, id)).returning();
    return wc;
  }

  // Evangelism
  async getEvangelismRecords(): Promise<EvangelismRecord[]> {
    return await db.select().from(evangelismRecords).orderBy(desc(evangelismRecords.contactDate));
  }

  async createEvangelismRecord(data: InsertEvangelismRecord): Promise<EvangelismRecord> {
    const [er] = await db.insert(evangelismRecords).values(data).returning();
    return er;
  }

  async updateEvangelismRecord(id: number, data: Partial<InsertEvangelismRecord>): Promise<EvangelismRecord> {
    const [er] = await db.update(evangelismRecords).set(data).where(eq(evangelismRecords.id, id)).returning();
    return er;
  }

  // Stats
  async getDashboardStats() {
    const [memberCount] = await db.select({ count: sql<number>`count(*)` }).from(members);
    const [newConverts] = await db.select({ count: sql<number>`count(*)` }).from(evangelismRecords).where(eq(evangelismRecords.status, 'new'));
    const [upcomingEvents] = await db.select({ count: sql<number>`count(*)` }).from(events).where(sql`${events.startTime} > NOW()`);
    
    // Simple sum of donations this month
    const [donationsThisMonth] = await db.select({ sum: sql<number>`sum(${donations.amount})` })
      .from(donations)
      .where(sql`EXTRACT(MONTH FROM ${donations.date}) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM ${donations.date}) = EXTRACT(YEAR FROM CURRENT_DATE)`);

    return {
      memberCount: Number(memberCount?.count || 0),
      attendanceTrend: 5, // Mock trend for now
      donationsThisMonth: Number(donationsThisMonth?.sum || 0),
      upcomingEvents: Number(upcomingEvents?.count || 0),
      newConverts: Number(newConverts?.count || 0),
    };
  }

  // === NOTIFICATION TEMPLATES ===
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return await db.select().from(notificationTemplates).orderBy(desc(notificationTemplates.createdAt));
  }

  async createNotificationTemplate(data: InsertNotificationTemplate): Promise<NotificationTemplate> {
    const [template] = await db.insert(notificationTemplates).values(data).returning();
    return template;
  }

  async updateNotificationTemplate(id: number, data: Partial<InsertNotificationTemplate>): Promise<NotificationTemplate> {
    const [template] = await db.update(notificationTemplates).set(data).where(eq(notificationTemplates.id, id)).returning();
    return template;
  }

  async deleteNotificationTemplate(id: number): Promise<void> {
    await db.delete(notificationTemplates).where(eq(notificationTemplates.id, id));
  }

  // === NOTIFICATION LOG ===
  async getNotificationLog(): Promise<NotificationLog[]> {
    return await db.select().from(notificationLog).orderBy(desc(notificationLog.createdAt));
  }

  async createNotificationLog(data: InsertNotificationLog): Promise<NotificationLog> {
    const [log] = await db.insert(notificationLog).values(data).returning();
    return log;
  }

  // Analytics
  async getAnalytics() {
    const [memberStats] = await db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) FILTER (WHERE ${members.status} = 'active')`,
      inactive: sql<number>`count(*) FILTER (WHERE ${members.status} = 'inactive')`,
    }).from(members);

    const [donationStats] = await db.select({
      total: sql<number>`sum(${donations.amount})`,
      count: sql<number>`count(*)`,
      avg: sql<number>`avg(${donations.amount})`,
    }).from(donations);

    const donationMonthly = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${donations.date})`,
      year: sql<number>`EXTRACT(YEAR FROM ${donations.date})`,
      total: sql<number>`sum(${donations.amount})`,
      count: sql<number>`count(*)`,
    }).from(donations)
    .groupBy(sql`EXTRACT(YEAR FROM ${donations.date})`, sql`EXTRACT(MONTH FROM ${donations.date})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${donations.date})`, sql`EXTRACT(MONTH FROM ${donations.date})`);

    const eventAttendance = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${events.startTime})`,
      year: sql<number>`EXTRACT(YEAR FROM ${events.startTime})`,
      count: sql<number>`count(*)`,
    }).from(events)
    .groupBy(sql`EXTRACT(YEAR FROM ${events.startTime})`, sql`EXTRACT(MONTH FROM ${events.startTime})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${events.startTime})`, sql`EXTRACT(MONTH FROM ${events.startTime})`);

    const memberGrowth = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${members.joinedDate})`,
      year: sql<number>`EXTRACT(YEAR FROM ${members.joinedDate})`,
      count: sql<number>`count(*)`,
    }).from(members)
    .groupBy(sql`EXTRACT(YEAR FROM ${members.joinedDate})`, sql`EXTRACT(MONTH FROM ${members.joinedDate})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${members.joinedDate})`, sql`EXTRACT(MONTH FROM ${members.joinedDate})`);

    return {
      members: {
        total: Number(memberStats?.total || 0),
        active: Number(memberStats?.active || 0),
        inactive: Number(memberStats?.inactive || 0),
      },
      donations: {
        total: Number(donationStats?.total || 0),
        count: Number(donationStats?.count || 0),
        average: Number(donationStats?.avg || 0),
        monthly: donationMonthly.map(d => ({
          month: `${d.year}-${String(d.month).padStart(2, '0')}`,
          total: Number(d.total || 0),
          count: Number(d.count || 0),
        })),
      },
      events: {
        monthly: eventAttendance.map(e => ({
          month: `${e.year}-${String(e.month).padStart(2, '0')}`,
          count: Number(e.count || 0),
        })),
      },
      membersGrowth: memberGrowth.map(m => ({
        month: `${m.year}-${String(m.month).padStart(2, '0')}`,
        count: Number(m.count || 0),
      })),
    };
  }

  // === BANK ACCOUNTS ===
  async getBankAccounts(): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).orderBy(desc(bankAccounts.createdAt));
  }

  async createBankAccount(data: InsertBankAccount): Promise<BankAccount> {
    const [account] = await db.insert(bankAccounts).values(data).returning();
    return account;
  }

  async updateBankAccount(id: number, data: Partial<InsertBankAccount>): Promise<BankAccount> {
    const [account] = await db.update(bankAccounts).set(data).where(eq(bankAccounts.id, id)).returning();
    return account;
  }

  async deleteBankAccount(id: number): Promise<void> {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  }
}

export const storage = new DatabaseStorage();