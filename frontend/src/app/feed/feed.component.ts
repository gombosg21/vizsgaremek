import { Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  posts = [{
    id: 1,
    username: "johndoe",
    profilePicture: "https://via.placeholder.com/150x150",
    image: "https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?cs=srgb&dl=pexels-lukas-rodriguez-3680219.jpg&fm=jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    likes: 50,
    time: "12 minutes ago"
},
{
    id: 2,
    username: "janedoe",
    profilePicture: "https://via.placeholder.com/150x150",
    image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada libero ac enim fringilla, non pellentesque mauris pulvinar.",
    likes: 30,
    time: "2 hours ago"
},
{
    id: 3,
    username: "jimmydoe",
    profilePicture: "https://via.placeholder.com/150x150",
    image: "https://irisphoto.art/web/image/76796/22-3-404-Maximilian.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada libero ac enim fringilla, non pellentesque mauris pulvinar.",
    likes: 20,
    time: "2 days ago"
}
];

  showReactions = false;

  

  lovePost(post: any) {
    // logic later
    console.log('Loved', post);
  }
  angryPost(post: any) {
    // logic later
    console.log('Angry', post);
  }
  hahaPost(post: any) {
    // logic later
    console.log('Haha', post);
  }
  sadPost(post: any) {
    // logic later
    console.log('Sad', post);
  }
}
