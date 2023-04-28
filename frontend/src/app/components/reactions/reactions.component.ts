import { Component, Input } from '@angular/core';
import { reaction } from '../../models/reaction';
import { ReactionService } from '../../services/reaction/reaction.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})

export class ReactionsComponent {

  private data: reaction[];

  @Input() reactions: reaction[];
  @Input() ID: number;
  @Input() targetType: string;

  constructor(private ReactionService: ReactionService) {
    this.ReactionService.getAllItemReactions(this.ID, this.targetType).subscribe({
      next: (value) => { this.data = value },
      error(err) {
        console.log(err);
      },
    })
    this.reactions = this.data ?? this.reactions;
  };
};
