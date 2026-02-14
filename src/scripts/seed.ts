import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

const persons = [
  {
    name: "Bellinda Mesbah",
    profilePicture:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    title: "Software Engineer & AI Scientist | Building AI for Real-World",
  },
  {
    name: "Alex Rodriguez",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title:
      "Senior Product Manager at Microsoft | Ex-Google | Building the future of AI",
  },
  {
    name: "John Doe",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    title: "Software Engineer at Meta",
  },
];

const postsData = [
  {
    personIndex: 0,
    content:
      "<p><strong>You'll be working on:</strong></p><ul><li>FastAPI microservices for ERP application</li><li>Integrating proprietary LLMs and other machine learning applications</li><li>Third-party API integrations - logs, identity, payments, bookings etc.</li><li>Async orchestration, structured data extraction, and real-time APIs (WebSockets, queues, gRPC)</li><li>Working across PostgreSQL, Redis, and GCP with CI/CD pipelines</li></ul><p>This is not a training role. You'll own features, write and read production code, and be trusted to deliver fast. If you're not confident debugging your own bugs or navigating a codebase solo, don't apply.</p><p><strong>You should be able to:</strong></p><ul><li>Debug your own code and read others</li><li>Write clean, async-ready Python with proper type hints</li><li>Know basic commands of Git</li><li>Know REST deeply, including when not to use it</li></ul><p>You'll join a team of engineers who don't believe in fluff. Just commits, ownership, and results.</p><p>DM only if you can code. If you've built anything and you're proud of it (even a side project), send it over. Fresh grads welcome.</p>",
    reactions: [
      {
        type: "thumbs-up",
        count: 20,
      },
    ],
    commentsCount: 1,
    repostsCount: 2,
  },
  {
    personIndex: 1,
    content:
      "<p>🚀 Excited to share that our team just launched a game-changing AI feature that's already improving productivity by 40% for our enterprise clients!</p><p><strong>Key achievements this quarter:</strong></p><ul><li>Successfully deployed machine learning models across 15+ markets</li><li>Reduced customer onboarding time from 2 weeks to 3 days</li><li>Achieved 98.5% uptime across all services</li><li>Led a cross-functional team of 12 engineers and designers</li></ul><p>Big thanks to my amazing team who made this possible. Innovation happens when talented people collaborate with a shared vision. 💪</p><p>What's next? We're exploring how generative AI can revolutionize user experiences in ways we never imagined. The future is incredibly exciting!</p><p>#ProductManagement #AI #Microsoft #Innovation #TeamWork</p>",
    reactions: [
      {
        type: "thumbs-up",
        count: 10,
      },
      {
        type: "heart",
        count: 5,
      },
      {
        type: "lightbulb",
        count: 2,
      },
    ],
    commentsCount: 20,
    repostsCount: 12,
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    // Clear existing data (delete posts first due to foreign key constraint)
    console.log("Clearing existing posts and users...");
    await postRepository.createQueryBuilder().delete().execute();
    await userRepository.createQueryBuilder().delete().execute();

    // Create users from persons data
    console.log("Creating users...");
    const users: User[] = [];

    for (const person of persons) {
      const [firstName, ...lastNameParts] = person.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, "")}@example.com`;

      const user = userRepository.create({
        email,
        password: "password123",
        firstName,
        lastName,
        profilePicture: person.profilePicture,
        headline: person.title,
      });

      const savedUser = await userRepository.save(user);
      users.push(savedUser);
      console.log(`Created user: ${savedUser.email}`);
    }

    // Create posts
    console.log("\nCreating posts...");
    for (const postData of postsData) {
      const user = users[postData.personIndex];

      const post = postRepository.create({
        content: postData.content,
        reactions: postData.reactions,
        commentsCount: postData.commentsCount,
        repostsCount: postData.repostsCount,
        userId: user.id,
      });

      await postRepository.save(post);
      console.log(`Created post by ${user.firstName} ${user.lastName}`);
    }

    console.log("\n✅ Seed data created successfully!");
    console.log("\nUsers created:");
    users.forEach(user => {
      console.log(`  - ${user.email} (password: password123)`);
    });

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
