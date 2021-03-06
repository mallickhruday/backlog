import { Story } from "./story.model";
import { StoryService } from "./story.service";
import { EditorComponent, dropZoneEvents, DropZoneComponent, tabsEvents } from "../shared";
import { Router } from "../router";
import { TaskService, taskActions, Task, TaskEditComponent, TaskListComponent } from "../tasks";
import { DigitalAssetService } from "../digital-assets";

const template = require("./story-edit.component.html");
const styles = require("./story-edit.component.scss");

export class StoryEditComponent extends HTMLElement {
    constructor(
        private _digitalAssetService: DigitalAssetService = DigitalAssetService.Instance,
        private _storyService: StoryService = StoryService.Instance,
        private _router: Router = Router.Instance,
        private _taskService: TaskService = TaskService.Instance,
        private _window: Window = window
    ) {
        super();

        this.onTaskAdd = this.onTaskAdd.bind(this);
        this.onTaskDelete = this.onTaskDelete.bind(this);
        this.onTaskEdit = this.onTaskEdit.bind(this);
        this.onTaskView = this.onTaskView.bind(this);
        this.onTitleClick = this.onTitleClick.bind(this);
        this.onTabSelectedIndexChanged = this.onTabSelectedIndexChanged.bind(this);
    }

    static get observedAttributes() {
        return ["story-id","epic-id","tab-index"];
    }
    
    async connectedCallback() {        
        
        this.innerHTML = `<style>${styles}</style> ${template}`; 
        this.tabsElement.setAttribute("custom-tab-index", `${this.customTabIndex}`);
        this.saveButtonElement = this.querySelector(".save-button") as HTMLButtonElement;
        this.deleteButtonElement = this.querySelector(".delete-button") as HTMLButtonElement;        
        this.nameInputElement = this.querySelector(".story-name") as HTMLInputElement;
        this._titleElement.textContent = this.storyId ? "Edit Story" : "Create Story";
        this.saveButtonElement.addEventListener("click", this.onSave.bind(this));
        this.deleteButtonElement.addEventListener("click", this.onDelete.bind(this));
        this.descriptionEditor = new EditorComponent(this.descriptionElement);
        this.notesEditor = new EditorComponent(this.notesElement);
        this.completedDatePicker = rome(this.completedDateElement);
        this.descriptionEditor.setHTML("<p><strong>As a </strong>product owner</p> <p><strong>I want/can</strong> &lt;action&gt;</p> <p><strong>so that</strong> &lt;reason&gt;</p>");

        if (this.storyId) {
            let resultsArray: any = await Promise.all([ this._storyService.getById(this.storyId), this._taskService.getByStoryId(this.storyId) ]);
            let results = resultsArray[0];
            this.tasks = JSON.parse(resultsArray[1]);
            let resultsJSON: Story = JSON.parse(results) as Story;
            this.nameInputElement.value = resultsJSON.name;
            this.descriptionEditor.setHTML(resultsJSON.description);
            this.priorityElement.value = resultsJSON.priority;
            this.notesEditor.setHTML(resultsJSON.notes);
            this.pointsInputElement.value = resultsJSON.points;
            this.architecturePointsInputElement.value = resultsJSON.architecturePoints;
            this.completedDateElement.value = resultsJSON.completedDate;

            this._taskEditComponent.setAttribute("story-id", JSON.stringify(this.storyId));
            this._taskListComponent.setAttribute("story-id", JSON.stringify(this.storyId));

            resultsJSON.digitalAssets.map(d => {
                let el = document.createElement("ce-story-digital-asset");
                el.setAttribute("relative-path", d.relativePath);
                el.setAttribute("digital-asset-id", d.id);
                this.digitalAssetsContainer.appendChild(el);
            });            
        } else {
            this.deleteButtonElement.style.display = "none";
            this.imageDropZoneElement.style.display = "none";
        } 
        
        this._setEventListeners();
    }

    private _setEventListeners() {
        this.imageDropZoneElement.addEventListener(dropZoneEvents.DROP, this.onImageDrop.bind(this));
        this.addEventListener(taskActions.ADD, this.onTaskAdd);
        this.addEventListener(taskActions.EDIT, this.onTaskEdit);
        this.addEventListener(taskActions.VIEW, this.onTaskView);
        this.addEventListener(taskActions.DELETE, this.onTaskDelete);
        this._titleElement.addEventListener("click", this.onTitleClick);
        this.addEventListener(tabsEvents.SELECTED_INDEX_CHANGED, this.onTabSelectedIndexChanged);
    }

    public disconnectedCallback() {
        this.imageDropZoneElement.removeEventListener(dropZoneEvents.DROP, this.onImageDrop.bind(this));
        this.removeEventListener(taskActions.ADD, this.onTaskAdd);
        this.removeEventListener(taskActions.EDIT, this.onTaskEdit);
        this.removeEventListener(taskActions.VIEW, this.onTaskView);
        this.removeEventListener(taskActions.DELETE, this.onTaskDelete);
        this._titleElement.removeEventListener("click", this.onTitleClick);
    }

