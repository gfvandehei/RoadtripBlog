import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {FindAllAndCount} from "../../models/sqlmodels";
import {IBlog} from "../../models/blog";

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(
    private http: HttpClient
  ) { }

  async getBlogs(){
    let blogResponse = await this.http.get<FindAllAndCount<IBlog>>(`${environment.apiURL}/blogs`).toPromise();
    return blogResponse;
  }

  async createBlog(title: string){
    let response = await this.http.post(`${environment.apiURL}/blogs`, {
      title: title
    }).toPromise();
    return response;
  }

  async getBlogPosts(blogId: number){
    let response = await this.http.get(`${environment.apiURL}/blogs/${blogId}/posts`).toPromise();
    return response;
  }
}
