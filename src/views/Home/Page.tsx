import "./scss/index.scss";

import classNames from "classnames";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { ProductsFeatured } from "../../components";
import { generateCategoryUrl } from "../../core/utils";

import {
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";

import noPhotoImg from "../../images/no-photo.svg";

const Page: React.FC<{
  loading: boolean;
  categories: ProductsList_categories;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage;
  shop: ProductsList_shop;
}> = ({ loading, categories, backgroundImage, shop }) => {
  const categoriesExist = () => {
    return categories && categories.edges && categories.edges.length > 0;
  };
  const intl = useIntl();

  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div
        className="home-page__hero"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage.url})` }
            : null
        }
      >

      </div>
      <div class="container">
        <div className="home-page__featured">
          <h2>One Bicycle. Many Options.</h2>
          <ul className="home-page__collections">
            <li class="basis"><article><h3>Basis</h3></article></li>
            <li class="electric"><article><h3>Electric</h3></article></li>
            <li class="business"><article><h3>Business</h3></article></li>
            <li class="kids"><article><h3>Kids</h3></article></li>
            <li class="touring"><article><h3>Touring</h3></article></li>
            <li class="dogs"><article><h3>Canine Porteur</h3></article></li>
          </ul>
        </div>
      </div>

      <div class="home-page__featured home-page__featured--banner">

        <div class="container">
          <h2>Why Bullitt Cargo Bikes?</h2>

          <ul className="home-page__benefits">
            <li>High quality</li>
            <li>Shape-shifting chassis</li>
            <li>Light & nimble</li>
            <li>Danish design</li>
            <li>One size fits all</li>
            <li>11 colour finishes</li>
            <li>Safe & stable</li>
            <li>Green machines</li>
          </ul>

        </div>
      </div>





      {categoriesExist() && (
        <div className="home-page__categories home-page__featured">
          <div className="container">
            <h2>Buy online</h2>
            <div className="home-page__categories__list">
              {categories.edges.map(({ node: category }) => (
                <div key={category.id}>
                  <Link
                    to={generateCategoryUrl(category.id, category.name)}
                    key={category.id}
                  >
                    <div
                      className={classNames(
                        "home-page__categories__list__image",
                        {
                          "home-page__categories__list__image--no-photo": !category.backgroundImage,
                        }
                      )}
                      style={{
                        backgroundImage: `url(${
                          category.backgroundImage
                            ? category.backgroundImage.url
                            : noPhotoImg
                        })`,
                      }}
                    />
                    <h3>{category.name}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
