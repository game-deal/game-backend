import { HttpService } from '@nestjs/axios';
export declare class AppService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getDeals(free?: boolean, page?: number, title?: string): Promise<any[]>;
    getDealsUrl(free?: boolean, page?: number, title?: string): string;
}
