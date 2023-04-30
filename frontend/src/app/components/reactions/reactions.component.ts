import { Component, Input, OnInit } from '@angular/core';
import { reaction, reaction_short } from '../../models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})

export class ReactionsComponent implements OnInit {

  public reactions: reaction[];

  @Input() reactionInstanceList: reaction_short[];

  constructor(private DBService: DbService, private ReactionService: ReactionService) {

  };

  ngOnInit(): void {
    this.reactionInstanceList = this.ReactionService.getStoredInstanceList() ?? this.reactionInstanceList;

    const IDList: number[] = this.reactionInstanceList.map(reaction => reaction.ID);
    this.DBService.getCacheReactions(IDList).subscribe({
      next: (value) => { this.reactions = value; },
      error: (err) => {
        console.log(err);
      },
    });
  };
};
