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

  @Input() public parentType: string;
  @Input() public parentID: number;

  @Output() reacted = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

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

  add(index: number): void {
    this.ReactionsService.addReactionInstance([index + 1], this.parentID, this.parentType).subscribe({
      error: (error) => {
        console.log(error)
      },
      next: (value) => {
        this.reacted.emit(this.reactions[index].ID);
      },
      complete: () => {

      }
    });
  };

  onClose(): void {
    this.close.emit();
  };

};
