import * as data from "../data/data.json";
import { Post } from "../types/graphql";

export class PostsDataSource {
    private posts: Post[] = data.posts;

    getAllPosts(): Post[] {
      return this.posts;
    }

    getPostById(id: string): Post | undefined {
      return this.posts.find((post: Post) => post.id === id);
    }
}