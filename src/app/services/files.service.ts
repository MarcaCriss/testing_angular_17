import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { FileS3Interface } from "../shared/interfaces/file.interface";
import { Observable } from "rxjs";

@Injectable()
export class FilesService {
  private http = inject(HttpClient);
  baseUrl = 'https://api.escuelajs.co/api/v1';

  uploadFile(file: File): Observable<FileS3Interface> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileS3Interface>(
      `${this.baseUrl}/files/upload`,
      formData,
    );
  }
}
