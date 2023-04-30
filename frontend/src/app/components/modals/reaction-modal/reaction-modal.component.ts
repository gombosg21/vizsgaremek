import { Component, Input, Output, EventEmitter } from '@angular/core';
import { reaction } from 'src/app/models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';


@Component({
  selector: 'app-reaction-modal',
  templateUrl: './reaction-modal.component.html',
  styleUrls: ['./reaction-modal.component.css']
})
export class ReactionModalComponent {

  @Output() public reactionInstance: reaction;
  @Input() public parentType: string;
  @Input() public parentID: number;

  @Output() reacted = new EventEmitter<reaction>();
  @Output() canceled = new EventEmitter<void>();


  public selectedIterator: number;
  public reactions: reaction[];

  constructor(private DBServie: DbService, private ReactionsService: ReactionService) {
    this.DBServie.getAllCahceReactions().subscribe({
      next: (value) => {
        this.reactions = value;
      },
      error: (err) => {
        console.error(err)
      },
    })
  };

  add(): void {
    this.ReactionsService.addReactionInstance([this.selectedIterator + 1], this.parentID, this.parentType).subscribe({
      error: (error) => {
        console.log(error)
      },
      next: (value) => {
        this.reacted.emit(this.reactions[this.selectedIterator]);
      },
      complete: () => {

      }
    });
  };

};
