import { PrismaClient } from '@prisma/client'
import seedUsers from '../prisma/seeds/seedUser.json'
import seedPersonalInformation from '../prisma/seeds/seedPersonalInformation.json'
import seedAddressInformation from '../prisma/seeds/seedAddressInformation.json'

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
    };

    for (const addressInfo of seedAddressInformation.data) {
      await prisma.addressInformation.upsert({
        where: { id: addressInfo.id },  // or another unique field
        update: {},  // no updates if address information exists
        create: addressInfo,
      });
    };

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
  }
};

main();