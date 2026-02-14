import { Request, Response } from "express";
import { PostService } from "../services/postService";
import { AuthRequest } from "../middleware/auth";

const postService = new PostService();

export class PostController {
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { posts, total } = await postService.getAllPosts(page, limit);

      res.status(200).json({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const post = await postService.getPostById(id);

      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMyPosts(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { posts, total } = await postService.getPostsByUserId(req.user.userId, page, limit);

      res.status(200).json({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { content, reactions, commentsCount, repostsCount } = req.body;

      if (!content) {
        res.status(400).json({ error: "Content is required" });
        return;
      }

      const post = await postService.createPost(req.user.userId, {
        content,
        reactions,
        commentsCount,
        repostsCount,
      });

      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const id = req.params.id as string;
      const { content, reactions, commentsCount, repostsCount } = req.body;

      const post = await postService.updatePost(id, req.user.userId, {
        content,
        reactions,
        commentsCount,
        repostsCount,
      });

      res.status(200).json(post);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Post not found") {
          res.status(404).json({ error: error.message });
        } else if (error.message === "Unauthorized to update this post") {
          res.status(403).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const id = req.params.id as string;

      await postService.deletePost(id, req.user.userId);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Post not found") {
          res.status(404).json({ error: error.message });
        } else if (error.message === "Unauthorized to delete this post") {
          res.status(403).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
