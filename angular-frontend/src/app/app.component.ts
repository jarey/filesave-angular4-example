import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * 
   * La idea es construir un componente que:
   * 1) Mediante HEAD obtenga los datos del fichero a descargar: 1- tamaño (importantisimo), 2)nombre y extensión.
   * 2) Con esa información componer una estrategia donde mediante N llamadas http, se soliciten parte por parte los chunks del fichero, se obtengan en el servidor y 
   * se descarguen al cliente.
   * 3) Una vez descargados todos los chunks, se unan en el fichero resultante y se descargue dicho fichero al equipo del usuario.
   * 
   * La aproximación de este POC es trabajar inicialmente con fileSaver, pero luego permutar al uso de StreamSaver para poder gestionar tamaños de fichero mucho más elevados
   * sin hacer uso directo de RAM y por tanto evitando potenciales errores de memoria y carga del navegador web.
   * 
   * El comportamiento del backend, al igual que en la subida de ficheros de TUS, tiene que estar alineado con el comportamiento del cliente.
   * 
   * El comportamiento inicial del POC, está orientado a ampliar al máximo el soporte de navegadores. Después se podría complicar en el componente,
   * bien con polyfills o con detección de navegadores en cuestión, para hacer uso por ejemplo del API de Streams, artículo de introducción/referencia a ello:
   * https://jakearchibald.com/2016/streams-ftw/
   * 
   * Profundizar en si el siguiente proyecto ya incluye o aborda lo comentado anteriormente:
   * https://github.com/alferov/angular-file-saver
   * 
   * Otra referencia similar a este POC, trabajando en componente con octec-stream: http://amilspage.com/angular4-file-download/
   * 
   * Uso de la header range para solicitar chunks de fichero: https://stackoverflow.com/questions/23309841/download-file-in-chunks-in-chrome-javascript-api
   * https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks
   * 
   * Soporte a requests mediante rango de bytes en spring mvc: https://stackoverflow.com/questions/28427339/how-to-implement-http-byte-range-requests-in-spring-mvc
   * 
   */

  constructor(private http: HttpClient) { }

  saveFile() {
    let headers = new HttpHeaders()
    headers.append('Accept', 'text/plain');

    this.http.head('http://localhost:8080/api/files', {headers: headers, responseType: 'text', observe: 'response'})
    .toPromise()
    .then(response => this.headInfo(response));


    
  }

  private saveToFileSystem(response: any) {
    console.log("El valor obtenido es: "+response.body);
    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    console.log("Nombre del fichero: "+ filename);
    const blob = new Blob([response.body], { type: 'audio/mpeg3' });
    saveAs(blob, filename);
  }

  private headInfo(response: any) {

    let headers = new HttpHeaders()
    headers.append('Accept', 'text/plain');
    

    console.log("El valor obtenido es: "+response.body);
    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    const contentLength: string = response.headers.get('Content-Length');
    headers.append('Range', "bytes=0-"+contentLength);
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    console.log("Nombre del fichero: "+ filename);
    console.log("Tamaño del fichero: "+ contentLength);

    this.http.get('http://localhost:8080/api/files', {headers: headers, responseType: 'text', observe: 'response'})
      .toPromise()
      .then(response => this.saveToFileSystem(response));
  }
}
