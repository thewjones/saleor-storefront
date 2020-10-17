import "./scss/index.scss";

import classNames from "classnames";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { generateCategoryUrl } from "../../core/utils";

import {
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";

import noPhotoImg from "../../images/no-photo.svg";

const { useEffect } = React;


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

useEffect(() => {
    // Add a class to the body.
    document.body.classList.add('home');

    return () => {
      // Remove the class from the body.
      document.body.classList.remove('home');
    };
  }, ['fixed']);


  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div
        className="home-page__hero"
        style={{backgroundImage: `url(${require("../../images/bullitt-trn.webp")})`}}
      >

      </div>
      <div className="container">
        <div className="home-page__featured">
          <h2>One Bicycle. Many Options.</h2>
          <ul className="home-page__collections">
            <li><a href="/product/bullitt-base/52/" className="basis"><article><h3>Base build</h3></article></a></li>
            <li><a href="/collection/family/3" className="kids"><article><h3>Family</h3></article></a></li>
            <li><a href="/collection/business/5/" className="business"><article><h3>Business</h3></article></a></li>
            <li><a href="/product/ebullitt-business/62/" className="electric"><article><h3>Electric</h3></article></a></li>
            <li><a href="/collection/general-cargo/4/" className="touring"><article><h3>Touring</h3></article></a></li>
            <li><a href="/collection/general-cargo/4/" className="dogs"><article><h3>Dog transport</h3></article></a></li>
          </ul>
        </div>
      </div>

      <div className="home-page__featured home-page__featured--banner">

        <div className="container">
          <h2>Why Bullitt Cargo Bikes?</h2>

          <ul className="home-page__benefits">
            <li>Flexible cargo options that adapt with you</li>
            <li>Use standard bike parts anyone can service</li>
            <li>Beautiful, Danish design</li>
            <li>Built to fit riders of different sizes</li>
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
