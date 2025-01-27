import { PrismaClient } from '@prisma/client'
import seedUsers from '../prisma/seeds/seedUser.json'
import seedPersonalInformation from '../prisma/seeds/seedPersonalInformation.json'

const prisma = new PrismaClient();

const main = async () => {
  try {
    for (const user of seedUsers.data) {
      await prisma.user.upsert({
        where: { googleId: user.googleId },  // or another unique field like id
        update: {},  // no updates if user exists
        create: user,
      });
    }

    for (const personalInfo of seedPersonalInformation.data) {
      await prisma.personalInformation.upsert({
        where: { id: personalInfo.id },  // or another unique field
        update: {},  // no updates if personal information exists
        create: personalInfo,
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
  }
};

main();