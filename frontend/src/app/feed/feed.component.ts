import { Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  posts = [
    { username: 'user1', image: 'https://via.placeholder.com/500x500', likes: 100 },
    { username: 'user2', image: 'https://via.placeholder.com/500x500', likes: 5 },
    { username: 'user3', image: 'https://via.placeholder.com/500x500', likes: 15 },
    { username: 'user4', image: 'https://via.placeholder.com/500x500', likes: 20 },
    { username: 'user5', image: 'https://via.placeholder.com/500x500', likes: 25 }
  ];

  like(post: any) {
    post.likes++;
  }
}
