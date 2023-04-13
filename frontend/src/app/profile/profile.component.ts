import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = '';
  bio = '';
  profileImage = '';
  postCount = 0; 
  followersCount = 100;
  followingCount = 200;
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

  constructor(private route: ActivatedRoute, private authService: AuthService, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    this.authService.getUserProfile(userId).subscribe(
      (profile) => {
      },
      (error: any) => {
        console.error('Profile error:: ', error);
      }
    );
  }
  
  
  

  getUserProfile(userId: string): void {
    const token = this.cookieService.get('VSCookie');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

   this.http.get(`/api/v/0.1/user/${userId}`, { headers }).subscribe(
    (response: any) => {
        this.username = response.profile.profile.alias;
        this.bio = response.profile.profile.description;
        this.profileImage = response.profile.profile.medium;
        // other fetched data later

        console.log('Fetched user profile:', response);
      },
      (error) => {
        console.error('Errorlog2: ', error);
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
