import { z } from "zod";
import { 
  insertUserSchema, insertMemberSchema, insertEventSchema, insertServiceSchema, 
  insertDonationSchema, insertMinistrySchema, insertMinistryMemberSchema, 
  insertWelfareCaseSchema, insertEvangelismRecordSchema,
  insertNotificationTemplateSchema, insertBankAccountSchema,
  users, members, events, services, donations, ministries, ministryMembers, welfareCases, evangelismRecords,
  notificationTemplates, notificationLog, bankAccounts
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// Generic list query params
const listQueryParams = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export const api = {
  // Auth
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // Members
  members: {
    list: {
      method: 'GET' as const,
      path: '/api/members',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof members.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/members/:id',
      responses: {
        200: z.custom<typeof members.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/members',
      input: insertMemberSchema,
      responses: {
        201: z.custom<typeof members.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/members/:id',
      input: insertMemberSchema.partial(),
      responses: {
        200: z.custom<typeof members.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/members/:id',
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },

  // Events
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      input: listQueryParams.extend({ start: z.string().optional(), end: z.string().optional() }),
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/events/:id',
      input: insertEventSchema.partial(),
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/events/:id',
      responses: {
        200: z.void(),
      },
    },
  },

  // Services
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/services',
      input: insertServiceSchema,
      responses: {
        201: z.custom<typeof services.$inferSelect>(),
      },
    },
  },

  // Donations
  donations: {
    list: {
      method: 'GET' as const,
      path: '/api/donations',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/donations',
      input: insertDonationSchema,
      responses: {
        201: z.custom<typeof donations.$inferSelect>(),
      },
    },
  },

  // Ministries
  ministries: {
    list: {
      method: 'GET' as const,
      path: '/api/ministries',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof ministries.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/ministries/:id',
      responses: {
        200: z.custom<typeof ministries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ministries',
      input: insertMinistrySchema,
      responses: {
        201: z.custom<typeof ministries.$inferSelect>(),
      },
    },
    members: {
      list: {
        method: 'GET' as const,
        path: '/api/ministries/:id/members',
        responses: {
          200: z.array(z.custom<typeof ministryMembers.$inferSelect & { member: typeof members.$inferSelect }>()),
        },
      },
      add: {
        method: 'POST' as const,
        path: '/api/ministries/:id/members',
        input: insertMinistryMemberSchema.omit({ ministryId: true }),
        responses: {
          201: z.custom<typeof ministryMembers.$inferSelect>(),
        },
      },
    },
  },

  // Welfare
  welfare: {
    list: {
      method: 'GET' as const,
      path: '/api/welfare',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof welfareCases.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/welfare',
      input: insertWelfareCaseSchema,
      responses: {
        201: z.custom<typeof welfareCases.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/welfare/:id',
      input: insertWelfareCaseSchema.partial(),
      responses: {
        200: z.custom<typeof welfareCases.$inferSelect>(),
      },
    },
  },

  // Evangelism
  evangelism: {
    list: {
      method: 'GET' as const,
      path: '/api/evangelism',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof evangelismRecords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/evangelism',
      input: insertEvangelismRecordSchema,
      responses: {
        201: z.custom<typeof evangelismRecords.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/evangelism/:id',
      input: insertEvangelismRecordSchema.partial(),
      responses: {
        200: z.custom<typeof evangelismRecords.$inferSelect>(),
      },
    },
  },

  // Notifications
  notifications: {
    templates: {
      list: {
        method: 'GET' as const,
        path: '/api/notification-templates',
        input: listQueryParams,
        responses: {
          200: z.array(z.custom<typeof notificationTemplates.$inferSelect>()),
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/notification-templates',
        input: insertNotificationTemplateSchema,
        responses: {
          201: z.custom<typeof notificationTemplates.$inferSelect>(),
          400: errorSchemas.validation,
        },
      },
      update: {
        method: 'PATCH' as const,
        path: '/api/notification-templates/:id',
        input: insertNotificationTemplateSchema.partial(),
        responses: {
          200: z.custom<typeof notificationTemplates.$inferSelect>(),
          404: errorSchemas.notFound,
        },
      },
      delete: {
        method: 'DELETE' as const,
        path: '/api/notification-templates/:id',
        responses: {
          200: z.void(),
          404: errorSchemas.notFound,
        },
      },
    },
    log: {
      list: {
        method: 'GET' as const,
        path: '/api/notification-log',
        input: listQueryParams,
        responses: {
          200: z.array(z.custom<typeof notificationLog.$inferSelect>()),
        },
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/notifications/send',
      input: z.object({
        recipients: z.array(z.object({
          email: z.string(),
          name: z.string().optional(),
          eventTitle: z.string().optional(),
          eventDate: z.string().optional(),
          eventTime: z.string().optional(),
          eventLocation: z.string().optional(),
          eventDescription: z.string().optional(),
        })),
        customSubject: z.string().optional(),
        customBody: z.string().optional(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
          results: z.array(z.any()),
        }),
      },
    },
  },

  // Bank Accounts
  bankAccounts: {
    list: {
      method: 'GET' as const,
      path: '/api/bank-accounts',
      input: listQueryParams,
      responses: {
        200: z.array(z.custom<typeof bankAccounts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/bank-accounts',
      input: insertBankAccountSchema,
      responses: {
        201: z.custom<typeof bankAccounts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/bank-accounts/:id',
      input: insertBankAccountSchema.partial(),
      responses: {
        200: z.custom<typeof bankAccounts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/bank-accounts/:id',
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },

  // Dashboard Stats
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          memberCount: z.number(),
          attendanceTrend: z.number(), // Percentage
          donationsThisMonth: z.number(), // cents
          upcomingEvents: z.number(),
          newConverts: z.number(),
        }),
      },
    },
    analytics: {
      method: 'GET' as const,
      path: '/api/analytics',
      responses: {
        200: z.object({
          members: z.object({
            total: z.number(),
            active: z.number(),
            inactive: z.number(),
          }),
          donations: z.object({
            total: z.number(),
            count: z.number(),
            average: z.number(),
            monthly: z.array(z.object({
              month: z.string(),
              total: z.number(),
              count: z.number(),
            })),
          }),
          events: z.object({
            monthly: z.array(z.object({
              month: z.string(),
              count: z.number(),
            })),
          }),
          membersGrowth: z.array(z.object({
            month: z.string(),
            count: z.number(),
          })),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}

export type InsertUser = z.infer<typeof api.auth.register.input>;
export type InsertMember = z.infer<typeof api.members.create.input>;
export type InsertEvent = z.infer<typeof api.events.create.input>;
export type InsertService = z.infer<typeof api.services.create.input>;
export type InsertDonation = z.infer<typeof api.donations.create.input>;
export type InsertWelfareCase = z.infer<typeof api.welfare.create.input>;
export type InsertMinistry = z.infer<typeof api.ministries.create.input>;
export type InsertMinistryMember = z.infer<typeof api.ministries.members.add.input>;
export type InsertEvangelismRecord = z.infer<typeof api.evangelism.create.input>;
export type InsertNotificationTemplate = z.infer<typeof api.notifications.templates.create.input>;
export type InsertBankAccount = z.infer<typeof api.bankAccounts.create.input>;


