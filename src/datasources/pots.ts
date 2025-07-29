import * as data from "../data/data.json";

export class PotsDataSource {
    private posts = data;

    getAllPosts() {
      return this.posts;
    }

    getPostById(id: number) {
      return this.posts.find(post =>
  post.id === id);
    }
  }