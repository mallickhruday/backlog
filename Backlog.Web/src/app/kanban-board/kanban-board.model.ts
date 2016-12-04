import { KanbanBoardTask } from "./kanban-board-item.model";

export class KanbanBoard { 
	public id:number;
    public name: string;
    public items: Array<KanbanBoardTask> = [];
}
