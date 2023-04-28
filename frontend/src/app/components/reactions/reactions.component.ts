import { Component, Input } from '@angular/core';
import { reaction } from '../../models/reaction';
import { DbService } from 'src/app/services/db/db.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})

export class ReactionsComponent {

  public reactions: reaction[];

  @Input() reactionIDs: number[];

  constructor(private DBService: DbService) {
    this.DBService.getCacheReactions(this.reactionIDs).subscribe({
      next: (value) => { this.reactions = value ?? this.reactions },
      error: (err) => {
        console.log(err);
      },
    })
  };
};
