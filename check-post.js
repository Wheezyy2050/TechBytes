const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.findMany({ where: { title: { contains: 'NASA' } } })
  .then(posts => {
    console.log(JSON.stringify(posts, null, 2));
    return prisma.$disconnect();
  });
