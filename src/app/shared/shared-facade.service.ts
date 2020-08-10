import { Injectable } from '@angular/core';
import { GmediaService } from '../services/admin/common/gmedia.service';

@Injectable({
  providedIn: 'root'
})
export class SharedFacadeService {

  constructor(private mediaSv: GmediaService) { }

}
