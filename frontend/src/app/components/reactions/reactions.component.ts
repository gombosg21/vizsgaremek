import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { reaction, reaction_short } from '../../models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})

export class ReactionsComponent implements OnInit, OnDestroy {

  public reactions: reaction[];

  @Input() reactionInstanceList: reaction_short[];
  private reactionsSub: Subscription;

  constructor(private DBService: DbService, private ReactionService: ReactionService) {

  };

  ngOnDestroy(): void {
    this.reactionsSub.unsubscribe();
  };


  ngOnInit(): void {
    this.reactionsSub = this.ReactionService.getStoredInstanceList().subscribe({
      next: (value) => {
        this.reactionInstanceList = value ?? this.reactionInstanceList;
        const IDList: number[] = this.reactionInstanceList.map(reaction => reaction.ID);
        this.DBService.getCacheReactions(IDList).subscribe({
          next: (value) => { this.reactions = value; },
          error: (err) => {
            console.log(err);
          },
        });
      }, error: (err) => {
        console.error(err);
      }
    });

  };
};
