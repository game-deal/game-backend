"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cheerio = require("cheerio");
const rxjs_1 = require("rxjs");
let AppService = class AppService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getDeals(free, page, title) {
        let deals_url = this.getDealsUrl(free, page, title);
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get(deals_url)).catch(() => { throw new common_1.NotFoundException(); });
        const $ = cheerio.load(result.data);
        const deals_list_container = $('div[id="deals-list"]');
        const deals_list = $('.list-items', deals_list_container).children();
        const deals = [];
        const no_results = deals_list_container
            .find('div[class="d-flex flex-column wrap_items list emptyProvider"]').text() != "";
        if (no_results) {
            return deals;
        }
        deals_list.each((_index, element) => {
            const name = $('div[class="game-info-title-wrapper"]', element).text();
            const old_price = $('span[class="price-label price-old"]', element).text();
            const new_price = $('span[class="price-inner game-price-new"]', element).text();
            const discount_percentage = $('span[class="discount label"]', element).text();
            const expiry_date = $('span[class="expiry label"]', element).find("time").text();
            let image_url = $('a[class="main-image"]', element).find('img').attr("src");
            if (image_url === null || image_url === void 0 ? void 0 : image_url.includes("data:")) {
                image_url = $('a[class="main-image"]', element).find('img').attr("data-src");
            }
            const discount_url = $('a[class="d-flex flex-align-center flex-justify-center label-with-arrows action-btn-full-box action-btn cta-label-desktop with-arrows action-ext"]', element)
                .attr('href');
            const is_historical_low = $('span[class="historical label"]', element).text() == "Historical low";
            deals.push({
                name: name,
                old_price: old_price,
                new_price: new_price,
                discount_percentage: discount_percentage,
                expiry_date: expiry_date,
                image_url: image_url === null || image_url === void 0 ? void 0 : image_url.replace("154x72", "308x144"),
                discount_url: "https://gg.deals".concat(discount_url),
                is_historical_low: is_historical_low
            });
        });
        return deals;
    }
    getDealsUrl(free, page, title) {
        let deals_url = "https://gg.deals/deals/?minRating=1";
        if (free) {
            deals_url = deals_url.concat("&maxPrice=0");
        }
        if (page) {
            deals_url = deals_url.concat(`&page=${page}`);
        }
        if (title) {
            deals_url = deals_url.concat(`&title=${title}`);
        }
        return deals_url;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map