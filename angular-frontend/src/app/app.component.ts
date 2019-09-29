import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  saveFile() {
    let headers = new HttpHeaders()
    headers.append('Accept', 'text/plain');
    this.http.get('http://localhost:8080/api/files', {headers: headers, responseType: 'text'})
      .toPromise()
      .then(response => this.saveToFileSystem(response));
  }

  private saveToFileSystem(response: any) {
    //const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    //const parts: string[] = contentDispositionHeader.split(';');
    //const filename = parts[1].split('=')[1];
    //const blob = new Blob([response._body], { type: 'text/plain' });
    const blob = new Blob([response], { type: 'text/plain' });
    const filename = "MiFichero.txt";
    saveAs(blob, filename);
  }
}
