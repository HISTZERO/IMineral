import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputBaoCaoModel, OutputBaoCaoModel } from "src/app/models/admin/baocao/baocao-dieutrakhaosat.model";

@Injectable({
    providedIn: 'root'
})
export class BaocaoService extends RepositoryEloquentService {

    constructor(public httpClient: HttpClient) {
        super();
        this.setServiceInfo({
            httpClient,
            inputModelName: new InputBaoCaoModel(),
            outputModelName: new OutputBaoCaoModel(),
            apiUrl: environment.apiIMineral + ServiceName.BAOCAO
        });
    }

    public checkBeDeleted(id: string) {
        return "ok";
    }
}