    public onTitleClick() {
        this._router.navigate(["epic", "view", this.epicId]);
    }

    public onImageDrop(e) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/digitalasset/upload?id=${this.storyId}`, true);
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this._router.navigate(["epic", this.epicId, "story", "edit",this.storyId]);
                }
                else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send(e.detail.files);
    }

    public async onTaskAdd(e:any) {
        e.stopPropagation();        
        if (this.storyId) {
            const task = Object.assign(e.detail.task, { storyId: this.storyId });

            await this._taskService.add(task);

            if (!this.tasks.find(t => t.id === task.id)) {
                this.tasks.push(task);
            } else {
                this.tasks[this.tasks.findIndex(t => t.id === task.id)] = task;
            }

            this._taskEditComponent.setAttribute("task", JSON.stringify(new Task()));
            this._taskListComponent.setAttribute("tasks", JSON.stringify(this.tasks));
        }
    }

    public onTaskEdit(e: any) {
        e.stopPropagation();        
        const task: Task = this.tasks.find(t => t.id == e.detail.taskId);
        this._taskEditComponent.setAttribute("task", JSON.stringify(task));
        this._window.scrollTo(0, 0);
    }

    public onTaskView(e: any) {
        e.stopPropagation();
        const task: Task = this.tasks.find(t => t.id == e.detail.taskId);
        this._taskEditComponent.setAttribute("task", JSON.stringify(task));
        this._window.scrollTo(0, 0);
    }

    public onTabSelectedIndexChanged(e: any) {
        this._router.navigate(["epic",this.epicId,"story", "edit", this.storyId, "tab", e.detail.selectedIndex]);
    }

    public async onTaskDelete(e: any) {
        e.stopPropagation();
        const task: Task = this.tasks.find(t => t.id == e.detail.taskId);      
        await this._taskService.remove({ id: e.detail.taskId });
        this.tasks.splice(this.tasks.indexOf(task), 1);
        if (this._taskEditComponent.taskId == e.detail.taskId)
            this._taskEditComponent.setAttribute("task", JSON.stringify(new Task()));
        this._taskListComponent.setAttribute("tasks", "");
    }

    public async onSave() {
        const story = {
            id: this.storyId,
            epicId: this.epicId,
            name: this.nameInputElement.value,
            priority: this.priorityElement.id,
            description: this.descriptionEditor.text,
            notes: this.notesEditor.text,
            points: this.pointsInputElement.value,
            completedDate: this.completedDateElement.value,
            architecturePoints: this.architecturePointsInputElement.value
        } as Story;
        
        await this._storyService.add(story);
        this._router.navigate(["epic", "view", this.epicId]);
    }

    public async onDelete() {        
        await this._storyService.remove({ id: this.storyId });
        this._router.navigate(["epic", "view", this.epicId]);       
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "story-id":
                this.storyId = newValue;
                break;

            case "epic-id":
                this.epicId = newValue;
                break;

            case "tab-index":
                this.customTabIndex = newValue;
                break;
        }        
    }

    public storyId: number = 0;
    public epicId: number;
    public customTabIndex: any;
    public tasks: Array<Task> = [];
    public get tabsElement(): HTMLElement { return this.querySelector("ce-tabs") as HTMLElement; }
    private get _taskEditComponent(): TaskEditComponent { return this.querySelector("ce-task-edit") as TaskEditComponent; }
    private get _taskListComponent(): TaskListComponent { return this.querySelector("ce-task-list") as TaskListComponent; }
    public get imageDropZoneElement(): DropZoneComponent { return this.querySelector("ce-drop-zone") as DropZoneComponent; }
    public get descriptionElement(): HTMLElement { return this.querySelector(".story-description") as HTMLElement; }
    public descriptionEditor: EditorComponent;
    public get notesElement(): HTMLElement { return this.querySelector(".story-notes") as HTMLElement; }
    public notesEditor: EditorComponent;
    public get priorityElement(): HTMLInputElement { return this.querySelector(".priority") as HTMLInputElement; }
    public get pointsInputElement(): HTMLInputElement { return this.querySelector(".points") as HTMLInputElement; }
    public get architecturePointsInputElement(): HTMLInputElement { return this.querySelector(".architecture-points") as HTMLInputElement; }
    public get digitalAssetsContainer(): HTMLElement { return this.querySelector(".story-digital-assets") as HTMLElement; }
    public get completedDateElement(): HTMLInputElement { return this.querySelector(".completed-date") as HTMLInputElement; }
    private get _titleElement(): HTMLElement { return this.querySelector(".story-edit-title") as HTMLElement; }
    public saveButtonElement: HTMLButtonElement;
    public deleteButtonElement: HTMLButtonElement;
    public nameInputElement: HTMLInputElement;
    public completedDatePicker: any;
}

customElements.define(`ce-story-edit`,StoryEditComponent);
