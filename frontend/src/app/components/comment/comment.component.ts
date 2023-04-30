import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment/comment.service';
import { ReactionService } from '../../services/reaction/reaction.service';
import { comment } from '../../models/comment';
import { reaction } from 'src/app/models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  private data: comment;

  @Input() public content: string;
  @Input() public created: Date;
  @Input() public last_edit: Date;
  @Input() public user_alias: string;
  @Input() public ID: number;
  @Input() public iterator: number = 0;
  @Input() public reactions: reaction[];

  constructor(private CommentService: CommentService, private ReactionService: ReactionService, private DBService: DbService) {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];
  };

  ngOnInit(): void {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];

    this.content = this.data.content ?? this.content;
    this.ID = this.data.ID ?? this.ID;
    this.last_edit = this.data.last_edit ?? this.last_edit;
    this.created = this.data.created ?? this.created;
    if (this.data.reactions) {
      this.ReactionService.setStoredInstanceList(this.data.reactions);
    };
  };

  react(ID: number): Observable<any> {
    const reactEvent = this.ReactionService.addReactionInstance(ID, this.ID, "comment");

    reactEvent.subscribe({
      next: (value) => {
        this.DBService.getCacheReactions([ID]).subscribe({
          next: (localValue) => {
            localValue.forEach(reaction => {
              this.reactions.push(reaction)
            });
          },
          error: (error) => { console.error(error) }
        })
      },
      error: (error) => {
        console.error(error)
      }
    })

    return reactEvent;
  };
};
