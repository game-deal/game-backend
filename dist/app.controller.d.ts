import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getDeals(free?: boolean, page?: number, title?: string): Promise<any[]>;
}
