import { PrismaClient } from '@prisma/client'
import seedUsers from '../prisma/seeds/seedUser.json'
import seedPersonalInformation from '../prisma/seeds/seedPersonalInformation.json'
import seedAddressInformation from '../prisma/seeds/seedAddressInformation.json'
import seedCompanyInformation from '../prisma/seeds/seedCompanyInformation.json'

const prisma = new PrismaClient();

const main = async () => {
  try {
    for (const user of seedUsers.data) {
      await prisma.user.upsert({
        where: { googleId: user.googleId },
        update: {},
        create: user,
      });
    }

    for (const personalInfo of seedPersonalInformation.data) {
      await prisma.personalInformation.upsert({
        where: { id: personalInfo.id },
        update: {},
        create: personalInfo,
      });
    };

    for (const addressInfo of seedAddressInformation.data) {
      await prisma.addressInformation.upsert({
        where: { id: addressInfo.id },
        update: {},
        create: addressInfo,
      });
    };

    for (const companyInfo of seedCompanyInformation.data) {
      await prisma.company.upsert({
        where: { id: companyInfo.id },
        update: {},
        create: companyInfo,
      });
    };

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
  }
};

main();