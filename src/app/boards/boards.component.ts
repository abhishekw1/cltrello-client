import { Component, inject, OnInit } from '@angular/core';
import { BoardsService } from '../shared/services/boards.service';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardInterface } from '../shared/types/board.interface';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [InlineFormComponent, RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss',
})
export class BoardsComponent implements OnInit {
  boards!: BoardInterface[];
  boardService = inject(BoardsService);

  ngOnInit(): void {
    this.boardService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }
  createBoard(title: string): void {
    this.boardService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
