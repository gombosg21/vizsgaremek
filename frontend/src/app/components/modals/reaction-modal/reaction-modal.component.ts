import { Component } from '@angular/core';
import { reaction_local } from 'src/app/models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { Output } from '@angular/core';




@Component({
  selector: 'app-reaction-modal',
  templateUrl: './reaction-modal.component.html',
  styleUrls: ['./reaction-modal.component.css']
})
export class ReactionModalComponent {

  @Output() reactionInstance:reaction_local;

  public reactions:reaction_local[];

  constructor(private DBServie:DbService) {
    this.DBServie.getAllCahceReactions().subscribe({
      next:(value) => {
        this.reactions = value;
      },
      error:(err) => {
        console.error(err)
      },
    })
  };

  add():void {
  }

};
