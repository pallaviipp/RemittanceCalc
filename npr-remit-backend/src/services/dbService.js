import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// Provider operations
export const providerService = {
  async getProviders() {
    return prisma.provider.findMany();
  },

  async getProvider(id) {
    return prisma.provider.findUnique({ where: { id } });
  },

  async createProvider(data) {
    return prisma.provider.create({ data });
  },

  async updateProvider(id, data) {
    return prisma.provider.update({ where: { id }, data });
  },

  async deleteProvider(id) {
    return prisma.provider.delete({ where: { id } });
  }
};

// Exchange Rate operations
export const exchangeRateService = {
  async getLatestRates() {
    return prisma.exchangeRate.findMany({
      orderBy: { date: 'desc' },
      take: 1
    });
  },

  async createRate(data) {
    return prisma.exchangeRate.create({ data });
  },

  async getHistoricalRates(from, to) {
    return prisma.exchangeRate.findMany({
      where: {
        date: {
          gte: new Date(from),
          lte: new Date(to)
        }
      },
      orderBy: { date: 'asc' }
    });
  }
};

// Health check
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
};

export default prisma;

