import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { getTokenUserID } from '../../helpers/extractors/token';
import { profile } from '../../models/profile';
import { thread } from '../../models/thread';
import { ThreadService } from '../../services/thread/thread.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public UserProfile: profile;
  public UserProfileThread: thread;

  alias = "";
  description = "";
  birth_date = new Date();
  gender = NaN;
  profileImage = ""; // fallback image?
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

  constructor(private UserService: UserService, private ThreadService: ThreadService, private ReactionsService: ReactionService) {
  };

  ngOnInit(): void {
    this.onLoad();
  };


  onLoad(): void {
    this.UserService.getProfile(getTokenUserID()).subscribe({
      next: (data) => {
        this.UserProfile = {
          birth_date: data.birth_date,
          alias: data.profile.alias,
          description: data.profile.description,
          visibility: data.profile.visibility,
          picture_ID: data.profile.picture_ID,
          medium: data.profile.medium,
          reactions: data.profile.reactions,
          thread: data.profile.thread
        }

        this.UserProfileThread = {
          name: data.profile.thread.name,
          ID: data.profile.thread.ID,
          status: data.profile.thread.status,
          created: data.profile.thread.created,
          last_activity: data.profile.thread.last_activity,
          reactions: data.profile.thread.reactions,
          comments: data.profile.thread.comments
        }
        this.alias = this.UserProfile.alias;
        this.description = this.UserProfile.description;
        this.birth_date = this.UserProfile.birth_date;
        this.gender = data.gender;
        this.profileImage = this.UserProfile.medium; // fallback image?

        this.ThreadService.setLocalData([this.UserProfileThread]);
        if (this.UserProfile.reactions) {
          this.ReactionsService.setStoredInstanceList(this.UserProfile.reactions);
        };
      },
      error:(err) => {
        console.log(err)
      },
      complete() {
        
      },
    });
  };





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
