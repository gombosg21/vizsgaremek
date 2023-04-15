import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { profile } from '../models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  alias = '';
  description = '';
  gender = 0;
  profileImage = '';
  postCount = 0;
  followersCount = 0;
  followingCount = 0;
  showUploadForm = false;

  selectedImage = '';
  isSmallImage = false;
  showModal = false;


  //template images posts
  posts = [
    {
      image: 'https://www.shutterstock.com/image-photo/happy-cheerful-young-woman-wearing-260nw-613759379.jpg',
      likes: 50,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada libero ac enim fringilla, non pellentesque mauris pulvinar.',
    },
    {
      image: 'https://www.shutterstock.com/shutterstock/photos/1865153395/display_1500/stock-photo-portrait-of-young-smiling-woman-looking-at-camera-with-crossed-arms-happy-girl-standing-in-1865153395.jpg',
      likes: 100,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada libero ac enim fringilla, non pellentesque mauris pulvinar.',
    },
  ];

  constructor(private route: ActivatedRoute, private UserService : UserService,private http: HttpClient, private cookieService: CookieService) { }

  UserProfile: profile = new profile(undefined, undefined, undefined, undefined, undefined, undefined, undefined);

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    this.UserService.getProfile(userId).subscribe(
      (profile) => {
        this.UserProfile.birth_date = profile.birth_date;
        this.UserProfile.gender = profile.gender
        this.UserProfile.alias = profile.profile.alias;
        this.UserProfile.description = profile.profile.description;
        this.UserProfile.type = profile.type;
        this.UserProfile.register_date = profile.register_date;
        this.UserProfile.avatar = profile.profile.medium;
      },
      (error: any) => {
        console.error('Profile error:: ', error);
      }
    );
  }




  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      this.isSmallImage = img.naturalWidth < window.innerWidth * 0.8 && img.naturalHeight < window.innerHeight * 0.8;
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.selectedImage = '';
    this.isSmallImage = false;
    this.showModal = false;
  }

  newPost = { image: '', likes: 0, description: '' };

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    if (event.target != null) {
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        if (event.target != null) {
          this.newPost.image = event.target.result as string;
        }
      };
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.posts.push({
      image: this.newPost.image,
      likes: 0,
      description: this.newPost.description
    });
    console.log(this.posts);
    this.newPost.image = '';
    this.newPost.description = '';
    this.showUploadForm = false;
  }
}
