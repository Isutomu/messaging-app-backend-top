module.exports.cleanDatabase = async (prisma) => {
  await prisma.groupFile.deleteMany({});
  await prisma.groupMessage.deleteMany({});
  await prisma.group.deleteMany({});

  await prisma.file.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.session.deleteMany({});
};
