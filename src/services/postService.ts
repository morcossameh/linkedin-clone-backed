import { AppDataSource } from "../data-source";
import { Post, Reaction } from "../entities/Post";

const postRepository = AppDataSource.getRepository(Post);

export interface CreatePostInput {
  content: string;
  reactions?: Reaction[];
  commentsCount?: number;
  repostsCount?: number;
}

export interface UpdatePostInput {
  content?: string;
  reactions?: Reaction[];
  commentsCount?: number;
  repostsCount?: number;
}

export class PostService {
  async getAllPosts(page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await postRepository.findAndCount({
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      skip,
      take: limit,
    });

    return { posts, total };
  }

  async getPostById(id: string): Promise<Post | null> {
    return postRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async getPostsByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await postRepository.findAndCount({
      where: { userId },
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      skip,
      take: limit,
    });

    return { posts, total };
  }

  async createPost(userId: string, input: CreatePostInput): Promise<Post> {
    const post = postRepository.create({
      ...input,
      userId,
      reactions: input.reactions || [],
      commentsCount: input.commentsCount || 0,
      repostsCount: input.repostsCount || 0,
    });

    return postRepository.save(post);
  }

  async updatePost(id: string, userId: string, input: UpdatePostInput): Promise<Post> {
    const post = await postRepository.findOne({ where: { id } });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Unauthorized to update this post");
    }

    Object.assign(post, input);

    return postRepository.save(post);
  }

  async deletePost(id: string, userId: string): Promise<void> {
    const post = await postRepository.findOne({ where: { id } });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Unauthorized to delete this post");
    }

    await postRepository.remove(post);
  }
}
