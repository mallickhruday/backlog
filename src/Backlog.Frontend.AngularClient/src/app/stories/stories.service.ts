import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Story } from "./story.model";
import { Observable } from "rxjs/Observable";
import { constants } from "../shared/constants";
import { catchError } from "rxjs/operators";

@Injectable()
export class StoriesService {
    constructor(
        private _httpClient: HttpClient,
        @Inject(constants.BASE_URL) private _baseUrl: string
    ) { }

    public addOrUpdate(options: { story: Partial<Story> }) {
        return this._httpClient
            .post(`${this._baseUrl}/api/stories/add`, options)
            .pipe(
                catchError((error) => Observable.throw(error.json()))
            );
    }

    public get(): Observable<{ stories: Array<Partial<Story>> }> {        
        return this._httpClient
            .get<{ stories: Array<Story> }>(`${this._baseUrl}/api/stories/get`)
            .pipe(
                catchError((error) => Observable.throw(error.json()))
            );
    }

    public getById(options: { id: number }): Observable<{ story:Partial<Story>}> {
        return this._httpClient
            .get<{ story: Story }>(`${this._baseUrl}/api/stories/getById?id=${options.id}`)
            .pipe(
                catchError((error) => Observable.throw(error.json()))
            );
    }

    public remove(options: { story: Partial<Story> }) {
        return this._httpClient
            .delete(`${this._baseUrl}/api/stories/remove?id=${options.story.id}`)
            .pipe(
                catchError((error) => Observable.throw(error.json()))
            );
    }    
}
