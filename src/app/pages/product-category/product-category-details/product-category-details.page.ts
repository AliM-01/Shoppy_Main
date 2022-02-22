import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryService } from '@app_services/shop/product-category/product-category.service';
import { ProductCategoryModel } from '@app_models/shop/product-category/product-category';
import { environment } from '@environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { Observable, BehaviorSubject } from 'rxjs';
import { FilterProductCategoryRequestModel } from '@app_models/shop/product-category/filter-product-category-request';
import { FilterProductCategoryResponseModel } from '@app_models/shop/product-category/filter-product-category-response';

@Component({
  selector: 'product-category-details',
  templateUrl: './product-category-details.page.html'
})
export class ProductCategoryDetailsPage implements OnInit {

  baseProductCategoryPath: string = environment.productCategoryBaseImagePath;
  pages: number[] = [];

  filterProductCategory: FilterProductCategoryRequestModel
    = new FilterProductCategoryRequestModel("", [], 0, 9);

  productCategoryData: FilterProductCategoryResponseModel
    = new FilterProductCategoryResponseModel(null, this.filterProductCategory);

  pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>("دسته بندی ");
  pageTitle$: Observable<string> = this.pageTitleSubject.asObservable();

  baseProductPath: string = environment.productBaseImagePath + '/thumbnail/';

  constructor(
    private productCategoryService: ProductCategoryService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private router: Router,
    private meta: Meta,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      
      let pageId = 1;

      if (params.pageId !== undefined) {
        pageId = parseInt(params.pageId, 0);
      }
      const slug = params.slug;

      this.filterProductCategory.slug = slug;
      this.filterProductCategory.pageId = pageId;

      this.getProductCategory();
    });


  }

  getProductCategory(){
    this.productCategoryService.getProductCategoryBy(this.filterProductCategory)
    .subscribe(res => {

      this.pageTitleSubject.next(`دسته بندی : ${res.data.productCategory.title}`);

      this.productCategoryData = res.data;
      this.setMetaTags(res.data.productCategory);

      this.pages = [];

      for (let i = 1; i < ((this.productCategoryData.filterData.allPagesCount / this.productCategoryData.filterData.takePage) + 1); i++) {
        this.pages.push(i);
      }
    });
  }

  setPage(page: number) {
    this.filterProductCategory.pageId = page;
    let queryParams: any = {
      pageId: page
    }
    this.router.navigate([`/category/details/${this.productCategoryData.productCategory.slug}`], { queryParams: queryParams });
  }

  setMetaTags(data: ProductCategoryModel) {
    this.title.setTitle(data.title);
    this.meta.addTags([
      { name: 'keywords', content: data.metaKeywords },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'shoppy' },
      { name: 'description', content: data.metaDescription },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' }
    ]);
  }
}