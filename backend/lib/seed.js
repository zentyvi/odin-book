import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { prisma_client } from "./prisma.js";

const usersNumber = 20;
const postsNumber = 4;

async function main() {
  console.log("Cleaning old data...");
  await prisma_client.$transaction([
    prisma_client.comment.deleteMany(),
    prisma_client.post.deleteMany(),
    prisma_client.message.deleteMany(),
    prisma_client.chat.deleteMany(),
    prisma_client.friendRequest.deleteMany(),
    prisma_client.settings.deleteMany(),
    prisma_client.user.deleteMany(),
  ]);

  console.log("Hashing passwords...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  async function createUser() {
    const user = await prisma_client.user.create({
      data: {
        avatarUrl: faker.image.avatarGitHub(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: hashedPassword,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
      },
    });

    return user.id;
  }

  console.log("Creating new users...");
  const userIdList = [];
  for (let i = 0; i < usersNumber; i++) {
    const userId = await createUser();
    userIdList.push(userId);
  }

  function getRandomIndex(list = userIdList) {
    return Math.floor((Math.random() * 100) % list.length);
  }

  async function createComment(postId, likesNumber) {
    likesNumber = likesNumber == undefined ? getRandomIndex() : likesNumber;
    const authorId = userIdList[getRandomIndex()];
    const localIds = userIdList.filter((a) => a != authorId);

    const getLikedBy = () => {
      const list = [];
      for (let i = 0; i < likesNumber; i++) {
        list.push({ id: localIds.pop() });
      }
      return list;
    };

    await prisma_client.comment.create({
      data: {
        content: faker.lorem.lines(),
        author: {
          connect: {
            id: authorId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        likedBy: {
          connect: getLikedBy(),
        },
      },
    });
  }

  async function createPost(commentsNumber, likesNumber) {
    commentsNumber =
      commentsNumber == undefined ? getRandomIndex() : commentsNumber;
    likesNumber = likesNumber == undefined ? getRandomIndex() : likesNumber;
    const localIds = [...userIdList];

    const getLikedBy = () => {
      const list = [];
      for (let i = 0; i < likesNumber; i++) {
        list.push({ id: localIds.pop() });
      }
      return list;
    };

    const post = await prisma_client.post.create({
      data: {
        content: faker.lorem.lines({ min: 3, max: 20 }),
        author: {
          connect: {
            id: userIdList[getRandomIndex()],
          },
        },
        likedBy: {
          connect: getLikedBy(),
        },
      },
      select: {
        id: true,
      },
    });

    for (let i = 0; i < commentsNumber; i++) {
      await createComment(post.id);
    }
  }

  console.log("Creating posts and comments...");
  for (let i = 0; i < postsNumber; i++) {
    await createPost(3);
  }

  console.log("Done!");
  await prisma_client.$disconnect();
  process.exit(1);
}

main();
