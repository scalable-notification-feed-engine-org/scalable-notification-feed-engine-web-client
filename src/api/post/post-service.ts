import {Post} from "@/types/post";


const API_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3002/post';

export const postService = {

    async createPost(data: Partial<Post>): Promise<Post> {
     const response = await fetch(`${API_BASE_URL}`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data),
      });
     if (!response.ok) {
         throw new Error("Failed to create post");
     }

     return response.json();
   },


    async toggleLike(postId: string, userId:string){
        const response = await fetch(`${API_BASE_URL}/${postId}/like`,{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId}),
        });
        console.log("Response:", response.status);
        if (!response.ok) {
            throw new Error("Failed to get posts");
        }
        return response.json();
    },


    async addComment(postId: string, userId: string, content: string) {

      const createCommentDto = {
          userId: userId,
          content: content,
      }

        try {
            console.log("User data " , createCommentDto.userId)
            const response= await fetch(`${API_BASE_URL}/${postId}/comment`, {
               method: 'POST',
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify(createCommentDto),
            });

            return response.json();
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    }


}