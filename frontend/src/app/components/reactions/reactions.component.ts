import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { reaction, reaction_short } from '../../models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})

export class ReactionsComponent implements OnInit, OnDestroy, OnChanges {

  public reactions: reaction[];

  @Input() reactionInstanceList: reaction_short[];
  private reactionsSub: Subscription;
  private _newReactionID:number;

  @Input() set newReaction(reactionID: number) {
    this._newReactionID = reactionID;
  };

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        console.log(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        console.log(`${propName} changed from ${from} to ${to}`);
      }
    }
  }

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
          next: (value) => {
            this.reactions = [...value];
          },
          error: (err) => {
            console.error(err);
          },
        });
      }, error: (err) => {
        console.error(err);
      }
    });
  };

  added(reactionID: number): void {
    var index: number = -1;
    for (let i = 0; i < this.reactionInstanceList.length; i++) {
      if (this.reactionInstanceList[i].ID == reactionID) {
        index = i;
      };
    };
    if (index != -1) {
      this.reactionInstanceList[index].count++;
      this.reactionInstanceList = [...this.reactionInstanceList];
    } else {
      this.reactionInstanceList.push({ ID: reactionID, count: 1 });
      this.reactionInstanceList = [...this.reactionInstanceList];
    };
  };
};
